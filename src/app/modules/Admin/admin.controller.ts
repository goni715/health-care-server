import { Request, Response } from "express";
import { getAllAdminsService } from "./admin.service";


const pick = (obj: Record<string, unknown>, keys: string[]) => {
  let validFieldsObject: Record<string, unknown> = {}
  const objKeysArray = Object.keys(obj);

  if(objKeysArray.length > 0){
    objKeysArray.forEach((key)=> {
      if(keys.includes(key)){
        validFieldsObject[key] = obj[key]
      }
    })
  }

  console.log(validFieldsObject);
  

}


const getAllAdmins = async (req: Request, res: Response) => {
  pick(req.query, ['searchTerm', 'name', 'email', 'contactNumber'])


    try{
      const result =  await getAllAdminsService(req.query);
      res.status(200).json({
        success: true,
        message: "Admins are retrieved successfully",
        data: result
      });
    }
    catch(err:any){
      res.status(500).json({
        success: false,
        message: err.name || 'Something Went Wrong',
        error: err
      })
    }
  }
  
  
  export const adminController = {
      getAllAdmins
  }