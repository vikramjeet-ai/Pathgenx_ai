import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import UserInput from './components/UserInput';
import CareerPathCard from './components/CareerPathCard';
import SkeletonLoader from './components/SkeletonLoader';
import Footer from './components/Footer';
import type { CareerAnalysis, Summary, CareerPath } from './types';
import { SparklesIcon, ShieldIcon, TrendingUpIcon, ShareIcon, InfoIcon } from './components/icons';
import { generatePathOutlines, generatePathDetails, refineCareerPaths, generateSummary } from './services/geminiService';
import FeedbackInput from './components/FeedbackInput';
import { encodeAnalysis, decodeAnalysis } from './utils/shareUtils';

interface SummaryCardProps {
    summary?: Summary | null;
    summaryError?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary, summaryError }) => {
    if (summaryError) {
        return (
            <div className="mt-10 p-6 bg-red-50 dark:bg-red-900/20 rounded-xl shadow-lg border border-red-200 dark:border-red-700">
                <div className="flex items-start gap-4">
                    <InfoIcon className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-xl font-bold text-red-800 dark:text-red-200">Could Not Generate Summary</h3>
                        <p className="mt-1 text-red-600 dark:text-red-400">{summaryError}</p>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!summary) {
        // Show a loading skeleton for the summary
        return (
             <div className="mt-10 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="flex items-start gap-4 mb-6">
                    <SparklesIcon className="w-8 h-8 text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                        <div className="h-7 w-3/4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="mt-2 h-5 w-1/2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                </div>
                <div className="h-5 w-1/3 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
                <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-white/60 dark:bg-gray-700/50 rounded-lg">
                        <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                        <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                    <div className="p-4 bg-white/60 dark:bg-gray-700/50 rounded-lg">
                        <div className="h-6 w-1/2 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                        <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-10 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4 mb-6">
                <SparklesIcon className="w-8 h-8 text-indigo-500 flex-shrink-0 mt-1" />
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">AI Summary & Recommendation</h3>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Your pathways, analyzed for different priorities.</p>
                </div>
            </div>

            {Array.isArray(summary?.keyTakeaways) && summary.keyTakeaways.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Key Takeaways</h4>
                    <ul className="space-y-2">
                        {summary.keyTakeaways.map((takeaway, index) => (
                            <li key={index} className="flex items-start">
                                <svg className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                <span className="text-gray-600 dark:text-gray-300 break-words">{takeaway}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {summary?.bestForStability && (
                    <div className="p-4 bg-white/60 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldIcon className="w-6 h-6 text-blue-500" />
                            <h5 className="font-bold text-gray-800 dark:text-white">Best for Stability</h5>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 break-words">{summary.bestForStability}</p>
                    </div>
                )}
                {summary?.bestForGrowth && (
                    <div className="p-4 bg-white/60 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUpIcon className="w-6 h-6 text-green-500" />
                            <h5 className="font-bold text-gray-800 dark:text-white">Best for Growth</h5>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 break-words">{summary.bestForGrowth}</p>
                    </div>
                )}
            </div>

            {summary?.finalVerdict && (
                <div>
                    <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Final Verdict</h4>
                    <p className="text-gray-600 dark:text-gray-300 italic break-words">"{summary.finalVerdict}"</p>
                </div>
            )}
        </div>
    );
};

// Helper to add stable IDs, preserving them across updates for robust React state
const addStableIds = (
  newPaths: CareerPath[],
  oldPaths?: CareerPath[]
): CareerPath[] => {
  const oldPathIdMap = new Map<string, string>();
  if (oldPaths) {
    oldPaths.forEach(path => {
      if (path.id) {
        oldPathIdMap.set(path.title, path.id);
      }
    });
  }

  return newPaths.map(path => {
    // Reuse ID if title matches, otherwise generate a new one
    const existingId = oldPathIdMap.get(path.title);
    return {
      ...path,
      id: existingId || crypto.randomUUID(),
    };
  });
};


const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null);
  const [initialQuery, setInitialQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  
  const [fetchTrigger, setFetchTrigger] = useState<{ query: string, id: number } | null>(null);
  const [isSummaryPending, setIsSummaryPending] = useState<boolean>(false);
  
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Effect to load analysis from URL on initial load
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const decodedData = decodeAnalysis(hash);
      if (decodedData) {
        setAnalysis(decodedData.analysis);
        setInitialQuery(decodedData.initialQuery);
        // Clear the hash to prevent re-loading on refresh
        window.history.replaceState(null, '', ' ');
      } else {
        setError("Could not load the shared analysis. The link may be invalid or expired.");
      }
    }
  }, []);

  useEffect(() => {
    if (analysis) {
      const timer = setTimeout(() => setShowAnalysis(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowAnalysis(false);
    }
  }, [analysis]);

  // Effect for fetching path outlines and details
  useEffect(() => {
    if (!fetchTrigger) return;

    const { query } = fetchTrigger;
    let isCancelled = false;

    const fetchAnalysis = async () => {
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        setInitialQuery(query);
        setIsSummaryPending(false);

        try {
            const outlinesResult = await generatePathOutlines(query);
            if (isCancelled) return;

            const pathsWithLoaders = outlinesResult.paths.map(path => ({
                ...path,
                id: crypto.randomUUID(),
                isLoadingDetails: true,
            }));

            setAnalysis({ summary: null, paths: pathsWithLoaders });
            setIsLoading(false);

            if (pathsWithLoaders.length === 0) return;

            // Fetch details for the first path first
            const firstPath = pathsWithLoaders[0];
            try {
                const firstPathDetails = await generatePathDetails(firstPath, query);
                if (isCancelled) return;
                setAnalysis(prev => prev ? ({
                    ...prev,
                    paths: prev.paths.map(p =>
                        p.id === firstPath.id
                            ? { ...p, ...firstPathDetails, isLoadingDetails: false }
                            : p
                    )
                }) : null);
            } catch (err) {
                 if (isCancelled) return;
                 setAnalysis(prev => prev ? ({
                    ...prev,
                    paths: prev.paths.map(p =>
                        p.id === firstPath.id
                            ? { ...p, isLoadingDetails: false, error: err instanceof Error ? err.message : 'Failed to load details.' }
                            : p
                    )
                }) : null);
            }


            // Fetch details for the rest in parallel
            await Promise.all(
                pathsWithLoaders.slice(1).map(async path => {
                    try {
                        const details = await generatePathDetails(path, query);
                        if (isCancelled) return;
                        setAnalysis(prev => prev ? ({
                            ...prev,
                            paths: prev.paths.map(p =>
                                p.id === path.id
                                    ? { ...p, ...details, isLoadingDetails: false }
                                    : p
                            )
                        }) : null);
                    } catch (err) {
                         if (isCancelled) return;
                         setAnalysis(prev => prev ? ({
                            ...prev,
                            paths: prev.paths.map(p =>
                                p.id === path.id
                                    ? { ...p, isLoadingDetails: false, error: err instanceof Error ? err.message : 'Failed to load details.' }
                                    : p
                            )
                        }) : null);
                    }
                })
            );

            if (!isCancelled) {
                setIsSummaryPending(true);
            }

        } catch (err) {
            if (!isCancelled) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
                setIsLoading(false);
            }
        }
    };

    fetchAnalysis();

    return () => { isCancelled = true; };
  }, [fetchTrigger]);

  // Effect for generating the summary once all paths are loaded
  useEffect(() => {
    if (!isSummaryPending || !analysis || analysis.summary) return;

    const allPathsSettled = analysis.paths.every(p => !p.isLoadingDetails);

    if (allPathsSettled) {
        let isCancelled = false;

        const createSummary = async () => {
            const successfullyLoadedPaths = analysis.paths.filter(p => !p.error);
            
            if (successfullyLoadedPaths.length > 0) {
                try {
                    const summary = await generateSummary(successfullyLoadedPaths, initialQuery);
                    if (!isCancelled) {
                        setAnalysis(prev => prev ? { ...prev, summary, summaryError: undefined } : null);
                    }
                } catch (err) {
                    console.error("Failed to generate summary:", err);
                    if (!isCancelled) {
                        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while creating the summary.";
                        setAnalysis(prev => prev ? { ...prev, summary: null, summaryError: errorMessage } : null);
                    }
                }
            }
            if (!isCancelled) {
                setIsSummaryPending(false);
            }
        };

        createSummary();
        
        return () => { isCancelled = true; };
    }
  }, [isSummaryPending, analysis, initialQuery]);

  const handleUserInputSubmit = useCallback((query: string) => {
    setFetchTrigger({ query, id: Date.now() });
  }, []);

  const handleFeedbackSubmit = useCallback(async (feedback: string) => {
    if (!analysis || !initialQuery) return;
    setIsRefining(true);
    setError(null);
    
    // Scroll to top for better UX
    if(resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    try {
      const result = await refineCareerPaths(
        feedback, 
        {
            previousAnalysis: analysis,
            originalQuery: initialQuery,
        }
      );
      result.paths = addStableIds(result.paths, analysis.paths);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsRefining(false);
    }
  }, [analysis, initialQuery]);

  const handleReset = useCallback(() => {
    setFetchTrigger(null);
    setAnalysis(null);
    setInitialQuery('');
    setError(null);
    setIsLoading(false);
    setIsRefining(false);
  }, []);

  const handleShare = useCallback(() => {
    if (!analysis) return;
    const encoded = encodeAnalysis(analysis, initialQuery);
    if (encoded) {
      const shareUrl = `${window.location.origin}${window.location.pathname}#${encoded}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
          setCopyStatus('copied');
          setTimeout(() => setCopyStatus('idle'), 2500);
      }).catch(err => {
          console.error('Failed to copy link: ', err);
      });
    }
  }, [analysis, initialQuery]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <main className="container mx-auto px-4 py-8">
        <Header />

        {!analysis && !isLoading && !isRefining && (
          <UserInput onSubmit={handleUserInputSubmit} isLoading={isLoading} />
        )}

        {isLoading && !analysis && (
            <SkeletonLoader isRefining={false} />
        )}
        
        {error && (
            <div 
                className="mt-8 max-w-2xl mx-auto p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-600 dark:text-red-300"
                role="alert"
                aria-live="assertive"
            >
                <p className="font-bold">An Error Occurred</p>
                <p>{error}</p>
            </div>
        )}
        
        {analysis && !isRefining && (
          <div ref={resultsRef} className={`mt-12 max-w-4xl mx-auto transition-all duration-700 ease-out ${showAnalysis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <div className="flex justify-between items-center mb-8">
                <button 
                  onClick={handleReset}
                  className="text-indigo-600 hover:underline dark:text-indigo-400 font-medium transition-colors"
                  aria-label="Start a new career analysis"
                >
                  &larr; Start New Analysis
                </button>
                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-300 disabled:opacity-70"
                    disabled={copyStatus === 'copied'}
                >
                    <ShareIcon className="w-4 h-4" />
                    {copyStatus === 'copied' ? 'Link Copied!' : 'Copy Shareable Link'}
                </button>
            </div>

            {analysis.paths?.length > 0 ? (
                <>
                    <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
                        Your Personalized Career Pathways
                    </h2>
                    <div className="space-y-6">
                        {analysis.paths.map((path, index) => (
                            <CareerPathCard key={path.id} path={path} index={index} />
                        ))}
                    </div>
                    {analysis.paths.every(p => !p.isLoadingDetails) && (
                        <SummaryCard summary={analysis.summary} summaryError={analysis.summaryError} />
                    )}
                </>
            ) : (
                <div className="text-center mt-12 max-w-2xl mx-auto">
                    <div className="p-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-xl">
                        <InfoIcon className="w-10 h-10 text-yellow-500 mx-auto mb-4"/>
                        <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200">No Pathways Found</h3>
                        <p className="mt-2 text-yellow-600 dark:text-yellow-400">
                            The AI couldn't generate paths based on your last request. Try refining your prompt below, or start a new analysis with a different dilemma.
                        </p>
                    </div>
                </div>
            )}
            
            <FeedbackInput 
                onSubmit={handleFeedbackSubmit} 
                isLoading={isRefining} 
                analysis={analysis} 
                initialQuery={initialQuery}
            />
          </div>
        )}
        
        {isRefining && <SkeletonLoader isRefining={true} />}

        {!isLoading && !analysis && !isRefining &&(
            <div className="text-center mt-12 max-w-2xl mx-auto">
                <div className="p-8 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <SparklesIcon className="w-10 h-10 text-indigo-500 mx-auto mb-4"/>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-indigo-200">Ready to Explore Your Future?</h3>
                    <p className="mt-2 text-gray-600 dark:text-indigo-400">
                        Enter your career dilemma above to let our AI copilot map out your personalized pathways.
                    </p>
                </div>
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
