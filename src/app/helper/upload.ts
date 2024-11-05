import { Request } from "express";
import multer from "multer";
import path from 'path';
import ApiError from "../errors/ApiError";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
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


 //1 MB = 1024 KB
 //1 KB = 1024 bytes
//const fileSize= 1024 * 1024 * 2 = 2097152 bytes = 2MB
const fileSize = 1048576 //1MB

  
  const upload = multer({
     storage: storage,
     fileFilter,
     limits: {
      fileSize: fileSize
     }
  });

  export default upload;