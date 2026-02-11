import * as profileService from '#services/profileService.js';
import { rtnRes, log } from '#utils/helper.js';

const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const profileData = await profileService.getProfileByUserId(userId);
        
        if (!profileData) {
            return rtnRes(res, 404, "User not found");
        }
        
        return rtnRes(res, 200, "Profile fetched successfully", profileData);
    } catch (error) {
        log(`Error in getMyProfile: ${error.message}`, "error");
        return rtnRes(res, 500, "Internal Server Error");
    }
};

const updatePersonal = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, profile: { dob, profile_image } = {} } = req.body;
        
        await profileService.updatePersonalProfile(userId, { name, phone, dob, profile_image });
        
        return rtnRes(res, 200, "Personal details updated successfully");
    } catch (error) {
        log(`Error in updatePersonal: ${error.message}`, "error");
        return rtnRes(res, 500, "Internal Server Error");
    }
};

const updateIdentity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { idType, idNumber } = req.body;
        const file = req.file;
        
        let idDocumentUrl = null;
        if (file) {
            idDocumentUrl = `/uploads/kyc/${file.filename}`;
        }
        
        await profileService.updateIdentity(userId, { idType, idNumber, idDocumentUrl });
        
        return rtnRes(res, 200, "Identity details submitted for verification");
    } catch (error) {
        log(`Error in updateIdentity: ${error.message}`, "error");
        return rtnRes(res, 500, "Internal Server Error");
    }
};

const updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        // Address data might be stringified if sent with multipart/form-data
        let addressData = req.body.addressData;
        if (typeof addressData === 'string') {
            addressData = JSON.parse(addressData);
        }
        
        const file = req.file;
        let addressDocumentUrl = null;
        if (file) {
            addressDocumentUrl = `/uploads/kyc/${file.filename}`;
        }
        
        await profileService.updateAddress(userId, { addressData, addressDocumentUrl });
        
        return rtnRes(res, 200, "Address details submitted for verification");
    } catch (error) {
        log(`Error in updateAddress: ${error.message}`, "error");
        return rtnRes(res, 500, "Internal Server Error");
    }
};

const updateBank = async (req, res) => {
    try {
        const userId = req.user.id;
        let bankData = req.body.bankData;
        if (typeof bankData === 'string') {
            bankData = JSON.parse(bankData);
        }
        
        const file = req.file;
        let bankDocumentUrl = null;
        if (file) {
            bankDocumentUrl = `/uploads/kyc/${file.filename}`;
        }
        
        await profileService.updateBank(userId, { bankData, bankDocumentUrl });
        
        return rtnRes(res, 200, "Bank details submitted for verification");
    } catch (error) {
        log(`Error in updateBank: ${error.message}`, "error");
        return rtnRes(res, 500, "Internal Server Error");
    }
};

export default {
    getMyProfile,
    updatePersonal,
    updateIdentity,
    updateAddress,
    updateBank
};
