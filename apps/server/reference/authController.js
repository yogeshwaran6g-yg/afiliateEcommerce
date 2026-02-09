
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Vendor from "../models/vendorModel.js";
import { rtnRes } from "../utils/helper.js";
import { isDisposableEmail, isValidEmailFormat } from "../utils/emailValidator.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

// Generate 4 digit OTP
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};


// call send otp here
export const signup = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (email) {
      if (!isValidEmailFormat(email)) {
        return rtnRes(res, 400, "Invalid email format");
      }
      if (isDisposableEmail(email)) {
        return rtnRes(res, 400, "Disposable email addresses are not allowed");
      }
    }

    const userExists = await User.findOne({ 
      $or: [
        ...(email ? [{ email }] : []),
        { phone },
        ...(name ? [{ name }] : [])
      ] 
    });

    if (userExists) {
      let message = "User already exists";
      if (name === userExists.name) message = "Username is already taken";
      else if (email === userExists.email) message = "Email is already registered";
      else if (phone === userExists.phone) message = "Phone number is already registered";
      
      return rtnRes(res, 400, message);
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || "CUSTOMER", // Default to CUSTOMER if not provided
      otp,
      otpExpires,
    });

    if (user) {
      // In a real app, send SMS here. For now, log it.
      console.log(`[SIGNUP] OTP for ${phone}: ${otp}`);

      res.status(201).json({
        success: true,
        message: "User created successfully. Please verify your phone with the OTP sent.",
        data: {
            phone: user.phone,
            isPhoneVerified: user.isPhoneVerified
        }
      });
    } else {
        return rtnRes(res, 400, "Invalid user data");
    }
  } catch (error) {
    console.error(error);
    return rtnRes(res, 500, error.message);
  }
};


export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone }).select("+password");

    if (user && (await user.comparePassword(password))) {
      if (!user.isPhoneVerified) {
        return rtnRes(res, 403, "Please verify your phone number before logging in.");
      }

      let vendorId = undefined;
      if (user.role === "VENDOR") {
        const vendor = await Vendor.findOne({ user: user._id });
        vendorId = vendor?._id;
      }

      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: generateToken(user._id),
          vendorId: vendorId,
        }
      });
    } else {
        return rtnRes(res, 401, "Invalid phone or password");
    }
  } catch (error) {
     console.error(error);
     return rtnRes(res, 500, error.message);
  }
};


export const sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return rtnRes(res, 400, "Phone number is required");
        }

        let user = await User.findOne({ phone });
        
        // For this implementation, we might want to check if user exists for login flow
        // Or if it is a registration flow. For now, we will just send OTP if phone is valid string.
        // If user doesn't exist, we can't save OTP to them unless we create a temp user or handle it differently.
        // Assuming user MUST exist for login via OTP or we treat it as signup initialization?
        // Let's assume standard flow: User likely exists or this is verification for signup. 
        // If user does NOT exist, we can return error saying "User not found" if this is strictly Login via OTP.
        // However, requirements were "mobile otp login and signup". 
        // Simple approach: If user not found, we can't save OTP on user document.
        // Let's just create user if not exists? Or strictly require signup first?
        // Let's stick to: Find user. If user exists, save OTP. If not, maybe return info to proceed to signup.
        
        // Wait, typical "mobile login" often auto-creates account. 
        // But we have a specific signup controller. 
        
        // Let's implement: Send OTP to User if exists.
        
        if (!user) {
            // Option: Create a temporary user or just return error. 
            // For robust system, separate OTP store is better. 
            // But modifying User model was the plan.
             return rtnRes(res, 404, "User not found. Please sign up first.");
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        console.log(`OTP for ${phone}: ${otp}`); // Log for dev

        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.error(error);
        return rtnRes(res, 500, error.message);
    }
}


