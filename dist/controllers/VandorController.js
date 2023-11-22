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
exports.GetFood = exports.AddFood = exports.UpdateVandorService = exports.UpdateVandorCoverImage = exports.UpdateVandorProfile = exports.GetVandorProfile = exports.VandorLogin = void 0;
const AdminController_1 = require("./AdminController");
const utility_1 = require("../utility");
const models_1 = require("../models");
const VandorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVandor = yield (0, AdminController_1.findVandor)('', email);
    if (existingVandor !== null) {
        const validation = yield (0, utility_1.ValidatePassword)(password, existingVandor.password, existingVandor.salt);
        if (validation) {
            const signature = (0, utility_1.GenerateSignature)({
                _id: existingVandor.id,
                email: existingVandor.email,
                foodTypes: existingVandor.foodType,
                name: existingVandor.name
            });
            return res.json(signature);
        }
        else {
            return res.json({ "message": "Password  not valid" });
        }
    }
    return res.json({ "message": "Login credentials not valid" });
});
exports.VandorLogin = VandorLogin;
const GetVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, AdminController_1.findVandor)(user._id);
        return res.json(existingVandor);
    }
    return res.json({ "message": "Vendor information not found" });
});
exports.GetVandorProfile = GetVandorProfile;
const UpdateVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, phone, foodType } = req.body;
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, AdminController_1.findVandor)(user._id);
        if (existingVandor !== null) {
            existingVandor.name = name;
            existingVandor.address = address;
            existingVandor.phone = phone;
            existingVandor.foodType = foodType;
            const savedResult = yield existingVandor.save();
            return res.json(savedResult);
        }
        return res.json(existingVandor);
    }
    return res.json({ "message": "Vendor information not found" });
});
exports.UpdateVandorProfile = UpdateVandorProfile;
const UpdateVandorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vandor = yield (0, AdminController_1.findVandor)(user._id);
        if (vandor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            vandor.coverImages.push(...images);
            const result = yield vandor.save();
            return res.json(result);
        }
    }
    return res.json({ "message": "Something went wrong! in adding food!" });
});
exports.UpdateVandorCoverImage = UpdateVandorCoverImage;
const UpdateVandorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVandor = yield (0, AdminController_1.findVandor)(user._id);
        if (existingVandor !== null) {
            existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
            const savedResult = yield existingVandor.save();
            return res.json(savedResult);
        }
        return res.json(existingVandor);
    }
    return res.json({ "message": "Vendor information not found!" });
});
exports.UpdateVandorService = UpdateVandorService;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { name, description, category, foodType, readTime, price } = req.body;
        const vandor = yield (0, AdminController_1.findVandor)(user._id);
        if (vandor !== null) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            const createdFood = yield models_1.Food.create({
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
            const result = yield vandor.save();
            return res.json(result);
        }
    }
    return res.json({ "message": "Something went wrong! in adding food!" });
});
exports.AddFood = AddFood;
const GetFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield models_1.Food.find({ vandorId: user._id });
        if (foods !== null) {
            return res.json(foods);
        }
    }
    return res.json({ "message": "Food information not found!" });
});
exports.GetFood = GetFood;
//# sourceMappingURL=VandorController.js.map