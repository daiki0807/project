const Document = require('../models/Document');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'text/plain' || file.mimetype === 'text/markdown') {
            cb(null, true);
        } else {
            cb(new Error('Only .txt and .md files are allowed!'), false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 5 }
});

// `upload.single('documentFile')` を `uploadMiddleware` としてエクスポート
exports.uploadMiddleware = upload.single('documentFile');

// `uploadDocument` 関数をエクスポート
exports.uploadDocument = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        const { originalname, buffer } = req.file;
        const content = buffer.toString('utf8');
        console.log("[UPLOAD内容]", content);

        const newDocument = new Document({
            title: originalname,
            content: content,
            user: req.user._id,
        });
        const savedDocument = await newDocument.save();
        res.status(201).json(savedDocument);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// `getUserDocuments` 関数をエクスポート
exports.getUserDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ user: req.user._id })
            .select('title createdAt highlights writingMode')
            .sort({ createdAt: -1 });

        const documentsWithHighlightCount = documents.map(doc => ({
            _id: doc._id,
            title: doc.title,
            createdAt: doc.createdAt,
            writingMode: doc.writingMode,
            highlightCount: doc.highlights ? doc.highlights.length : 0,
        }));
        res.json(documentsWithHighlightCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// `getDocumentById` 関数をエクスポート
exports.getDocumentById = async (req, res) => {
    try {
        const document = await Document.findOne({ _id: req.params.id, user: req.user._id });
        if (document) {
            res.json(document);
        } else {
            res.status(404).json({ message: 'Document not found or not authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// `updateDocument` 関数をエクスポート
exports.updateDocument = async (req, res) => {
    const { highlights, writingMode, title } = req.body;
    try {
        const document = await Document.findOne({ _id: req.params.id, user: req.user._id });
        if (document) {
            if (highlights !== undefined) document.highlights = highlights;
            if (writingMode !== undefined) document.writingMode = writingMode;
            if (title !== undefined) document.title = title;

            const updatedDocument = await document.save();
            res.json(updatedDocument);
        } else {
            res.status(404).json({ message: 'Document not found or not authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// `deleteDocument` 関数をエクスポート
exports.deleteDocument = async (req, res) => {
    try {
        const document = await Document.findOne({ _id: req.params.id, user: req.user._id });
        if (document) {
            await document.deleteOne();
            res.json({ message: 'Document removed' });
        } else {
            res.status(404).json({ message: 'Document not found or not authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};