export const verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return rtnRes(res, 400, "Phone and OTP are required");
        }

        const user = await User.findOne({ phone }).select("+otp +otpExpires");

        if (!user) {
             return rtnRes(res, 404, "User not found");
        }

        if (user.otp !== otp) {
             return rtnRes(res, 400, "Invalid OTP");
        }

        if (user.otpExpires < Date.now()) {
             return rtnRes(res, 400, "OTP expired");
        }

        // Clear OTP
        user.otp = undefined;
        user.otpExpires = undefined;
        user.isPhoneVerified = true; // Mark phone as verified
        await user.save();

        let vendorId = undefined;
        if (user.role === "VENDOR") {
          const vendor = await Vendor.findOne({ user: user._id });
          vendorId = vendor?._id;
        }

        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id),
                vendorId: vendorId,
            }
        });

    } catch (error) {
         console.error(error);
         return rtnRes(res, 500, error.message);
    }
}


export const getProfile = async (req, res) => {
    try {
      console.log(req.user._id);
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return rtnRes(res, 404, "User not found");
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error);
        return rtnRes(res, 500, error.message);
    }
};


export const updateProfile = async (req, res) => {
    try {
        const { name, email, address } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return rtnRes(res, 404, "User not found");
        }

        if (email && email !== user.email) {
            if (!isValidEmailFormat(email)) {
                return rtnRes(res, 400, "Invalid email format");
            }
            if (isDisposableEmail(email)) {
                return rtnRes(res, 400, "Disposable email addresses are not allowed");
            }
            const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
            if (emailExists) {
                return rtnRes(res, 400, "Email is already taken");
            }
            user.email = email;
        }

        if (name && name !== user.name) {
            const usernameExists = await User.findOne({ name, _id: { $ne: user._id } });
            if (usernameExists) {
                return rtnRes(res, 400, "Username is already taken");
            }
            user.name = name;
        }

        user.name = name || user.name;
        user.address = address || user.address;

        if (req.file) {
            user.profileImage = `/uploads/profiles/${req.file.filename}`;
        } else if (req.body.profileImage === "null" || req.body.profileImage === null) {
            // Optional: user.profileImage = null;
        }

        const updatedUser = await user.save();

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.error(error);
        return rtnRes(res, 500, error.message);
    }
};


export const devLogin = async (req, res) => {
    try {
        let user = await User.findOne({ phone: "1122334455" });

        if (!user) {
            user = await User.create({
          name: "Test Customer",
          email: "customer@example.com",
          phone: "1122334455",
          password: "password123",
          role: "CUSTOMER",
          isEmailVerified: true,
          isPhoneVerified: true
        });
        }

        

        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id),
            }
        });
    } catch (error) {
        console.error(error);
        return rtnRes(res, 500, error.message);
    }
};


export const login2 = async (req, res) => {
  try {
    // ✅ Support GET (query) and POST (body)
    // console.log(req);
    const source = req.method === "GET" ? req.query : req.body;
    let { phone, password } = source;
    console.log("source", source)

    if (!phone) return rtnRes(res, 400, "Phone number is required");
    
    // Ensure phone is a string and contains only digits
    phone = phone.toString();
    if (!/^[0-9]{10}$/.test(phone)) {
      return rtnRes(res, 400, "Phone number must be exactly 10 numeric digits");
    }

    if (!password) return rtnRes(res, 400, "Password is required");

    let user = await User.findOne({ phone }).select("+password");

    // 1️⃣ User does not exist → auto signup
    

    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // if (!passwordRegex.test(password)) {
    //   return rtnRes(res, 400, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character");
    // }

    if (!user) {
      user = await User.create({
        phone,
        password: password || undefined,
        role: "CUSTOMER",
        isPhoneVerified: true,
      });
    }

    // 2️⃣ If password exists, validate it
    if (user.password && password) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return rtnRes(res, 401, "Invalid phone or password");
      }
    }

    /* 3️⃣ Vendor restriction removed to allow vendor login via link */
    let vendorId;
    if (user.role === "VENDOR") {
      return rtnRes(
        res,
        400,
        "Vendor is not allowed to use this. Create a separate account."
      );
    }

    // 4️⃣ Generate JWT
    const token = generateToken(user._id);

    // 5️⃣ Frontend redirect URL
    const redirectUrl = `${process.env.CLIENT_URL}/auth/success?token=${token}&role=${user.role}`;

    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      data: { redirectUrl },
    });
  } catch (error) {
    console.error("Auth Error:", error);
    return rtnRes(res, 500, error.message);
  }
};
