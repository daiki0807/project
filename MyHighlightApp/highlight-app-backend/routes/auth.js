const express = require('express');
const router = express.Router();

// 実際の処理は 'controllers/authController.js' に任せるので、そこから関数をインポート
const { 
    registerUser, 
    loginUser, 
    verifyUser 
} = require('../controllers/authController');

// 認証が必要なルートを守るための「門番」もインポート
const { protect } = require('../middleware/authMiddleware');

// --- ここからが交通整理のルール ---

// '/register' というURLへのPOSTリクエストは、registerUser関数が担当する
router.post('/register', registerUser);

// '/login' というURLへのPOSTリクエストは、loginUser関数が担当する
router.post('/login', loginUser);

// '/verify' というURLへのGETリクエストは、まず「門番(protect)」がチェックし、
// 問題なければverifyUser関数が担当する
router.get('/verify', protect, verifyUser);

module.exports = router;