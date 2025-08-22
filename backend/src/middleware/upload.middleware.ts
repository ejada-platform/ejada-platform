// src/middleware/upload.middleware.ts

import multer from 'multer';
import path from 'path';

// This configures multer to store files temporarily in memory
const storage = multer.memoryStorage();

// This function checks the file type to make sure we only accept valid documents
function checkFileType(file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const filetypes = /jpeg|jpg|png|pdf|mp3|mp4/; // Allowed extensions
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: You can only upload images, PDFs, or audio/video files!'));
    }
}

// Initialize multer with our configuration
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

export default upload;