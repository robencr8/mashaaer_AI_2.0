# Translation Infrastructure with Supabase

This document provides information about the translation infrastructure implemented in the Mashaaer Enhanced Project. The system uses Supabase as a backend service to enable real-time collaborative translation management, version tracking, and multi-user editing.

## Overview

The translation infrastructure consists of the following components:

1. **Supabase Backend**: A PostgreSQL database with real-time capabilities for storing and managing translations
2. **Translation Service**: A JavaScript service that interfaces with the Supabase backend
3. **TranslationAdmin Component**: A React component for managing translations through a user interface
4. **Local Fallback**: A system that falls back to local JSON files when the Supabase backend is unavailable

## Setting Up Supabase

### 1. Create a Supabase Project

1. Sign up for a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key (public API key)

### 2. Configure Environment Variables

Create or update your `.env` file with the following variables:

```
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set Up Database Tables

Execute the following SQL in the Supabase SQL Editor to create the necessary tables:

```sql
-- Languages table
CREATE TABLE languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  dir TEXT NOT NULL DEFAULT 'ltr',
  flag TEXT
);

-- Categories table
CREATE TABLE categories (
  name TEXT PRIMARY KEY,
  description TEXT
);

-- Translations table
CREATE TABLE translations (
  id BIGSERIAL PRIMARY KEY,
  language TEXT NOT NULL REFERENCES languages(code),
  category TEXT NOT NULL REFERENCES categories(name),
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT,
  UNIQUE(language, category, key)
);

-- Translation history table
CREATE TABLE translation_history (
  id BIGSERIAL PRIMARY KEY,
  translation_id BIGINT NOT NULL REFERENCES translations(id),
  language TEXT NOT NULL,
  category TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT
);

