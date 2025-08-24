const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // パスワードの暗号化に必要

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true }); // timestamps:trueでcreatedAtとupdatedAtを自動追加

// ↓↓↓ ここからが追加された機能 ↓↓↓

// [機能1] パスワードを保存する前に、自動でハッシュ化（暗号化）する処理
UserSchema.pre('save', async function(next) {
    // パスワードが変更されていない場合は、何もしない
    if (!this.isModified('password')) {
        return next();
    }
    // パスワードをハッシュ化
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// [機能2] ログイン時に入力されたパスワードが正しいかチェックする機能
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// ↑↑↑ ここまでが追加された機能 ↑↑↑

module.exports = mongoose.model('User', UserSchema);