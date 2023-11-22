import { Request, Response, NextFunction } from 'express';
import { CreateFoodInput, EditVendorInput, vendorLoginInput } from '../dto';
import { findVandor } from './AdminController';
import { GenerateSignature, ValidatePassword } from '../utility';
import { Food } from '../models';

export const VandorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <vendorLoginInput>req.body;
    const existingVandor = await findVandor('', email);
    if (existingVandor !== null) {
        const validation = await ValidatePassword(password, existingVandor.password, existingVandor.salt);
        if (validation) {
            const signature = GenerateSignature({
                _id: existingVandor.id,
                email: existingVandor.email,
                foodTypes: existingVandor.foodType,
                name: existingVandor.name
            })
            return res.json(signature);
        } else {
            return res.json({ "message": "Password  not valid" });
        }
    }
    return res.json({ "message": "Login credentials not valid" });
}

export const GetVandorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const existingVandor = await findVandor(user._id);
        return res.json(existingVandor);
    }
    return res.json({ "message": "Vendor information not found" });

}

export const UpdateVandorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { name, address, phone, foodType } = <EditVendorInput>req.body;
    const user = req.user;
    if (user) {
        const existingVandor = await findVandor(user._id);
        if (existingVandor !== null) {
            existingVandor.name = name;
            existingVandor.address = address;
            existingVandor.phone = phone;
            existingVandor.foodType = foodType;
            const savedResult = await existingVandor.save();
            return res.json(savedResult);
        }
        return res.json(existingVandor);
    }
    return res.json({ "message": "Vendor information not found" });
}

export const UpdateVandorCoverImage = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const vandor = await findVandor(user._id);
        if (vandor !== null) {

            const files = req.files as [Express.Multer.File];
            const images = files.map((file:Express.Multer.File) => file.filename);
            vandor.coverImages.push(...images);
            const result = await vandor.save();
            return res.json(result);

           
        }
    }
    return res.json({ "message": "Something went wrong! in adding food!" });
}

export const UpdateVandorService = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const existingVandor = await findVandor(user._id);
        if (existingVandor !== null) {
            existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
            const savedResult = await existingVandor.save();
            return res.json(savedResult);
        }
        return res.json(existingVandor);
    }
    return res.json({ "message": "Vendor information not found!" });
}

export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
        const { name, description, category, foodType, readTime, price } = <CreateFoodInput>req.body;
        const vandor = await findVandor(user._id);
        if (vandor !== null) {

            const files = req.files as [Express.Multer.File];
            const images = files.map((file:Express.Multer.File) => file.filename);

            const createdFood = await Food.create({
                vandorId: vandor._id,
                name: name,
                description: description,
                category: category,
                foodType: foodType,
                readTime: readTime,
                price: price,
                rating: 0,
                images: images,
            });
            vandor.foods.push(createdFood);
            const result = await vandor.save()
            return res.json(result);
        }
    }
    return res.json({ "message": "Something went wrong! in adding food!" });
}

export const GetFood = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user) {
            const foods = await Food.find({vandorId: user._id});
            if(foods !== null){
                return res.json(foods);
            }
    }
    return res.json({ "message": "Food information not found!" });
}