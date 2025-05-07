# Mashaaer Enhanced Project - NPM Scripts Guide

This document provides information about the available npm scripts for running and managing the Mashaaer Enhanced Project.

## Running the Application

### Development Mode

You can run the application in development mode using either of these commands:

```bash
npm run dev
```

OR

```bash
npm run start
```

Both commands do the same thing - they start the React development server with hot reloading enabled.

### Building for Production

To build the application for production:

```bash
npm run build
```

This creates a production-ready build in the `build` directory.

## Testing

The project includes several testing scripts:

- `npm test` - Run all tests with watch mode enabled
- `npm run test:nonwatch` - Run all tests without watch mode
- `npm run test:app` - Test all app functions
- `npm run test:emotion` - Test emotion detection
- `npm run test:ui` - Test UI components
- `npm run test:backend` - Test backend functionality
- `npm run test:all` - Run all test suites

## Utility Scripts

- `npm run setup` - Set up the project (install dependencies, etc.)
- `npm run lint` - Run ESLint to check for code issues
- `npm run lint:fix` - Run ESLint and automatically fix issues
- `npm run fix:react-dev-utils` - Fix issues with react-dev-utils

## Notes

- The application uses `react-app-rewired` instead of standard `react-scripts` to allow for custom webpack configuration without ejecting.
- The `NODE_OPTIONS=--openssl-legacy-provider` flag is used to handle compatibility issues with newer Node.js versions.