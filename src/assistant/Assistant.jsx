import React, { useEffect } from 'react';
import SmartPersonalAssistant from './smart-personal-assistant.js';

const Assistant = () => {
  useEffect(() => {
    const assistant = new SmartPersonalAssistant();
    assistant.initialize();
  }, []);

  return <></>;
};

export default Assistant;
