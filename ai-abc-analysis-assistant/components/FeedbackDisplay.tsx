import React, { useMemo } from 'react';
import { marked } from 'marked';
import { SparklesIcon } from './icons';

interface FeedbackDisplayProps {
  feedback: string;
  isLoading: boolean;
  error: string;
  onReset: () => void;
  hasAnalysisStarted: boolean;
}

export const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        <p className="text-slate-600 mt-4">AIが分析中です...</p>
        <p className="text-sm text-slate-500 mt-1">通常、10秒程度で完了します。</p>
    </div>
);

// markedのオプションを一度だけ設定
marked.setOptions({
  gfm: true,
  breaks: true,
});

export const FormattedFeedback: React.FC<{ text: string }> = ({ text }) => {
    const html = useMemo(() => {
        if (!text) return '';
        try {
            // 本番アプリケーションでは、XSS攻撃を防ぐために
            // DOMPurifyのようなライブラリでHTMLをサニタイズすることが重要です。
            return marked.parse(text) as string;
        } catch (e) {
            console.error("Markdown parsing failed", e);
            return `<h3>フィードバックの表示エラー</h3><p>Markdownの解析中にエラーが発生しました。</p>`;
        }
    }, [text]);

    // 親要素がproseクラスを持つため、このコンポーネントはHTMLを直接レンダリングするだけ
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback, isLoading, error, onReset, hasAnalysisStarted }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-teal-500" />
            AIからのフィードバック
        </h2>
        {hasAnalysisStarted && (
             <button
                onClick={onReset}
                className="px-4 py-1.5 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50"
             >
                新しい分析を開始
             </button>
        )}
      </div>

      <div className="flex-grow bg-slate-50 rounded-lg p-4 min-h-[400px] flex flex-col justify-center border border-slate-200">
        {isLoading && <LoadingSpinner />}
        
        {!isLoading && error && (
          <div className="text-center text-red-600 bg-red-50 p-6 rounded-md">
            <h3 className="font-bold">エラーが発生しました</h3>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && feedback && (
            <div className="prose prose-sm max-w-none w-full text-left self-start overflow-y-auto max-h-[500px] prose-headings:text-teal-800 prose-h3:font-semibold prose-strong:font-bold prose-strong:text-slate-800">
              <FormattedFeedback text={feedback} />
            </div>
        )}

        {!isLoading && !error && !feedback && (
          <div className="text-center text-slate-500">
            <p>分析フォームをすべて入力し、</p>
            <p>「AIフィードバックを取得」ボタンを押してください。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackDisplay;