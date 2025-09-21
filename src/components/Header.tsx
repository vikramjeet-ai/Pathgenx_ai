import React from 'react';
import { RocketIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="w-full text-center py-8 md:py-12">
      <div className="flex items-center justify-center gap-4 mb-4">
        <RocketIcon className="w-14 h-14 text-indigo-500" />
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
          PathGenX AI
        </h1>
      </div>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
        Your AI Copilot for Navigating Tomorrow's Career Landscape.
      </p>
    </header>
  );
};

export default Header;
