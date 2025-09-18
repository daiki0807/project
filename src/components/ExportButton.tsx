import React from 'react';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  onClick: () => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors flex items-center gap-2"
      title="PDFでダウンロード"
    >
      <Download className="w-5 h-5" />
      <span>PDF出力</span>
    </button>
  );
};