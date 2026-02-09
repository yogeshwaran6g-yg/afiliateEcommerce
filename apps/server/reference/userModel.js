import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    /* ------------------------ Core Identity ------------------------ */

    name: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true, // allows multiple nulls
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      // default: null,
      required: true
    },

   
    password: {
      type: String,
      required: false,
      minlength: 6,
      select: false, // never return password
    },

    /* ------------------------ Roles & Access ------------------------ */

    role: {
      type: String,
      enum: ["ADMIN", "VENDOR", "CUSTOMER"],
      default: "CUSTOMER",
      index: true,
    },

    /* ------------------------ Account Status ------------------------ */

    status: {
      type: String,
      enum: ["ACTIVE", "BLOCKED"],
      default: "ACTIVE",
      index: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    /* ------------------------ OTP Handling ------------------------ */

    otp: {
      type: String,
      select: false, // Do not return OTP in queries
    },
    
    otpExpires: {
      type: Date,
      select: false,
    },

    /* ------------------------ Security ------------------------ */

    lastLoginAt: Date,

    passwordChangedAt: Date,

    /* ------------------------ Soft Delete ------------------------ */

    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },

    /* ------------------------ Profile Information ------------------------ */

    address: {
      type: String,
      trim: true,
    },

    profileImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

/* ---------------------------- Indexes ---------------------------- */

userSchema.index({ role: 1, status: 1 });


/* ------------------------ Password Handling ------------------------ */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = new Date();
  next();
});


/* ------------------------ Instance Methods ------------------------ */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
