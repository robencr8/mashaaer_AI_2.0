# Security Best Practices for Mashaaer Enhanced Project

## API Keys and Sensitive Information

This document outlines the best practices for handling API keys and other sensitive information in the Mashaaer Enhanced Project.

### Recent Changes

We've made the following changes to improve security:

1. Updated `.gitignore` to exclude sensitive files:
   - `.env` and all `.env.*` files
   - `backend/keys/*.json` files containing API keys and credentials

2. Removed sensitive files from Git tracking (without deleting them from your local system):
   - `.env`
   - `.env.development`
   - `.env.production`
   - `.env.staging`
   - `backend/keys/gemini-key.json`

3. Created template files with placeholder values:
   - `.env.example` - Template for environment variables
   - `backend/keys/gemini-key.json.example` - Template for Google Cloud service account credentials

### How to Set Up Your Environment

1. **Environment Variables**:
   - Copy `.env.example` to `.env` and fill in your actual API keys:
     ```
     cp .env.example .env
     ```
   - Edit the `.env` file with your actual API keys
   - For different environments, create `.env.development`, `.env.production`, etc. as needed

2. **Google Cloud Service Account**:
   - Copy `backend/keys/gemini-key.json.example` to `backend/keys/gemini-key.json`:
     ```
     cp backend/keys/gemini-key.json.example backend/keys/gemini-key.json
     ```
   - Replace the placeholder values with your actual Google Cloud service account credentials

### Security Best Practices

1. **Never commit sensitive information to Git**:
   - Always check that sensitive files are in `.gitignore`
   - Use `git status` before committing to ensure no sensitive files are staged
   - If you accidentally commit sensitive information, follow the steps in the "Removing Sensitive Data" section below

2. **Use environment variables for sensitive information**:
   - Store API keys, passwords, and other secrets in environment variables
   - Access them in code using `process.env.VARIABLE_NAME`
   - Never hardcode sensitive information directly in your code

3. **Rotate API keys regularly**:
   - Change your API keys periodically
   - Immediately rotate keys if you suspect they've been compromised

4. **Limit API key permissions**:
   - Use the principle of least privilege
   - Only grant the permissions that are absolutely necessary

5. **Use different API keys for different environments**:
   - Development
   - Staging
   - Production

### Removing Sensitive Data

If you accidentally commit sensitive information to Git, follow these steps:

1. **Remove the sensitive files from Git tracking**:
   ```
   git rm --cached .env
   git rm --cached backend/keys/gemini-key.json
   ```

2. **Add the files to `.gitignore`**:
   ```
   echo ".env" >> .gitignore
   echo "backend/keys/*.json" >> .gitignore
   ```

3. **Commit the changes**:
   ```
   git commit -m "Remove sensitive files from Git tracking and update .gitignore"
   ```

4. **Force push to update the remote repository**:
   ```
   git push origin main --force
   ```

5. **Rotate your API keys**:
   - Generate new API keys for all services
   - Update your local `.env` and other files with the new keys
   - Revoke the old keys

### Additional Resources

- [GitHub Documentation on Removing Sensitive Data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [OWASP Cheat Sheet for API Security](https://cheatsheetseries.owasp.org/cheatsheets/API_Security_Cheat_Sheet.html)
- [Best Practices for Managing API Keys](https://cloud.google.com/apis/docs/api-keys-best-practices)