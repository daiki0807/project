import React from 'react';
import { ABCAnalysis } from '../types';
import { TrashIcon, ChevronRightIcon } from './icons';

interface AnalysisHistoryListProps {
  analyses: ABCAnalysis[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  currentViewingId: string | null;
}

const AnalysisHistoryList: React.FC<AnalysisHistoryListProps> = ({ analyses, onSelect, onDelete, currentViewingId }) => {
  return (
    <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
      <h3 className="text-lg font-bold text-slate-700 mb-4">分析履歴</h3>
      {analyses.length === 0 ? (
        <p className="text-slate-500 mt-2">この児童の分析履歴はまだありません。</p>
      ) : (
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {analyses.map(analysis => {
              const isActive = analysis.id === currentViewingId;
              return (
                  <div
                      key={analysis.id}
                      onClick={() => onSelect(analysis.id)}
                      onKeyDown={(e) => e.key === 'Enter' && onSelect(analysis.id)}
                      className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all duration-200 ${isActive ? 'bg-teal-50 border-teal-500 shadow-md' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'}`}
                      role="button"
                      tabIndex={0}
                      aria-current={isActive ? 'true' : 'false'}
                      aria-label={`${new Date(analysis.date).toLocaleDateString()}の分析記録を表示`}
                  >
                      <div>
                          <p className={`font-semibold ${isActive ? 'text-teal-800' : 'text-slate-900'}`}>{new Date(analysis.date).toLocaleString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                          <p className={`text-sm truncate max-w-xs sm:max-w-md ${isActive ? 'text-teal-700' : 'text-slate-600'}`}>
                              <strong>行動:</strong> {analysis.behavior}
                          </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                          <button 
                              onClick={(e) => { e.stopPropagation(); onDelete(analysis.id); }} 
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full"
                              aria-label="この分析を削除"
                          >
                              <TrashIcon className="w-5 h-5"/>
                          </button>
                          <ChevronRightIcon className={`w-6 h-6 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                      </div>
                  </div>
              )
          })}
        </div>
      )}
    </div>
  );
};

export default AnalysisHistoryList;