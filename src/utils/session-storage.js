export const saveMessage = (sender, message) => {
  const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
  history.push({ sender, message, time: new Date().toISOString() });
  localStorage.setItem('chatHistory', JSON.stringify(history));
};

export const getChatHistory = () => {
  return JSON.parse(localStorage.getItem('chatHistory')) || [];
};