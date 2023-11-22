"use strict";
// Email
// Notification
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
exports.onRequestOTP = exports.GenerateOtp = void 0;
// OTP
const GenerateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
    return { otp, expiry };
};
exports.GenerateOtp = GenerateOtp;
const onRequestOTP = (otp, toPhoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    const accountSid = 'ACc8ce42d95d75a5fb00f7cc0cb04308e3';
    const authToken = 'b3350860b97a36ad6451b305e995ac19';
    const client = require('twilio')(accountSid, authToken);
    const response = yield client.messages.create({
        body: `Your OTP is ${otp}`,
        from: '+19292369957',
        to: `+25${toPhoneNumber}`
    });
    return response;
});
exports.onRequestOTP = onRequestOTP;
//Payment Notification
//# sourceMappingURL=NotificationUtility.js.map