-- Active users table
CREATE TABLE active_users (
  user_id TEXT PRIMARY KEY,
  language TEXT NOT NULL,
  category TEXT NOT NULL,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health check table
CREATE TABLE health_check (
  id SERIAL PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'ok',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial health check record
INSERT INTO health_check (status) VALUES ('ok');

-- Import translations function
CREATE OR REPLACE FUNCTION import_translations(
  p_language TEXT,
  p_translations JSONB,
  p_user_id TEXT
) RETURNS VOID AS $$
DECLARE
  v_category TEXT;
  v_key TEXT;
  v_value TEXT;
  v_existing_id BIGINT;
BEGIN
  -- Loop through each category
  FOR v_category IN SELECT jsonb_object_keys(p_translations) LOOP
    -- Loop through each key in the category
    FOR v_key, v_value IN SELECT * FROM jsonb_each_text(p_translations->v_category) LOOP
      -- Check if translation exists
      SELECT id INTO v_existing_id
      FROM translations
      WHERE language = p_language AND category = v_category AND key = v_key;
      
      IF v_existing_id IS NOT NULL THEN
        -- Save to history
        INSERT INTO translation_history (
          translation_id, language, category, key, value, created_by
        ) VALUES (
          v_existing_id, p_language, v_category, v_key, 
          (SELECT value FROM translations WHERE id = v_existing_id),
          p_user_id
        );
        
        -- Update existing translation
        UPDATE translations
        SET value = v_value, updated_at = NOW(), updated_by = p_user_id
        WHERE id = v_existing_id;
      ELSE
        -- Insert new translation
        INSERT INTO translations (
          language, category, key, value, created_by, updated_by
        ) VALUES (
          p_language, v_category, v_key, v_value, p_user_id, p_user_id
        );
      END IF;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### 4. Set Up Row-Level Security (RLS)

To secure your data, set up Row-Level Security policies:

```sql
-- Enable RLS on all tables
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_check ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (read-only)
CREATE POLICY "Allow public read access to languages" 
  ON languages FOR SELECT USING (true);

CREATE POLICY "Allow public read access to categories" 
  ON categories FOR SELECT USING (true);

CREATE POLICY "Allow public read access to translations" 
  ON translations FOR SELECT USING (true);

CREATE POLICY "Allow public read access to health_check" 
  ON health_check FOR SELECT USING (true);

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to update translations" 
  ON translations FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert translations" 
  ON translations FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert translation_history" 
  ON translation_history FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to read translation_history" 
  ON translation_history FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own active status" 
  ON active_users FOR ALL USING (true);
```

### 5. Seed Initial Data

Populate the languages and categories tables with initial data:

```sql
-- Insert supported languages
INSERT INTO languages (code, name, native_name, dir, flag) VALUES
  ('ar', 'Arabic', 'العربية', 'rtl', '🇸🇦'),
  ('en', 'English', 'English', 'ltr', '🇺🇸'),
  ('fr', 'French', 'Français', 'ltr', '🇫🇷'),
  ('ur', 'Urdu', 'اردو', 'rtl', '🇵🇰'),
  ('hi', 'Hindi', 'हिन्दी', 'ltr', '🇮🇳'),
  ('tr', 'Turkish', 'Türkçe', 'ltr', '🇹🇷'),
  ('fil', 'Filipino', 'Filipino', 'ltr', '🇵🇭');

-- Insert categories
INSERT INTO categories (name, description) VALUES
  ('ui', 'User interface elements'),
  ('tooltips', 'Tooltips for UI elements'),
  ('onboarding', 'Onboarding modal content');
```

## Using the Translation Service

The `translationService` provides a comprehensive API for interacting with the Supabase backend:

### Initialization

```javascript
import translationService from '../services/translationService';

// Initialize the service
translationService.init();

// Check connection to Supabase
const isConnected = await translationService.checkConnection();
```

### Loading Translations

```javascript
// Get translations for a specific language and category
const translations = await translationService.getTranslations('en', 'ui');

// Get all supported languages
const languages = await translationService.getLanguages();

// Get all categories
const categories = await translationService.getCategories();
```

### Saving Translations

```javascript
// Save a translation
const success = await translationService.saveTranslation(
  'en',           // language
  'ui',           // category
  'welcomeMessage', // key
  'Hello, world!',  // value
  'user_123'      // user ID
);
```

### Version History

```javascript
// Get translation history
const history = await translationService.getTranslationHistory(
  'en',           // language
  'ui',           // category
  'welcomeMessage'  // key
);
```

### Real-time Updates

```javascript
// Subscribe to translation changes
const subscription = translationService.subscribeToTranslations(
  'en',           // language
  'ui',           // category
  (payload) => {
    // Handle the update
    console.log('Translation updated:', payload);
    // Reload translations
    loadTranslations();
  }
);

// Unsubscribe when done
subscription.unsubscribe();
```

### Collaborative Editing

```javascript
// Update user activity
await translationService.updateUserActivity(
  'user_123',     // user ID
  'en',           // language
  'ui'            // category
);

// Get active users
const activeUsers = await translationService.getActiveUsers();
```

### Import/Export

```javascript
// Export all translations for a language
const exportData = await translationService.exportTranslations('en');

// Import translations
const success = await translationService.importTranslations(
  'en',           // language
  exportData,     // translations object
  'user_123'      // user ID
);
```

## Using the TranslationAdmin Component

The `TranslationAdmin` component provides a user interface for managing translations:

```jsx
import TranslationAdmin from './components/TranslationAdmin';

function App() {
  return (
    <div className="app">
      {/* Other components */}
      <TranslationAdmin />
    </div>
  );
}
```

### Features

The TranslationAdmin component provides the following features:

1. **Authentication**: Simple password-based authentication (for demo purposes)
2. **Language Selection**: Select from supported languages
3. **Category Selection**: Select from available categories
4. **Translation Editing**: Edit translation values
5. **Version History**: View and restore previous versions of translations
6. **Collaborative Editing**: See who else is editing translations
7. **Export**: Export translations to JSON files
8. **Offline Mode**: Fall back to local JSON files when Supabase is unavailable

### Authentication

For demonstration purposes, the component uses a simple password-based authentication system. In a production environment, this should be replaced with a more secure authentication system.

Default password: `admin123`

## Fallback Mechanism

The translation infrastructure includes a fallback mechanism that uses local JSON files when the Supabase backend is unavailable:

1. The `translationService.getTranslations()` method first attempts to load translations from Supabase
2. If that fails, it falls back to importing the local JSON file
3. The `TranslationAdmin` component displays a message indicating that it's in "Local Mode"
4. Changes made in Local Mode are only stored in memory and are lost when the page is refreshed

## Database Schema

### Languages Table

| Column      | Type | Description                      |
|-------------|------|----------------------------------|
| code        | TEXT | Primary key, language code (e.g., 'en') |
| name        | TEXT | English name of the language     |
| native_name | TEXT | Name of the language in its own script |
| dir         | TEXT | Text direction ('ltr' or 'rtl')  |
| flag        | TEXT | Emoji flag for the language      |

### Categories Table

| Column      | Type | Description                      |
|-------------|------|----------------------------------|
| name        | TEXT | Primary key, category name       |
| description | TEXT | Description of the category      |

### Translations Table

| Column      | Type | Description                      |
|-------------|------|----------------------------------|
| id          | BIGSERIAL | Primary key                 |
| language    | TEXT | Foreign key to languages.code    |
| category    | TEXT | Foreign key to categories.name   |
| key         | TEXT | Translation key                  |
| value       | TEXT | Translation value                |
| created_at  | TIMESTAMP | Creation timestamp          |
| created_by  | TEXT | User ID who created the translation |
| updated_at  | TIMESTAMP | Last update timestamp       |
| updated_by  | TEXT | User ID who last updated the translation |

### Translation History Table

| Column      | Type | Description                      |
|-------------|------|----------------------------------|
| id          | BIGSERIAL | Primary key                 |
| translation_id | BIGINT | Foreign key to translations.id |
| language    | TEXT | Language code                    |
| category    | TEXT | Category name                    |
| key         | TEXT | Translation key                  |
| value       | TEXT | Previous translation value       |
| created_at  | TIMESTAMP | When this history entry was created |
| created_by  | TEXT | User ID who made the change      |

### Active Users Table

| Column      | Type | Description                      |
|-------------|------|----------------------------------|
| user_id     | TEXT | Primary key, user ID             |
| language    | TEXT | Language being edited            |
| category    | TEXT | Category being edited            |
| last_active | TIMESTAMP | When the user was last active |

## Best Practices

1. **Regular Exports**: Regularly export translations to JSON files as a backup
2. **User Management**: Implement a proper user management system for production use
3. **Monitoring**: Monitor the active_users table to see who is editing translations
4. **Version Control**: Use the translation history to track changes and revert if necessary
5. **Collaborative Workflow**: Coordinate with other translators to avoid conflicts
6. **Testing**: Test translations in the application to ensure they display correctly

## Troubleshooting

### Connection Issues

If you're having trouble connecting to Supabase:

1. Check that your environment variables are set correctly
2. Verify that your Supabase project is running
3. Check the browser console for error messages
4. Try the health check endpoint: `await translationService.checkConnection()`

### Missing Translations

If translations are not appearing:

1. Check that the language and category exist in the database
2. Verify that the translation keys match between the application and the database
3. Check for errors in the browser console
4. Try exporting the translations to see what's in the database

### Real-time Updates Not Working

If real-time updates are not working:

1. Check that you're subscribed to the correct channel
2. Verify that the Supabase real-time service is enabled
3. Check for errors in the browser console
4. Try manually reloading the translations

## Future Enhancements

1. **Machine Translation**: Integrate with translation APIs to provide automatic translation suggestions
2. **Translation Memory**: Implement a translation memory system to suggest translations based on previous work
3. **Quality Checks**: Add quality checks for translations (e.g., missing placeholders, length validation)
4. **Workflow Approval**: Implement an approval workflow for translations
5. **Translation Comments**: Allow translators to add comments to translations
6. **Translation Statistics**: Track translation progress and statistics
7. **Import from CSV/Excel**: Allow importing translations from CSV or Excel files
8. **API Access**: Provide an API for external tools to access translations