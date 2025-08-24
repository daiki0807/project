const mongoose = require('mongoose');

// ハイライト情報の形を、別の設計図として定義
const HighlightSchema = new mongoose.Schema({
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    color: { type: String, required: true },
    character: { type: String } // 必須ではない
});

// 文書全体の形を定義
const DocumentSchema = new mongoose.Schema({
    // キー名を 'user' に変更。より一般的。
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    title: { type: String, required: true },
    content: { type: String, required: true },
    // 上で定義したHighlightSchemaを配列として利用
    highlights: [HighlightSchema],
    // CSSのプロパティ値に合わせる
    writingMode: { type: String, enum: ['horizontal-tb', 'vertical-rl'], default: 'horizontal-tb' },
}, { 
    // timestamps:trueでcreatedAtとupdatedAtを自動で管理
    timestamps: true 
});

module.exports = mongoose.model('Document', DocumentSchema);