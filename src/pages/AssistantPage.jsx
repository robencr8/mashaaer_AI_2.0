import React from 'react';
import AssistantUI from '../components/AssistantUI.jsx';
import EmotionTimeline from '../components/EmotionTimeline.jsx';
import SubscriptionManager from '../components/SubscriptionManager.jsx';
import VoiceSettings from '../components/VoiceSettings.jsx';
import IntegrationSettings from '../components/IntegrationSettings.jsx';

const AssistantPage = () => {
  return (
    <div className="assistant-page">
      <AssistantUI />
      <EmotionTimeline />
      <SubscriptionManager />
      <VoiceSettings />
      <IntegrationSettings />
    </div>
  );
};

export default AssistantPage;
