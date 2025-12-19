import React, { useState, useEffect } from 'react';
import { quotes } from '../utils/multiApi';

const QuotesPage = () => {
  const [quote, setQuote] = useState({ quote: 'Loading...', role: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuote();
  }, []);

  const loadQuote = async () => {
    setLoading(true);
    const data = await quotes.random();
    setQuote(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-10 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="mb-8 text-4xl font-bold">Movie Quotes</h1>
          
          {loading ? (
            <div className="animate-pulse">
              <div className="h-32 bg-gray-800 rounded-lg mb-4"></div>
              <div className="h-8 bg-gray-800 rounded-lg w-1/3 mx-auto"></div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-red-900/20 to-gray-900 p-8 rounded-xl shadow-2xl border border-red-900/30">
              <svg className="w-12 h-12 text-red-500 mb-4 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-2xl italic mb-6 text-gray-200">"{quote.quote}"</p>
              <p className="text-lg text-red-400 font-semibold">- {quote.role}</p>
              <button
                onClick={loadQuote}
                className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
              >
                Get New Quote
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotesPage;
