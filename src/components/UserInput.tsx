import React, { useState, useRef, useEffect } from 'react';
import { ArrowRightIcon } from './icons';

interface UserInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

const UserInput: React.FC<UserInputProps> = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const exampleQuery = "I'm a final-year CS student. Should I do a corporate job, freelance, or start an edtech?";

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter your career dilemma.');
      return;
    }
    setError('');
    onSubmit(query);
  };
  
  const handleExampleClick = () => {
    setQuery(exampleQuery);
    setError('');
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        textareaRef.current.focus();
      }
    }, 0);
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit}>
        <label htmlFor="career-query" className="block mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
          Describe Your Career Crossroads
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          What's your dilemma? Mention your skills, interests, and what you're looking for.
        </p>
        <textarea
          id="career-query"
          ref={textareaRef}
          rows={4}
          className="w-full p-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white resize-none overflow-hidden transition"
          placeholder="e.g., Should I take a ₹10 LPA corporate role or start a SaaS venture?"
          value={query}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            if (error) setError('');
          }}
          disabled={isLoading}
        ></textarea>
        <div className="text-sm mt-2">
            <button type="button" onClick={handleExampleClick} className="text-indigo-600 hover:underline dark:text-indigo-400 font-medium">
              Try an example
            </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2" role="alert" aria-live="polite">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full group flex items-center justify-center text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-300 font-semibold rounded-lg text-lg px-5 py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-indigo-800"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Pathways...
            </>
          ) : (
            <>
              <span>Generate My Career Paths</span>
              <ArrowRightIcon className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UserInput;
