
import React, { useState } from 'react';
import { ABCAnalysisData } from '../types';
import { FORM_STEPS } from '../constants';
import ProgressIndicator from './ProgressIndicator';
import { SparklesIcon } from './icons';

interface AnalysisFormProps {
  onSubmit: (data: ABCAnalysisData) => void;
  isLoading: boolean;
}

const initialFormData: ABCAnalysisData = {
  antecedent: '',
  behavior: '',
  consequence: '',
  desiredBehavior: '',
  praiseMethod: '',
  enjoyableActivity: '',
  responseStrategy: '',
};

const AnalysisForm: React.FC<AnalysisFormProps> = ({ onSubmit, isLoading }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ABCAnalysisData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof ABCAnalysisData, string>>>({});
  
  const totalSteps = FORM_STEPS.length;
  const currentFieldInfo = FORM_STEPS[currentStep - 1];

  const validateStep = (step: number): boolean => {
    const fieldId = FORM_STEPS[step - 1].id;
    if (!formData[fieldId].trim()) {
      setErrors(prev => ({ ...prev, [fieldId]: 'この項目は必須です。' }));
      return false;
    }
    setErrors(prev => ({ ...prev, [fieldId]: undefined }));
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ABCAnalysisData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      let allValid = true;
      const newErrors: Partial<Record<keyof ABCAnalysisData, string>> = {};
      for (const step of FORM_STEPS) {
          if (!formData[step.id].trim()) {
              newErrors[step.id] = 'この項目は必須です。';
              allValid = false;
          }
      }
      setErrors(newErrors);
      
      if (allValid) {
        onSubmit(formData);
      } else {
        const firstErrorStep = FORM_STEPS.findIndex(step => newErrors[step.id]) + 1;
        if(firstErrorStep > 0) {
            setCurrentStep(firstErrorStep);
        }
      }
    }
  };
  
  const isFinalStep = currentStep === totalSteps;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">ABC分析入力</h2>
        <p className="text-sm text-slate-500 mt-1">ステップに従って、児童の行動について入力してください。</p>
      </div>
      
      <div className="mb-6">
        <ProgressIndicator totalSteps={totalSteps} currentStep={currentStep} />
        <p className="text-right text-sm text-slate-500 mt-2">ステップ {currentStep} / {totalSteps}</p>
      </div>

      <div className="flex-grow">
        <div className="space-y-4">
            <label htmlFor={currentFieldInfo.id} className="block text-md font-semibold text-gray-700 mb-2">{currentFieldInfo.title}</label>
            <textarea
              id={currentFieldInfo.id}
              name={currentFieldInfo.id}
              value={formData[currentFieldInfo.id]}
              onChange={handleChange}
              placeholder={currentFieldInfo.placeholder}
              rows={8}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 transition bg-white text-slate-900 placeholder:text-slate-400"
              aria-label={currentFieldInfo.title}
            />
             {errors[currentFieldInfo.id] && <p className="text-red-500 text-sm mt-1">{errors[currentFieldInfo.id]}</p>}
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1 || isLoading}
          className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          戻る
        </button>

        {isFinalStep ? (
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-400 disabled:cursor-wait transition-colors"
          >
            {isLoading ? '分析中...' : <><SparklesIcon className="w-5 h-5" /> AIフィードバックを取得</>}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled={isLoading}
            className="px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-colors"
          >
            次へ
          </button>
        )}
      </div>
    </form>
  );
};

export default AnalysisForm;