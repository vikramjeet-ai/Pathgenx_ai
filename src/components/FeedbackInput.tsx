import React, { useState, useMemo, useRef } from 'react';
import { SparklesIcon, ArrowRightIcon } from './icons';
import type { CareerAnalysis } from '../types';

interface FeedbackInputProps {
  onSubmit: (feedback: string) => void;
  isLoading: boolean;
  analysis: CareerAnalysis | null;
  initialQuery: string;
}

const FeedbackInput: React.FC<FeedbackInputProps> = ({ onSubmit, isLoading, analysis, initialQuery }) => {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = useMemo(() => {
    const generatedSuggestions: string[] = [];
    if (!analysis) return [];

    // Suggestion 1: Ask to add a new, flexible section
    if (!analysis.paths.every(p => p.dayInTheLife)) {
        generatedSuggestions.push(`Add a "Day in the Life" section.`);
    } else if (!analysis.paths.every(p => p.certifications)) {
        generatedSuggestions.push(`What are some key certifications?`);
    } else {
        generatedSuggestions.push(`Compare the work-life balance.`);
    }

    // Suggestion 2: Elaborate on a specific path
    if (analysis.paths.length > 0) {
      generatedSuggestions.push(`Tell me more about "${analysis.paths[0].title}".`);
    }

    // Suggestion 3: Ask to remove a path if there is more than one
    if (analysis.paths.length > 1) {
      generatedSuggestions.push(`Remove the "${analysis.paths[analysis.paths.length - 1].title}" path.`);
    }
    
    // Add a fallback if needed
    if (generatedSuggestions.length < 2) {
      generatedSuggestions.push("Add another path for AI/ML engineering.");
    }
    
    return [...new Set(generatedSuggestions)].slice(0, 3); // Ensure unique suggestions
  }, [analysis, initialQuery]);

  const handleSuggestionClick = (suggestion: string) => {
    setFeedback(suggestion);
    if (error) setError('');
    setTimeout(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.focus();
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError('Please enter your feedback or question.');
      return;
    }
    setError('');
    onSubmit(feedback);
    setFeedback(''); // Clear input after submission
  };

  return (
    <div className="mt-10">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit}>
                <div className="flex items-start gap-4">
                     <SparklesIcon className="w-8 h-8 text-indigo-500 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Refine Your Pathways</h3>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">
                            Want a different perspective? Ask for changes or more details.
                        </p>
                    </div>
                </div>
               
                <textarea
                  id="feedback-query"
                  ref={textareaRef}
                  rows={3}
                  className="mt-4 w-full p-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white resize-none overflow-hidden transition"
                  placeholder="e.g., 'Compare the work-life balance' or 'Add a section on key certifications'"
                  value={feedback}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                  onChange={(e) => {
                    setFeedback(e.target.value);
                    if (error) setError('');
                  }}
                  disabled={isLoading}
                ></textarea>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Suggestions:</span>
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1 text-sm text-indigo-700 bg-indigo-100 rounded-full hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                        >
                            {suggestion}
                        </button>
                    ))}
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
                      Refining...
                    </>
                  ) : (
                    <>
                      <span>Refine Pathways</span>
                      <ArrowRightIcon className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
            </form>
        </div>
    </div>
  );
};

export default FeedbackInput;
