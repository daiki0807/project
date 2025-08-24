
import { Student, ABCAnalysisData } from './types';

export const getAIFeedback = async (
  student: Pick<Student, 'name' | 'grade'>,
  analysisData: ABCAnalysisData
): Promise<string> => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ student, analysisData }),
    });

    const data = await response.json();

    if (!response.ok) {
      // サーバーからのエラーメッセージを優先的に表示
      throw new Error(data.error || `サーバーエラーが発生しました (ステータス: ${response.status})`);
    }

    return data.feedback;
  } catch (error) {
    console.error("Failed to get AI feedback:", error);
    if (error instanceof Error) {
        // ネットワークエラーなども考慮
        throw new Error(error.message || "AIサーバーとの通信に失敗しました。インターネット接続を確認してください。");
    }
    throw new Error("不明なクライアントエラーが発生しました。");
  }
};
