import React, { useRef, useState } from 'react';
import { ABCAnalysis, Student } from '../types';
import { FormattedFeedback } from './FeedbackDisplay';
import { ArrowLeftIcon, SparklesIcon, DownloadIcon } from './icons';
import { FORM_STEPS } from '../constants';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PastAnalysisViewerProps {
  analysis: ABCAnalysis;
  student: Student | null;
  onBack: () => void;
}

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{label}</h4>
        <p className="mt-1 text-slate-700 whitespace-pre-wrap">{value}</p>
    </div>
);

const PastAnalysisViewer: React.FC<PastAnalysisViewerProps> = ({ analysis, student, onBack }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const contentToPrint = printRef.current;
    if (!contentToPrint || !student) {
        alert("PDFを生成するためのコンテンツまたは児童情報が見つかりません。");
        return;
    }

    setIsDownloading(true);

    try {
        const canvas = await html2canvas(contentToPrint, {
            scale: 2, // 高解像度のためにスケールを上げる
            useCORS: true,
        });

        const imgData = canvas.toDataURL('image/png');
        
        // A4サイズ (ポートレート) のPDFをpx単位で作成
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        // canvasの幅をPDFの幅に合わせるための比率
        const ratio = canvasWidth / pdfWidth;
        const imgHeight = canvasHeight / ratio;
        
        let heightLeft = imgHeight;
        let position = 0;

        // 最初のページを追加
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        // コンテンツが1ページより長い場合、新しいページを追加
        while (heightLeft > 0) {
            position = -heightLeft;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
        }
        
        const dateStr = new Date(analysis.date).toLocaleDateString('ja-JP').replace(/\//g, '-');
        pdf.save(`${student.name}_ABC分析_${dateStr}.pdf`);
    } catch (error) {
        console.error("PDF generation failed:", error);
        alert("PDFの生成中にエラーが発生しました。");
    } finally {
        setIsDownloading(false);
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg border border-slate-200 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 pb-4 border-b border-slate-200 gap-4">
            <div>
                <h2 className="text-xl font-bold text-slate-900">分析記録の詳細</h2>
                <p className="text-sm text-slate-500 mt-1">
                    {new Date(analysis.date).toLocaleString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} の記録
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 self-start sm:self-center">
                <button
                    onClick={onBack}
                    className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    新しい分析に戻る
                </button>
                <button
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                    className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-400 disabled:cursor-wait transition-colors"
                >
                    <DownloadIcon className="w-5 h-5" />
                    {isDownloading ? '生成中...' : 'PDFでダウンロード'}
                </button>
            </div>
        </div>

        {/* PDFとして出力するコンテンツエリア */}
        <div ref={printRef} className="py-4">
            <div className="mb-8 text-center hidden print:block">
                <h2 className="text-2xl font-bold text-slate-900">ABC分析 報告書</h2>
                <p className="text-slate-600 mt-2">対象児童: {student?.name ?? 'N/A'}</p>
                <p className="text-sm text-slate-500 mt-1">
                    分析日: {new Date(analysis.date).toLocaleString('ja-JP', { dateStyle: 'long', timeStyle: 'short' })}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">入力内容</h3>
                    {FORM_STEPS.map(step => (
                        <DetailItem key={step.id} label={step.title} value={(analysis as any)[step.id] || ''} />
                    ))}
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-700 border-b pb-2 flex items-center gap-2">
                        <SparklesIcon className="w-6 h-6 text-teal-500" />
                        AIからのフィードバック
                    </h3>
                    {analysis.aiFeedback ? (
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 max-h-[600px] overflow-y-auto">
                            <div className="prose prose-sm max-w-none w-full text-left prose-headings:text-teal-800 prose-h3:font-semibold prose-strong:font-bold prose-strong:text-slate-800">
                            <FormattedFeedback text={analysis.aiFeedback.suggestions} />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-center text-slate-500">
                            <p>この分析にはAIフィードバックがありません。</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default PastAnalysisViewer;