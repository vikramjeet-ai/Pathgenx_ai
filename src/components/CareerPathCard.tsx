import React, { useState, useMemo, useEffect } from 'react';
import type { CareerPath, ResourceItem as ResourceItemType } from '../types';
import RoadmapChart from './RoadmapChart';
import { TargetIcon, BookIcon, GraduationCapIcon, ToolIcon, LinkIcon, TrendingUpIcon, ExternalLinkIcon } from './icons';

interface CareerPathCardProps {
  path: CareerPath;
  index: number;
}

const ResourceItem: React.FC<{ icon: React.ReactNode; resource: ResourceItemType; }> = ({ icon, resource }) => (
    <li className="flex items-start">
        <div className="flex-shrink-0 w-5 h-5 mr-3 text-indigo-500">{icon}</div>
        <a 
            href={resource.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline hover:text-indigo-800 dark:hover:text-indigo-300 break-words"
        >
            <span>{resource.name}</span>
            <ExternalLinkIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
        </a>
    </li>
);

// Helper to convert camelCase to Title Case
const toTitleCase = (str: string) => {
  const result = str.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const InfoSection: React.FC<{ title: string; content: string | string[] | undefined }> = ({ title, content }) => {
    if (!content || (Array.isArray(content) && content.length === 0)) {
        return null;
    }

    return (
        <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">{title}</h4>
            {typeof content === 'string' ? (
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">{content}</p>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {content.map((item) => (
                        <span key={item} className="px-3 py-1 text-sm font-medium text-indigo-800 bg-indigo-100 rounded-full dark:bg-indigo-900 dark:text-indigo-300 break-all">
                            {item}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

const CardErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="p-6 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-700">
        <div className="flex items-center">
            <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
            <div>
                <h4 className="font-bold text-red-800 dark:text-red-200">Could not load details</h4>
                <p className="text-sm text-red-700 dark:text-red-300">{message}</p>
            </div>
        </div>
    </div>
);


const BlinkingCursor: React.FC = () => (
    <span className="inline-block w-2.5 h-5 bg-indigo-500 animate-pulse ml-1" style={{ animationDuration: '1.5s' }}></span>
);

const loadingSteps = [
    "Analyzing income potential",
    "Evaluating pros & cons",
    "Mapping your 5-year roadmap",
    "Finding learning resources",
    "Compiling industry trends",
    "Finalizing details"
];

const CardDetailSkeleton: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prevStep) => (prevStep + 1) % loadingSteps.length);
        }, 2500); // Change step every 2.5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 animate-pulse">
        <div key={currentStep} className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-6 animate-fadeIn">
            <span>{loadingSteps[currentStep]}</span>
            <span className="animate-bounce" style={{ animationDuration: '1.5s' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '1.5s' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '1.5s' }}>.</span>
            <BlinkingCursor />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="space-y-2">
                    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
            <div>
                <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                 <div className="space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        </div>
        <div className="mb-6">
            <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
             </div>
        </div>
        <div>
            <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
    </div>
    );
};


