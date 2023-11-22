import { Request, Response, NextFunction } from 'express';
import { CreateVandorInput } from '../dto';
import { Vandor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';



export const findVandor = async (id:string | undefined, email?: string) => {
    if(email){
        return await Vandor.findOne({email: email});
    }else{
        return await Vandor.findById(id)
    }
}


export const CreateVandor = async (req: Request, res: Response, next: NextFunction) => {
    const { name,ownerName,foodType,pincode,address,phone,email,password } = <CreateVandorInput>req.body;
    const existingVandor = await findVandor('', email);
    if(existingVandor !== null){
        return res.json({"Message":"Vendor already exists"})
    }

    // Genrate salt
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);
    const CreatedVandor = await Vandor.create({
        name:name,
        ownerName:ownerName,
        foodType:foodType,
        pincode:pincode,
        address:address,
        phone:phone,
        email:email,
        password:userPassword,
        salt:salt,
        serviceAvailable:true,
        coverImages:[],
        rating:0,
        foods:[]
    });
    return res.json(CreatedVandor)
}

export const GetVandors = async (req: Request, res: Response, next: NextFunction) => {
   const vandors =  await Vandor.find();
   if(vandors !== null) {
   return res.json(vandors)
    
   }
   return res.json({"Message": "No Vandor data available"})
}

export const GetVandorById = async (req: Request, res: Response, next: NextFunction) => {
    const vandorId = req.params.id;
    const vandor = await findVandor(vandorId);
    if(vandor !== null) {
        return res.json(vandor)
         
        }
        return res.json({"Message": "This Vandor not exist "})
    }