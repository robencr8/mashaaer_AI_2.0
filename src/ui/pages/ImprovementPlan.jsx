import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const ImprovementPlan = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch('/docs/plan.md')
      .then((res) => res.text())
      .then((text) => setMarkdown(text));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">📌 خطة تحسين مشروع مشاعر</h1>
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
};

export default ImprovementPlan;