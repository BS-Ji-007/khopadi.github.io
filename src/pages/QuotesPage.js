import React, { useState, useEffect } from 'react';
import { quotes } from '../utils/multiApi';

const QuotesPage = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);

  useEffect(() => { loadQuote(); }, []);

  const loadQuote = async () => {
    setAnimating(true);
    setLoading(true);
    const data = await quotes.random();
    setQuote(data);
    setLoading(false);
    setTimeout(() => setAnimating(false), 50);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4" style={{ background: 'var(--bg-deep)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(232,16,42,0.07) 0%, transparent 70%)' }} />

      <div className="max-w-2xl w-full text-center relative z-10">
        <h1 className="font-display text-5xl text-white tracking-widest mb-12">MOVIE QUOTES</h1>

        <div
          className="rounded-2xl p-10 transition-all duration-500"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            opacity: animating ? 0 : 1,
            transform: animating ? 'translateY(10px)' : 'translateY(0)',
          }}
        >
          {loading ? (
            <div className="space-y-4">
              <div className="h-6 rounded-lg skeleton" />
              <div className="h-6 rounded-lg skeleton w-3/4 mx-auto" />
              <div className="h-4 rounded-lg skeleton w-1/3 mx-auto mt-6" />
            </div>
          ) : quote ? (
            <>
              <svg className="w-10 h-10 mx-auto mb-6" style={{ color: 'var(--red)' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
              <p className="text-xl sm:text-2xl italic leading-relaxed mb-6 text-white">"{quote.quote}"</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--red)' }}>— {quote.role}</p>
            </>
          ) : null}
        </div>

        <button
          onClick={loadQuote}
          disabled={loading}
          className="btn-primary mt-8 disabled:opacity-50"
        >
          {loading ? 'Loading…' : '✨ New Quote'}
        </button>
      </div>
    </div>
  );
};
export default QuotesPage;
