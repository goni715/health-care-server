import multer from "multer";
import path from 'path';

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
  
  const upload = multer({ storage: storage });

  export default upload;