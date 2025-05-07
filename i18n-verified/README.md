# Linguistically Verified Files

This directory contains copies of all files that have been linguistically validated in the Mashaaer Enhanced Project. These files have been verified to contain correct language content in their respective languages.

## Purpose

1. **Preservation**: To maintain a clean copy of linguistically validated files
2. **Reference**: To serve as a reference for translators and developers
3. **Integration**: Ready for integration with translation platforms like Crowdin or Lokalise

## Contents

- **Filipino Language Files**: 
  - `src/translations/locales/fil.json` - Filipino language translations
  - `src/translations/locales/fil.json.validated` - Validation marker file

- **Batch Script Files**:
  - `launch-production.bat` - Production launcher script
  - `build-and-serve.bat` - Build and serve script

- **Python Files with Arabic Content**:
  - `backend/music_recommender.py` - Music recommendation system with Arabic content

## Usage Guidelines

1. **Do Not Modify**: These files should not be modified directly. Any changes should be made to the original files and then re-validated.
2. **Translation Integration**: Use these files as the source of truth when integrating with translation platforms.
3. **Read-Only**: These files are intended to be read-only. A lock script is provided to enforce this.

## Validation Process

All files in this directory have undergone linguistic validation as documented in the `LINGUISTIC_VALIDATION_REPORT.md` file at the project root.