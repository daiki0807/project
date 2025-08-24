
import React from 'react';

interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ totalSteps, currentStep }) => {
  return (
    <div className="flex items-center space-x-2" aria-label={`ステップ ${currentStep} / ${totalSteps}`}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        
        let barClass = 'bg-slate-200';
        if (isCompleted) barClass = 'bg-teal-500';
        if (isActive) barClass = 'bg-teal-300';
        
        return (
          <div
            key={stepNumber}
            className={`flex-1 h-2 rounded-full transition-colors duration-300 ${barClass}`}
            title={`ステップ ${stepNumber}`}
          />
        );
      })}
    </div>
  );
};

export default ProgressIndicator;
