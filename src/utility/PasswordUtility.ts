import bcrypt from 'bcrypt';
import {Request} from 'express';
import jwt from 'jsonwebtoken'
import { APP_SECRET } from '../configs';
import { AuthPayLoad } from '../dto/Auth.dto';

export const GenerateSalt = async () => {
    return await bcrypt.genSalt()
}

export const GeneratePassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
}

export const ValidatePassword = async (enteredPassword: string, savedPassword: string, salt: string) => {
    return await GeneratePassword(enteredPassword, salt) === savedPassword;
}

export const GenerateSignature = (payLoad: AuthPayLoad) => {
    return jwt.sign(payLoad, APP_SECRET, { expiresIn: '1d' }); // can be modified
}

export const validateSignature = async (req: Request) => {
    const signature = req.get('Authorization');
    if (signature) {
       const payLoad = await jwt.verify(signature.split(' ')[1],APP_SECRET) as AuthPayLoad;
       req.user = payLoad
       return true
    }
    return false
} 