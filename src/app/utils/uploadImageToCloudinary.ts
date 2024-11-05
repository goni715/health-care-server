import fs from 'fs';
import cloudinary from '../helper/cloudinary';

const uploadImageToCloudinary = async (path: string) => {
    
    // Upload an image
    const uploadResult = await cloudinary.uploader
      .upload(
           path,{ 
            folder: "health-care"
           }
      )

      fs.unlinkSync(path);

   return uploadResult;

   
}


export default uploadImageToCloudinary;