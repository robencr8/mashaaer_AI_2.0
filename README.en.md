# Running the Mashaaer Enhanced Application at Full Capacity and Viewing Achievements

This guide explains how to run the Mashaaer Enhanced application at full capacity and view the available achievements.

## System Requirements

Before starting, make sure you have installed the following requirements:
- Node.js
- npm
- Python
- pip

## Running Steps

### 1. Running the Application at Full Capacity

To run the application at full capacity (user interface and backend server), execute the following command in PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File bootstrap.ps1
```

This command will:
- Check the basic requirements
- Install dependencies for the frontend and backend
- Initialize the backend server (Flask)
- Initialize the frontend (React)
- Set up system health monitoring

After the process is complete, the following will be running:
- User interface at: http://localhost:3000
- Backend server at: http://localhost:5000
- System metrics at: http://localhost:5000/api/metrics

#### Successful Operation

If the message `Mashaaer Enhanced Project has been successfully bootstrapped!` appears, this means the operation was successful.

#### Error Handling

In case errors appear during operation:

❗ If the message `ERR_CONNECTION_REFUSED` appears
Make sure the backend server is running on localhost:5000 using the command:

```bash
python backend/app.py
```

❗ If error messages related to basic requirements appear
Make sure all requirements mentioned in the "System Requirements" section are installed.

### 2. Viewing Achievements

#### Viewing Emotion Records (Emotional Timeline)

You can view the emotion record in one of the following two ways:

1. **Through the user interface**:
   - Go to http://localhost:3000
   - Click on the "Emotion Record" 😊 button at the bottom right of the screen

2. **Through the direct link**:
   - Go to http://localhost:3000/emotions

The emotional timeline will appear with statistics such as:
- Most frequent emotions
- Average emotion intensity
- Number of recorded emotions
- Visual display of emotions over time

#### Viewing Interaction Achievements (Milestones)

Interaction achievements include:
- Relationship stages (new relationship, acquaintance, familiarity, trust, companionship)
- Interaction count milestones (10, 50, 100, 500, 1000 interactions)
- Daily, weekly, monthly, and yearly interaction memories

To view these achievements:
1. Interact with the assistant by entering messages in the input field
2. As your interaction increases, you will progress through relationship stages and achieve more milestones
3. The system will automatically congratulate you when you achieve a new milestone

🎉 **Interactive Achievement Messages**:
When you achieve a new achievement, a friendly message will appear such as:
"Congratulations! You have reached the [Trust] level after [100] interactions. Keep going!"

Examples of achievement messages:
- "It's been 7 days since the beginning of our conversations. Thank you for your continued communication!"
- "This is our 50th conversation! Thank you for your continued interaction."
- "It's been a month since the beginning of our conversations. I appreciate your continued trust!"

## Exploring Additional Features

- **System Report**: Click on the "System Report" 📊 button at the bottom right of the screen to view information about system performance
- **Theme Settings**: Click on the "Theme Settings" 🎨 button to customize the application's appearance
- **Voice Test**: Use the "Test Voice" button to test voice features
- **Voice Interaction**: Click on the "Speak Now" 🎤 button to interact with the assistant using voice

## Stopping the Application

To stop the application, press Ctrl+C in the open PowerShell windows for the frontend and backend.