const crypto = require("crypto");
const { log } = require("./helper");
require("dotenv").config();


WHATSUP_OTP_TOKEN=TImuRmxt8x9kgAux5foPbzrgi6RJJzIcFpa7bdQD2HSRRGCPWeRrJA5dZdotmE2b
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashOtp = (otp) => {
    return crypto.createHash("sha256").update(otp).digest("hex");
};

async function fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    options.signal = controller.signal;

    try {
        const res = await fetch(url, options);
        clearTimeout(id);
        return { result: true, res };
    } catch (err) {
        log("OTP Fetch Error", "error", err.message || "unknown error");
        clearTimeout(id);
        return { result: false };
    }
}

const sendOtp = async (phone) => {
    const otp = generateOtp();
    if (!phone || !otp) {
        log("OTP Send Failed: Missing phone or OTP", "error");
        return { success: false };
    }

    try {
        // WhatsApp OTP Payload
        const payload = {
            phone_number: `91${phone}`, // Assuming phone is passed without country code, adding 91 prefix
            template_name: "app_verify",
            template_language: "en_US",
            field_1: `${otp}`,
            button_0: `${otp}`
        };

        const token = process.env.WHATSUP_OTP_TOKEN;
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        };

        const response = await fetchWithTimeout(process.env.WHATSUP_BASE_URL, {
            method: "POST",
            headers,
            body: JSON.stringify(payload)
        });

        if (!response.result) {
            log("WhatsApp OTP Request Failed (Network/Timeout)", "error");
            return { success: false, message: "Network error sending OTP" };
        }

        const resultJson = await response.res.json();

        if (resultJson.result === "failed" || resultJson.result === false || resultJson.status === 'error') {
            log("WhatsApp OTP Failed", "error", resultJson);
             return { success: false, message: resultJson.message || "Provider returned error" };
         }

        log(`WhatsApp OTP Response for ${phone}`, "info", resultJson);

        return {
            success: true,
            otp: hashOtp(otp)
        };

    } catch (error) {
        log("OTP Service Error", "error", error.message);
        return {
            success: false,
            message: error.message
        };
    }
};

module.exports = {
    generateOtp,
    hashOtp,
    sendOtp
};

