"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path_1.default.extname(file.originalname); // Get file extension
        cb(null, file.fieldname + '-' + uniqueSuffix + extension); // Append the original file extension
    }
});
// File filter function
const fileFilter = function (req, file, cb) {
    // Accept images only
    const allowedExtensions = /jpeg|jpg|png|gif/;
    const mimeType = allowedExtensions.test(file.mimetype);
    const extName = allowedExtensions.test(path_1.default.extname(file.originalname).toLowerCase());
    if (mimeType && extName) {
        cb(null, true);
    }
    else {
        cb(new ApiError_1.default(400, 'Only images are allowed (jpeg, jpg, png, gif)'));
    }
};
//1 MB = 1024 KB
//1 KB = 1024 bytes
//const fileSize= 1024 * 1024 * 2 = 2097152 bytes = 2MB
const fileSize = 1048576; //1MB
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter,
    limits: {
        fileSize: fileSize
    }
});
exports.default = upload;
