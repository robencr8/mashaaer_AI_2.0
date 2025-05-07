# Guide to Running and Testing the "Mashaaer" Application

This guide explains how to run the "Mashaaer" application and test its various features.

## Running the Application

To run the application with all its features:

1. Double-click the `run-mashaaer-full.bat` file in the project's root directory
   - If you're using PowerShell or Command Prompt, use the command `.\run-mashaaer-full.bat`
2. Wait for the system to initialize (this may take a few minutes the first time)
3. Once the system is running, you'll see both the backend and frontend active
4. The user interface will be fully functional with voice capabilities enabled

## Testing Features

After running the application, you can test the following features:

### 1. Automatic Notifications

You can test the automatic notification system by:
- Interacting with the smart assistant and observing the notifications that appear
- Trying different types of notifications (success, error, info)

### 2. Identity Verification

You can test the identity verification system by:
- Logging in or creating a new account
- Navigating to the profile page to verify your identity
- Trying verification via email, SMS, or WhatsApp
- Observing the change in verification status after completing the process

### 3. Restricted Features

You can test the restricted features system by:
- Attempting to access advanced features before verifying your identity
- Observing how access to some features is restricted
- Verifying your identity and then trying to access the restricted features again

### 4. Smart Assistant

You can test the smart assistant by:
- Speaking or typing to the assistant
- Asking different questions to test the assistant's capabilities
- Trying voice commands if a microphone is available

### 5. Emotion Analysis

You can test the emotion analysis system by:
- Expressing different emotions in your conversation with the assistant
- Observing how the assistant responds to your emotions
- Monitoring the change in colors and icons based on detected emotions

## Troubleshooting

If you encounter issues running the application:

1. **Backend Not Working**: Check the log files in the project directory for error messages
2. **Voice Not Working**: Make sure your browser allows microphone access and audio playback
3. **UI Not Loading**: Check the browser console for error messages
4. **Tokenizers Issues**: The script should automatically fix tokenizers installation problems

## Alternative Methods

If you prefer more control over the startup process:

1. You can run `enhanced-start.bat` directly for the same functionality
2. For advanced users, you can run `start-mashaaer.ps1` from PowerShell with specific environment variables

For more detailed information about Mashaaer's features and capabilities, refer to the main [README.md](../README.md) file or the [ENHANCED_START_GUIDE.md](../ENHANCED_START_GUIDE.md).