import express, { Request, Response, NextFunction } from 'express';
import upload from '../helper/upload';
import multer from 'multer';

const app = express();

app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  res.send('File uploaded successfully');
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Max limit is 1MB.' });
    }
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
