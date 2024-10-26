const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const generateAndSendOTP = async (phoneNumber, otpTemplateName = 'OTP1') => {
    const url = `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${phoneNumber}/AUTOGEN3/${otpTemplateName}`;

    try {
        const response = await axios.get(url);
        if (response.data.Status === 'Success') {
            const otp = response.data.OTP;
            console.log(`OTP sent to ${phoneNumber}: ${otp}`);
            return true;
        } else {
            console.error(`Error sending OTP: ${response.data.Details}`);
            return false;
        }
    } catch (error) {
        console.error(`Failed to send OTP: ${error.message}`);
        return false;
    }
};

const verifyOTP = async (phoneNumber, userInputOtp) => {
    const url = `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/VERIFY3/${phoneNumber}/${userInputOtp}`;

    try {
        const response = await axios.get(url);

        if (response.data.Status === 'Success') {
            return true;
        } else {
            console.error(`OTP verification failed: ${response.data.Details}`);
            return false;
        }
    } catch (error) {
        console.error(`Failed to verify OTP: ${error.message}`);
        return false; 
    }
};

module.exports = {
    generateAndSendOTP,
    verifyOTP
};
