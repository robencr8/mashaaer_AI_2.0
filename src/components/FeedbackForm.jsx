import React, { useState } from 'react';

/**
 * FeedbackForm component allows users to submit feedback about the application.
 * It demonstrates form handling and validation in React.
 */
const FeedbackForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    feedback: '',
    category: 'general'
  });
  
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.feedback.trim()) {
      newErrors.feedback = 'Feedback is required';
    } else if (formData.feedback.trim().length < 10) {
      newErrors.feedback = 'Feedback must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (onSubmit) {
        onSubmit(formData);
      }
      setSubmitted(true);
      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        rating: 5,
        feedback: '',
        category: 'general'
      });
    }
  };
  
  if (submitted) {
    return (
      <div className="feedback-success">
        <h3>Thank you for your feedback!</h3>
        <p>We appreciate your input and will use it to improve our service.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="btn-submit"
        >
          Submit another feedback
        </button>
      </div>
    );
  }
  
  return (
    <div className="feedback-form-container">
      <h2>Provide Your Feedback</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && <span id="name-error" className="error-message">{errors.name}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <span id="email-error" className="error-message">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="general">General</option>
            <option value="voice">Voice Features</option>
            <option value="emotion">Emotion Detection</option>
            <option value="ui">User Interface</option>
            <option value="performance">Performance</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="rating">Rating (1-10)</label>
          <input
            type="number"
            id="rating"
            name="rating"
            min="1"
            max="10"
            value={formData.rating}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="feedback">Your Feedback</label>
          <textarea
            id="feedback"
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            rows="5"
            className={errors.feedback ? 'error' : ''}
            aria-describedby={errors.feedback ? 'feedback-error' : undefined}
          ></textarea>
          {errors.feedback && <span id="feedback-error" className="error-message">{errors.feedback}</span>}
        </div>
        
        <button type="submit" className="btn-submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackForm;