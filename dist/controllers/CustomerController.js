"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditCustomerProfile = exports.GetCustomerProfile = exports.CustomerVerify = exports.RequestOtp = exports.CustomerLogin = exports.CustomerSignup = void 0;
const class_transformer_1 = require("class-transformer");
const Customer_dto_1 = require("../dto/Customer.dto");
const class_validator_1 = require("class-validator");
const utility_1 = require("../utility");
const models_1 = require("../models");
const CustomerSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.CreateCustomerInput, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, phone, password } = customerInputs;
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    const { otp, expiry } = (0, utility_1.GenerateOtp)();
    const existCusomer = yield models_1.Customer.findOne({ email: email });
    if (existCusomer !== null) {
        return res.status(400).json({ "message": "Customer exist with provided email" });
    }
    const result = yield models_1.Customer.create({
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
        yield (0, utility_1.onRequestOTP)(otp, phone);
        const signature = (0, utility_1.GenerateSignature)({
            _id: result._id,
            email: result.email,
            verified: result.verified
        });
        return res.status(201).json({ signature: signature, email: result.email, verified: result.verified });
    }
    return res.status(400).json({ "message": "Error in signup" });
});
exports.CustomerSignup = CustomerSignup;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.UserLoginInputs, req.body);
    const loginErros = yield (0, class_validator_1.validate)(loginInputs, { validationError: { target: false } });
    if (loginErros.length > 0) {
        return res.status(400).json(loginErros);
    }
    const { email, password } = loginInputs;
    const customer = yield models_1.Customer.findOne({ email: email });
    if (customer) {
        const validation = yield (0, utility_1.ValidatePassword)(password, customer.password, customer.salt);
        if (validation) {
            const signature = (0, utility_1.GenerateSignature)({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified,
            });
            return res.status(201).json({ signature: signature, email: customer.email, verified: customer.verified });
        }
    }
    return res.status(404).json({ "message": "Error in login" });
});
exports.CustomerLogin = CustomerLogin;
const RequestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Better understand what these code are doing
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            const { otp, expiry } = (0, utility_1.GenerateOtp)();
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            const sendCode = yield (0, utility_1.onRequestOTP)(otp, profile.phone);
            if (!sendCode) {
                return res.status(400).json({ message: 'Failed to verify your phone number' });
            }
            return res.status(200).json({ message: 'OTP sent to your registered Mobile Number!' });
        }
    }
    return res.status(400).json({ msg: 'Error with Requesting OTP' });
});
exports.RequestOtp = RequestOtp;
const CustomerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updatedCustomerResponse = yield profile.save();
                const signature = (0, utility_1.GenerateSignature)({
                    _id: updatedCustomerResponse._id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified,
                });
                return res.status(201).json({ signature: signature, email: updatedCustomerResponse.email, verified: updatedCustomerResponse.verified });
            }
        }
    }
    return res.status(400).json({ "message": "Error with OTP validation" });
});
exports.CustomerVerify = CustomerVerify;
const GetCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            return res.status(200).json(profile);
        }
    }
    return res.status(400).json({ msg: 'Error in fetching  profile data' });
});
exports.GetCustomerProfile = GetCustomerProfile;
const EditCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const profileInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.EditCustomerProfileInput, req.body);
    const profileErrors = yield (0, class_validator_1.validate)(profileInputs, { validationError: { target: false } });
    if (profileErrors.length > 0) {
        return res.status(200).json(profileErrors);
    }
    const { firstName, lastName, address } = profileInputs;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id);
        if (profile) {
            profile.firstName = firstName;
            profile.address = address;
            profile.lastName = lastName;
            const result = yield profile.save();
            return res.status(200).json(result);
        }
    }
    return res.status(400).json({ message: 'Error in editing customer profile' });
});
exports.EditCustomerProfile = EditCustomerProfile;
//# sourceMappingURL=CustomerController.js.map