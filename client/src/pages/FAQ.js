import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import './FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Is Total Raffle really free?',
      answer: 'Yes! Creating an account and earning entries is completely free. You will never be asked to pay anything to participate in our prize draws.'
    },
    {
      question: 'How do I earn entries?',
      answer: 'You can earn entries by completing simple tasks such as following our social media accounts, watching short advertisements, daily logins, and referring friends. Each task rewards you with a specific number of entries.'
    },
    {
      question: 'How are winners selected?',
      answer: 'Winners are selected using a random number generator. Each entry you have gives you one chance to win. The selection process is completely fair and transparent.'
    },
    {
      question: 'When will I know if I\'ve won?',
      answer: 'Winners are notified via email within 24 hours of the draw closing. Make sure to check your email regularly and add us to your safe senders list.'
    },
    {
      question: 'Can I enter the same prize multiple times?',
      answer: 'Yes! You can use multiple entries on the same prize to increase your chances of winning, up to the maximum entries allowed per user for that specific prize.'
    },
    {
      question: 'How do I claim my prize?',
      answer: 'If you win, we will contact you via email with instructions on how to claim your prize. For cash prizes, we will arrange a bank transfer. For physical items, we will arrange delivery to your address.'
    },
    {
      question: 'Are there any age restrictions?',
      answer: 'Yes, you must be 18 years or older to participate in our prize draws. We may request proof of age before awarding prizes.'
    },
    {
      question: 'Can I transfer my entries to someone else?',
      answer: 'No, entries are non-transferable and can only be used by the account holder who earned them.'
    },
    {
      question: 'What happens to my entries if I don\'t win?',
      answer: 'Entries used in a prize draw are consumed regardless of whether you win or not. However, you can always earn more entries by completing tasks.'
    },
    {
      question: 'How often are new prizes added?',
      answer: 'We add new prizes regularly, typically several times per week. Check back often or enable notifications to stay updated on new prize opportunities.'
    },
    {
      question: 'Is my personal information safe?',
      answer: 'Yes, we take data privacy very seriously. We use industry-standard encryption and never sell your personal information to third parties. Read our Privacy Policy for more details.'
    },
    {
      question: 'Can I delete my account?',
      answer: 'Yes, you can delete your account at any time from your account settings. Please note that deleting your account will forfeit any unused entries and you will not be eligible for any pending prize draws.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="page-header">
        <div className="container">
          <HelpCircle size={64} />
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about Total Raffle</p>
        </div>
      </div>

      <div className="container">
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                <span>{faq.question}</span>
                {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="contact-cta">
          <h2>Still have questions?</h2>
          <p>Can't find the answer you're looking for? Get in touch with our support team.</p>
          <a href="/contact" className="cta-btn">Contact Us</a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
