// server.ts (ログイン機能追加版)

import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { getPrompt } from './constants.js';
import { Student, ABCAnalysisData } from './types.js';
import path from 'path';
import { fileURLToPath } from 'url';

declare var process: {
  env: {
    [key:string]: string | undefined;
    PORT?: string;
    GEMINI_API_KEY?: string; 
    NODE_ENV?: string;
  };
  on: (event: 'SIGTERM' | 'SIGINT', listener: () => void) => void;
  exit: (code?: number) => never;
};

const app: Express = express();
app.use(express.json());

// パスワード設定
const CORRECT_PASSWORD = '0602';

// CORS設定
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Secret ManagerからAPIキーを取得する関数
async function getApiKey(): Promise<string> {
    const projectId = 'gen-lang-client-0000351851';
    const secretId = 'gemini-api-key';
    const version = 'latest';

    const client = new SecretManagerServiceClient();
    const name = `projects/${projectId}/secrets/${secretId}/versions/${version}`;

    try {
        const [secretVersion] = await client.accessSecretVersion({ name });
        const payload = secretVersion.payload?.data?.toString();
        if (!payload) {
            throw new Error('Secret Managerから取得したAPIキーが空です。');
        }
        return payload;
    } catch (error) {
        console.error('Secret ManagerからのAPIキー取得に失敗しました:', error);
        throw error;
    }
}

// Cloud Runのためのヘルスチェックエンドポイント
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ログインエンドポイント
app.post('/api/login', (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'パスワードが入力されていません。' });
    }
    
    if (password === CORRECT_PASSWORD) {
      return res.json({ success: true, message: 'ログイン成功' });
    } else {
      return res.status(401).json({ error: 'パスワードが正しくありません。' });
    }
  } catch (error) {
    console.error('ログイン処理中にエラーが発生しました:', error);
    return res.status(500).json({ error: 'サーバーエラーが発生しました。' });
  }
});

// Gemini APIを安全に呼び出すためのAPIプロキシエンドポイント
app.post('/api/gemini', async (req: Request, res: Response) => {
  try {
    console.log('API request received:', req.body);

    const apiKey = await getApiKey();
    const { student, analysisData } = req.body;

    const isValidAnalysisData = (data: any): data is ABCAnalysisData => {
      return (
        data &&
        typeof data.antecedent === 'string' &&
        typeof data.behavior === 'string' &&
        typeof data.consequence === 'string' &&
        typeof data.desiredBehavior === 'string' &&
        typeof data.praiseMethod === 'string' &&
        typeof data.enjoyableActivity === 'string' &&
        typeof data.responseStrategy === 'string'
      );
    };

    if (!student || typeof student.name !== 'string' || typeof student.grade !== 'string' || !isValidAnalysisData(analysisData)) {
      console.error('Invalid request format:', { student, analysisData });
      return res.status(400).json({ error: 'リクエストの形式が正しくありません。' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = getPrompt(student, analysisData);
    console.log('Generated prompt:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('AI response received successfully');
    return res.json({ feedback: text });
    
  } catch (error) {
    console.error('API処理中にエラーが発生しました:', error);
    const errorMessage = error instanceof Error ? error.message : '不明なサーバーエラー';
    return res.status(500).json({ error: `AIからのフィードバック取得中にエラーが発生しました: ${errorMessage}` });
  }
});

// 静的ファイル配信のセットアップ
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

// SPAのためのフォールバック設定
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// グレースフルシャットダウン処理
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});
process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});