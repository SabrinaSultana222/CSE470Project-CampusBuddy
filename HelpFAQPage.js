// client/src/pages/HelpFAQPage.js
import React from 'react';

const faqData = [
  {
    question: 'How do I reset my password?',
    answer: 'Go to your profile settings and select “Reset Password”.'
  },
  {
    question: 'Who can post in club activities?',
    answer: 'Club admins and authorized members can create posts.'
  },
  {
    question: 'How can I join a campus club?',
    answer: 'Go to the Clubs page and click “Join” on your preferred club.'
  },
  {
    question: 'What should I do if I find a lost item?',
    answer: 'Report it through the Lost and Found page under the relevant category.'
  }
];

export default function HelpFAQPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: 700, margin: 'auto' }}>
      <h1 style={{ textAlign: 'center' }}>Help & FAQ</h1>
      {faqData.map((faq, i) => (
        <div key={i} style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          <h3 style={{ color: '#1976d2' }}>{faq.question}</h3>
          <p>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}
