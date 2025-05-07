# Test Reporting in Mashaaer Enhanced Project

This document explains the test reporting features added to the Mashaaer Enhanced Project.

## Overview

The project now includes:

1. Automatic test execution during packaging
2. HTML test reports generation
3. Test results display in the DebugPanel

## Features

### 1. Automatic Test Execution During Packaging

The packaging script (`packaging/package-app.ps1`) now runs tests before building the application. If tests fail, the packaging process will be aborted.

```powershell
# Step 1.5: Run tests
Write-Host "Running tests..." -ForegroundColor Cyan
Set-Location ..
npm run test -- --watchAll=false
if ($LASTEXITCODE -ne 0) {
    Write-Host "Tests failed. Exiting." -ForegroundColor Red
    exit 1
}
```

### 2. HTML Test Reports

The project uses `jest-html-reporter` to generate HTML reports of test results. The configuration is in `package.json`:

```json
"jest": {
  "reporters": [
    "default",
    ["jest-html-reporter", {
      "pageTitle": "Mashaaer Test Report",
      "outputPath": "test-report.html",
      "includeFailureMsg": true,
      "includeConsoleLog": true,
      "theme": "darkTheme"
    }]
  ]
}
```

The HTML report is generated at `test-report.html` in the project root.

### 3. Test Results in DebugPanel

The DebugPanel now includes a section to view test results:

- View the latest test report
- Refresh the test report
- Run tests manually
- Open the full test report in a new tab

## Usage

### Running Tests

To run tests and generate a report:

```bash
npm test
```

### Viewing Test Results

1. Open the application in development mode
2. Open the DebugPanel (visible in development mode)
3. Scroll down to the "Test Results" section
4. Click "Show Test Report" to view the test results
5. Click "Refresh" to reload the test report
6. Click "Run Tests" to run tests manually
7. Click "Open full test report in new tab" to view the full report

### During Packaging

When running the packaging script, tests will be executed automatically:

```powershell
cd packaging
.\package-app.ps1
```

If tests pass, the packaging process will continue. If tests fail, the packaging process will be aborted.

## Implementation Details

### Dependencies

- `jest-html-reporter`: Generates HTML reports of test results

### Files Modified

1. `packaging/package-app.ps1`: Added test execution step
2. `package.json`: Added jest-html-reporter dependency and configuration
3. `src/components/DebugPanel.jsx`: Added test results display

## Troubleshooting

If you encounter issues with the test reporting:

1. Make sure jest-html-reporter is installed:
   ```bash
   npm install --save-dev jest-html-reporter
   ```

2. Check if the test-report.html file exists in the project root after running tests

3. If the report is not displayed in the DebugPanel, try clicking the "Refresh" button

4. If running tests manually from the DebugPanel doesn't work, try running tests from the command line:
   ```bash
   npm test
   ```