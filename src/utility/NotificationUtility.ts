// Email
// Notification


// OTP
export const GenerateOtp =() =>{
    const otp = Math.floor(100000 + Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + 30 *60 * 1000);

    return {otp,expiry}
}

export const onRequestOTP = async(otp: number, toPhoneNumber:string) =>{
const accountSid = 'ACc8ce42d95d75a5fb00f7cc0cb04308e3';
const authToken = 'b3350860b97a36ad6451b305e995ac19';
const client = require('twilio')(accountSid,authToken);
const response = await client.messages.create({
    body:`Your OTP is ${otp}`,
    from: '+19292369957',
    to: `+25${toPhoneNumber}`
})

return response
}
//Payment Notification