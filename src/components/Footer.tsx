
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full text-center py-6 mt-12 border-t border-gray-200 dark:border-gray-700">
      <p className="text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} PathGenX AI. Your Career Copilot.
      </p>
    </footer>
  );
};

export default Footer;