const CareerPathCard: React.FC<CareerPathCardProps> = ({ path, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);
  
  const contentId = useMemo(() => `path-content-${path.id}`, [path.id]);

  const stressColor =
    path.stressLevel && path.stressLevel > 7
      ? 'text-red-500'
      : path.stressLevel && path.stressLevel > 4
      ? 'text-yellow-500'
      : 'text-green-500';
      
  const standardKeys = new Set([
      'id', 'title', 'description', 'incomeProjection', 'skillsToDevelop', 'stressLevel', 
      'longTermUpside', 'recommendation', 'roadmap', 'pros', 'cons', 'resources', 'industryTrends', 
      'isLoadingDetails', 'error'
  ]);

  const dynamicContentKeys = Object.keys(path).filter(key => !standardKeys.has(key));

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-grow min-w-0">
            <TargetIcon className="w-8 h-8 text-indigo-500 flex-shrink-0" />
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-3">
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white break-words truncate">{path.title}</h3>
                 {index === 0 && (
                    <span className="px-2.5 py-0.5 text-xs font-semibold text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300 whitespace-nowrap animate-pulse" style={{ animationDuration: '3s' }}>
                        Top Match
                    </span>
                 )}
              </div>
              <p className="text-gray-500 dark:text-gray-400 break-words mt-1">{path.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <svg
                className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${
                isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
           </div>
        </div>
      </button>

      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`} style={{ display: 'grid' }}>
        <div className="overflow-hidden">
            {path.isLoadingDetails ? (
                <CardDetailSkeleton />
            ) : path.error ? (
                <CardErrorState message={path.error} />
            ) : (
            <div 
                id={contentId}
                className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Income Projection</h4>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                    <li><span className="font-semibold">Year 1:</span> {path.incomeProjection?.year1 ?? 'N/A'}</li>
                    <li><span className="font-semibold">Year 3:</span> {path.incomeProjection?.year3 ?? 'N/A'}</li>
                    <li><span className="font-semibold">Year 5:</span> {path.incomeProjection?.year5 ?? 'N/A'}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Key Metrics</h4>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                    <li>
                        <span className="font-semibold">Stress Level:</span>{' '}
                        <span className={stressColor} title="Score out of 10, where 10 is highest stress">{path.stressLevel ?? 'N/A'}/10</span>
                    </li>
                    <li className="break-words"><span className="font-semibold">Long-term Upside:</span> {path.longTermUpside ?? 'N/A'}</li>
                  </ul>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Pros & Cons</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <ul className="space-y-2">
                        {Array.isArray(path.pros) && path.pros.map((pro, i) => (
                           <li key={`pro-${i}`} className="flex items-start">
                             <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                             <span className="text-gray-600 dark:text-gray-300 break-words">{pro}</span>
                           </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                       <ul className="space-y-2">
                        {Array.isArray(path.cons) && path.cons.map((con, i) => (
                          <li key={`con-${i}`} className="flex items-start">
                            <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            <span className="text-gray-600 dark:text-gray-300 break-words">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                 </div>
              </div>

              {path.industryTrends && (
                <div className="mb-6">
                    <h4 className="flex items-center text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        <TrendingUpIcon className="w-5 h-5 mr-2 text-indigo-500" />
                        Industry Trends
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">{path.industryTrends}</p>
                </div>
              )}

              <InfoSection title="Skills to Develop" content={path.skillsToDevelop} />

              {dynamicContentKeys.map(key => (
                 <InfoSection 
                    key={key}
                    title={toTitleCase(key)}
                    content={(path as any)[key]} 
                 />
              ))}


              {path.resources && (
                <div className="my-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Learning Resources</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {path.resources.books?.length > 0 && (
                            <div>
                                <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Books</h5>
                                <ul className="space-y-2">
                                    {path.resources.books.map(item => <ResourceItem key={item.url} icon={<BookIcon />} resource={item} />)}
                                </ul>
                            </div>
                        )}
                        {path.resources.courses?.length > 0 && (
                            <div>
                                <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Courses</h5>
                                <ul className="space-y-2">
                                    {path.resources.courses.map(item => <ResourceItem key={item.url} icon={<GraduationCapIcon />} resource={item} />)}
                                </ul>
                            </div>
                        )}
                        {path.resources.tools?.length > 0 && (
                            <div>
                                <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Tools & Software</h5>
                                <ul className="space-y-2">
                                    {path.resources.tools.map(item => <ResourceItem key={item.url} icon={<ToolIcon />} resource={item} />)}
                                </ul>
                            </div>
                        )}
                        {path.resources.other?.length > 0 && (
                            <div>
                                <h5 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Other Content</h5>
                                <ul className="space-y-2">
                                    {path.resources.other.map(item => <ResourceItem key={item.url} icon={<LinkIcon />} resource={item} />)}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
              )}
              
              <RoadmapChart data={path.roadmap} />
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CareerPathCard;
