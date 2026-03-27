'use client';

import { useState } from 'react';
import ContactForm from './ContactForm';
import QuoteRequestForm from './QuoteRequestForm';

type Tab = 'message' | 'quote';

export default function ContactFormTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('message');

  return (
    <div>
      {/* Tab buttons */}
      <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('message')}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
            activeTab === 'message'
              ? 'bg-white text-brand-green-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Send a Message
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('quote')}
          className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition ${
            activeTab === 'quote'
              ? 'bg-white text-brand-green-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Request a Quote
        </button>
      </div>

      {/* Active form */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {activeTab === 'message' ? <ContactForm /> : <QuoteRequestForm />}
      </div>
    </div>
  );
}
