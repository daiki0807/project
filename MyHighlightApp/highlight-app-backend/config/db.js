const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // Mongooseの新しいバージョンでは、接続オプションは不要なことが多いです。
        // process.env.MONGO_URI には、MongoDB Atlasから取得した接続文字列が入ります。
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // 接続に失敗したら、プロセスを終了する
        process.exit(1);
    }
};

// connectDB 関数そのものをエクスポートする
module.exports = connectDB;