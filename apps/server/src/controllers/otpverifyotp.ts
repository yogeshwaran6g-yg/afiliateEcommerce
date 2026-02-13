export const verifyOtp = async (userId, otp, purpose, phone = null) => {
    try {
        const rows = await queryRunner('SELECT * FROM otp WHERE user_id = ?', [userId]);
        console.log(rows)
        if (!rows || rows.length === 0) {
            return { code: 400, message: "OTP not found or expired" };
        }

        const otpRecord = rows[0];

        if (new Date() > new Date(otpRecord.expires_at)) {
            return { code: 400, message: "OTP expired" };
        }

        if (purpose && otpRecord.purpose !== purpose) {
            return { code: 400, message: "OTP purpose mismatch" };
        }

        const isMatch = await bcrypt.compare(otp, otpRecord.otp_hash);
        if (!isMatch) {
            return { code: 400, message: "Invalid OTP" };
        }

        // Mark user as verified
        await queryRunner('UPDATE users SET is_verified = TRUE WHERE id = ?', [userId]);

        // Clear OTP
        await queryRunner('DELETE FROM otp WHERE user_id = ?', [userId]);

        const user = await findUserById(userId);
        delete user.password;

        // Generate token for all successful verifications (signup or login)
        const token = generateToken(user);
        return {
            code: 200,
            message: "OTP verified successfully",
            data: { user, token }
        };

    } catch (e) {
        log(`Verify OTP error: ${e.message}`, "error");
        return { code: 500, message: "Internal server error" };
    }
};