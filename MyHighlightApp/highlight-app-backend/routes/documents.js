const express = require('express');
const router = express.Router();
const {
    uploadDocument,
    uploadMiddleware,
    getUserDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

// '/upload' というURLへのPOSTリクエストは、まず「門番(protect)」がチェックし、
// 次に「ファイルアップロード(uploadMiddleware)」が処理し、
// 最後に「データベース保存(uploadDocument)」が担当する
router.post('/upload', protect, uploadMiddleware, uploadDocument);

// ルートURL ('/') へのGETリクエストは、一覧取得(getUserDocuments)が担当
router.get('/', protect, getUserDocuments);

// '/:id' というURL（例: /60b8d295f1d2c1234567890a）へのリクエストの交通整理
router.route('/:id')
    .get(protect, getDocumentById)    // GETなら個別取得
    .put(protect, updateDocument)     // PUTなら更新
    .delete(protect, deleteDocument); // DELETEなら削除

module.exports = router;