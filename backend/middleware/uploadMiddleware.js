const multer = require('multer');
const path = require('path');
const fs = require('fs');

// pastikan folder ada
const uploadDir = path.join(__dirname, '../uploads/images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpg|jpeg|png|pdf/;
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowed.test(ext)) cb(null, true);
    else cb(new Error('File type tidak didukung'), false);
};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;
