import React from 'react';

const SkeletonCard: React.FC = () => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800">
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      <div className="flex-grow space-y-2">
        <div className="h-6 rounded bg-gray-200 dark:bg-gray-700 w-3/4"></div>
        <div className="h-4 rounded bg-gray-200 dark:bg-gray-700 w-1/2"></div>
      </div>
    </div>
    <div className="mt-6 space-y-3">
      <div className="h-4 rounded bg-gray-200 dark:bg-gray-700 w-full"></div>
      <div className="h-4 rounded bg-gray-200 dark:bg-gray-700 w-5/6"></div>
      <div className="h-4 rounded bg-gray-200 dark:bg-gray-700 w-3/4"></div>
    </div>
  </div>
);

const SkeletonSummary: React.FC = () => (
    <div className="mt-10 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div className="flex items-start gap-4 mb-6">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 mt-1"></div>
            <div className="w-1/2 space-y-2">
                <div className="h-6 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
        </div>
        <div className="space-y-3">
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-700 w-full"></div>
            <div className="h-4 rounded bg-gray-200 dark:bg-gray-700 w-5/6"></div>
        </div>
    </div>
);

const SkeletonLoader: React.FC<{ isRefining: boolean }> = ({ isRefining }) => {
  return (
    <div className="my-12 max-w-4xl mx-auto animate-pulse" aria-live="polite" aria-busy="true">
      <div className="text-center mb-8">
        <div className="h-8 w-3/5 mx-auto rounded bg-gray-200 dark:bg-gray-700"></div>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            {isRefining ? 'Refining your pathways based on your feedback...' : 'Generating your personalized career pathways...'}
        </p>
      </div>
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <SkeletonSummary />
    </div>
  );
};

export default SkeletonLoader;
