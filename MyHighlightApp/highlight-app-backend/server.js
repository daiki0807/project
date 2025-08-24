const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// .envファイルを読み込む
dotenv.config();

// データベースに接続
connectDB();

const app = express();

// JSON形式のリクエストボディを正しく解釈するための設定
app.use(express.json());

// CORS (クロスオリジンリソース共有) の設定
const corsOptions = {
    origin: process.env.FRONTEND_URL, // .envで設定したフロントエンドのURLからのみアクセスを許可
    credentials: true,
};
app.use(cors(corsOptions));

// --- APIの窓口を設定 ---
// '/api/auth' で始まるURLへのリクエストは、routes/auth.js に交通整理を任せる
app.use('/api/auth', require('./routes/auth'));
// '/api/documents' で始まるURLへのリクエストは、routes/documents.js に交通整理を任せる
app.use('/api/documents', require('./routes/documents'));


// サーバーを起動する
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));