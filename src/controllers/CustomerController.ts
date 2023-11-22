import express, { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { CreateCustomerInput, EditCustomerProfileInput, UserLoginInputs } from '../dto/Customer.dto';
import { validate } from 'class-validator';
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword, onRequestOTP } from '../utility';
import { Customer } from '../models';

export const CustomerSignup = async (req: Request, res: Response, next: NextFunction) => {
    const customerInputs = plainToClass(CreateCustomerInput, req.body)
    const inputErrors = await validate(customerInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, phone, password } = customerInputs;

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const { otp, expiry } = GenerateOtp();
    const existCusomer = await Customer.findOne({ email: email });
    if (existCusomer !== null) {
        return res.status(400).json({ "message": "Customer exist with provided email" })

    }
    const result = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        firstName: "",
        lastName: "",
        address: "",
        phone: phone,
        verified: false,
        otp: otp,
        otp_expiry: expiry,
        lat: 0,
        lng: 0,
    });

    if (result) {
        await onRequestOTP(otp, phone);
        const signature = GenerateSignature({
            _id: result._id,
            email: result.email,
            verified: result.verified
        });

        return res.status(201).json({ signature: signature, email: result.email, verified: result.verified });
    }

    return res.status(400).json({ "message": "Error in signup" });


}

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
    const loginInputs = plainToClass(UserLoginInputs, req.body);
    const loginErros = await validate(loginInputs, { validationError: { target: false } });
    if (loginErros.length > 0) {
        return res.status(400).json(loginErros);
    }
    const { email, password } = loginInputs;


    const customer = await Customer.findOne({ email: email });
    if (customer) {
        const validation = await ValidatePassword(password, customer.password, customer.salt);
        if (validation) {
            const signature = GenerateSignature({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified,
            });
            return res.status(201).json({ signature: signature, email: customer.email, verified: customer.verified });


        }
    }
    return res.status(404).json({ "message": "Error in login" });

}

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {
    // Better understand what these code are doing
    const customer = req.user;

    if (customer) {

        const profile = await Customer.findById(customer._id);

        if (profile) {
            const { otp, expiry } = GenerateOtp();
            profile.otp = otp;
            profile.otp_expiry = expiry;

            await profile.save();
            const sendCode = await onRequestOTP(otp, profile.phone);

            if (!sendCode) {
                return res.status(400).json({ message: 'Failed to verify your phone number' })
            }

            return res.status(200).json({ message: 'OTP sent to your registered Mobile Number!' })


        }
    }

    return res.status(400).json({ msg: 'Error with Requesting OTP' });
}

export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = await Customer.findById(customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updatedCustomerResponse = await profile.save();

                const signature = GenerateSignature({
                    _id: updatedCustomerResponse._id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified,
                });
                return res.status(201).json({ signature: signature, email: updatedCustomerResponse.email, verified: updatedCustomerResponse.verified });


            }
        }
    }
    return res.status(400).json({ "message": "Error with OTP validation" });

}

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;
   
    if (customer) {
        const profile = await Customer.findById(customer._id);
        if(profile){
            return res.status(200).json(profile);
        }
    }
    return res.status(400).json({ msg: 'Error in fetching  profile data' });

}

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;
    const profileInputs = plainToClass(EditCustomerProfileInput, req.body);
    const profileErrors = await validate(profileInputs, { validationError: { target: false } });
    if (profileErrors.length > 0) {
        return res.status(200).json(profileErrors)
    }
    const { firstName, lastName, address } = profileInputs

    if (customer) {
        const profile = await Customer.findById(customer._id);
        if (profile) {
            profile.firstName = firstName;
            profile.address = address;
            profile.lastName = lastName;

            const result = await profile.save();
            return res.status(200).json(result)
        }

    }
    return res.status(400).json({ message: 'Error in editing customer profile' });

}