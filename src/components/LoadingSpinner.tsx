import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...' 
}) => {
  const spinnerSize = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };
  
  const textSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${spinnerSize[size]} border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3`}></div>
      {text && <p className={`${textSize[size]} text-gray-300`}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
