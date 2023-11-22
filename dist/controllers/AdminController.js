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
exports.GetVandorById = exports.GetVandors = exports.CreateVandor = exports.findVandor = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const findVandor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Vandor.findOne({ email: email });
    }
    else {
        return yield models_1.Vandor.findById(id);
    }
});
exports.findVandor = findVandor;
const CreateVandor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, ownerName, foodType, pincode, address, phone, email, password } = req.body;
    const existingVandor = yield (0, exports.findVandor)('', email);
    if (existingVandor !== null) {
        return res.json({ "Message": "Vendor already exists" });
    }
    // Genrate salt
    const salt = yield (0, utility_1.GenerateSalt)();
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    const CreatedVandor = yield models_1.Vandor.create({
        name: name,
        ownerName: ownerName,
        foodType: foodType,
        pincode: pincode,
        address: address,
        phone: phone,
        email: email,
        password: userPassword,
        salt: salt,
        serviceAvailable: true,
        coverImages: [],
        rating: 0,
        foods: []
    });
    return res.json(CreatedVandor);
});
exports.CreateVandor = CreateVandor;
const GetVandors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vandors = yield models_1.Vandor.find();
    if (vandors !== null) {
        return res.json(vandors);
    }
    return res.json({ "Message": "No Vandor data available" });
});
exports.GetVandors = GetVandors;
const GetVandorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vandorId = req.params.id;
    const vandor = yield (0, exports.findVandor)(vandorId);
    if (vandor !== null) {
        return res.json(vandor);
    }
    return res.json({ "Message": "This Vandor not exist " });
});
exports.GetVandorById = GetVandorById;
//# sourceMappingURL=AdminController.js.map