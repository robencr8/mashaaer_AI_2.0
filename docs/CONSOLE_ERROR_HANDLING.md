# Console Error Handling Guide

## Overview

This document explains how to handle console errors in the Mashaaer Enhanced Project, particularly those coming from browser extensions rather than the application code itself.

## Common External Errors

The application may show the following errors in the browser console that are **not** from the application code:

1. **Failed to load resource: net::ERR_FILE_NOT_FOUND**
   - For files like `extensionState.js`, `heuristicsRedefinitions.js`, `utils.js`
   - These errors come from browser extensions, not from our application

2. **Content Security Policy blocks the use of 'eval'**
   - These errors typically come from browser extensions trying to use `eval()` or similar functions
   - Our application does not use `eval()` directly

## Implemented Solutions

The project includes two mechanisms to handle these external errors:

### 1. Content Security Policy

A Content Security Policy (CSP) has been added to the `index.html` file:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:5000">
```

This policy:
- Restricts script sources to the same origin and inline scripts
- Restricts style sources to the same origin and inline styles
- Allows connections to the backend server at http://localhost:5000
- Helps prevent some CSP errors from browser extensions

### 2. Console Error Filter

A console error filter utility has been implemented in `src/utils/console-filter.js` that:
- Filters out "Failed to load resource" errors for known extension files
- Filters out CSP errors related to `eval` from external sources
- Is initialized in `index.js` when the application starts

## How to Use

### Viewing Filtered Console

The console filter is automatically applied when the application starts. To see only relevant errors:

1. Open the browser console (F12 or Ctrl+Shift+I)
2. Errors from browser extensions will be filtered out
3. In debug mode, filtered errors will be prefixed with `[Filtered Extension Error]` or `[Filtered CSP Error]`

### Manually Filtering in DevTools

If you prefer to use the browser's built-in filtering:

1. Open the browser console
2. Click on "Filter" or the funnel icon
3. Enable only "Errors from source: localhost"
4. Disable "Verbose", "Info", and "External sources"

## Troubleshooting

### Distinguishing Real Errors

Real application errors will still appear in the console. To distinguish them:

- They will not contain "net::ERR_FILE_NOT_FOUND" for extension files
- They will not be CSP errors related to `eval` from external sources
- They will typically reference files within your application

### Adding New Filters

If you encounter new types of extension errors that should be filtered:

1. Open `src/utils/console-filter.js`
2. Add new conditions to the filtering logic in both `initializeConsoleFilter()` and `getFilteredConsole()`
3. Test to ensure legitimate errors are still displayed

## Conclusion

By implementing these solutions, we've made it easier to focus on real application errors while ignoring noise from browser extensions. This improves the development experience and makes debugging more efficient.