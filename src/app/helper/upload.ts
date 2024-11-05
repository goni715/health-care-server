import { Request } from "express";
import multer from "multer";
import path from 'path';
import ApiError from "../errors/ApiError";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(process.cwd()+'/uploads');
      cb(null, process.cwd()+'/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname); // Get file extension
        cb(null, file.fieldname + '-' + uniqueSuffix + extension); // Append the original file extension
    }
  })



  // File filter function
const fileFilter = function (req:Request, file:Express.Multer.File, cb: (error: Error | null, acceptFile?: boolean) => void) {
  // Accept images only
  const allowedExtensions = /jpeg|jpg|png|gif/;
  const mimeType = allowedExtensions.test(file.mimetype);
  const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    cb(null, true);
  } else {
    cb( new ApiError(400,'Only images are allowed (jpeg, jpg, png, gif)'));
  }
};

  
  const upload = multer({
     storage: storage,
     fileFilter
  });

  export default upload;