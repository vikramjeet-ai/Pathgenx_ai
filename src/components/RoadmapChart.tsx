import React from 'react';
import type { RoadmapStep } from '../types';
import { SparklesIcon } from './icons';

interface RoadmapChartProps {
  data: RoadmapStep[];
}

const RoadmapChart: React.FC<RoadmapChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400">No roadmap data available.</p>;
    }
    
    return (
        <div className="mt-6">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Personalized Roadmap</h4>
            <div className="relative border-l-2 border-indigo-200 dark:border-indigo-800 ml-4">
                {data.map((step, index) => (
                    <div key={index} className="mb-8 ml-8 relative">
                        <div className="absolute -left-[34px] flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-indigo-900">
                            <span className="font-bold text-indigo-600 dark:text-indigo-300">{step.year}</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                            <h5 className="text-lg font-semibold text-gray-900 dark:text-white break-words">{step.title}</h5>
                            <p className="text-base font-normal text-gray-600 dark:text-gray-400 mt-1 break-words">{step.description}</p>
                            {step.skills && step.skills.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">Skills:</span>
                                    {step.skills.map((skill, skillIndex) => (
                                        <span key={skillIndex} className="px-2 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full dark:bg-indigo-900 dark:text-indigo-300 break-all">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoadmapChart;
