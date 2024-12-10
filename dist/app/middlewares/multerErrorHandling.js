"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = __importDefault(require("../helper/upload"));
const multer_1 = __importDefault(require("multer"));
const app = (0, express_1.default)();
app.post('/upload', upload_1.default.single('file'), (req, res) => {
    res.send('File uploaded successfully');
});
// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size too large. Max limit is 1MB.' });
        }
    }
    else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
