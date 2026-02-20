import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/payments');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'PAY-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/x-png" // Added for older browser/OS variations
    ];

    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".jpeg", ".jpg", ".png"];

    if (
        allowedMimeTypes.includes(file.mimetype) ||
        allowedExtensions.includes(ext)
    ) {
        return cb(null, true);
    }

    console.warn(`[Upload Rejected] Mimetype: ${file.mimetype}, Extension: ${ext}`);
    return cb(new Error("Only jpg, jpeg, and png are allowed!"), false);
};

const paymentUpload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: fileFilter
});

export default paymentUpload;
