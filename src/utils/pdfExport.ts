import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FieldType } from '../types';

const getFieldName = (fieldType: FieldType): string => {
  switch (fieldType) {
    case 'soccer':
      return 'サッカー';
    case 'basketball':
      return 'バスケットボール';
    case 'basketball2':
      return 'バスケットボール2';
    case 'basketball3':
      return 'バスケットボール3';
    case 'volleyball':
      return 'バレーボール';
    case 'baseball':
      return '野球';
    case 'court':
      return 'コート';
    case 'court2':
      return 'コート2';
  }
};

export const exportToPDF = async (fieldRef: HTMLDivElement, fieldType: FieldType, strategyName: string) => {
  try {
    const canvas = await html2canvas(fieldRef, {
      scale: 2,
      backgroundColor: null,
      logging: false,
    });

    const aspectRatio = canvas.width / canvas.height;
    const pdf = new jsPDF({
      orientation: aspectRatio > 1 ? 'landscape' : 'portrait',
      unit: 'mm',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    // Add custom Japanese font
    pdf.addFont('./fonts/NotoSansJP-Regular.ttf', 'NotoSansJP', 'normal');
    pdf.setFont('NotoSansJP');

    if (strategyName) {
      pdf.setFontSize(16);
      pdf.text(strategyName, pdfWidth / 2, margin, { align: 'center' });
    }
    
    const imageWidth = pdfWidth - (margin * 2);
    const imageHeight = imageWidth / aspectRatio;
    const x = margin;
    const y = (pdfHeight - imageHeight) / 2;

    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      x,
      y,
      imageWidth,
      imageHeight,
      undefined,
      'FAST'
    );

    const date = new Date().toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(/[/: ]/g, '');

    pdf.save(`作戦ボード_${getFieldName(fieldType)}_${date}.pdf`);
  } catch (error) {
    console.error('PDF出力エラー:', error);
    alert('PDFの出力中にエラーが発生しました。');
  }
};