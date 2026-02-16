import { queryRunner } from '../config/db.js';
import bcrypt from 'bcrypt';

async function resetPassword() {
    try {
        const hashedPassword = await bcrypt.hash('password123', 10);
        await queryRunner('UPDATE users SET password = ? WHERE id = 1', [hashedPassword]);
        console.log('Password updated successfully for user ID 1');
    } catch (error) {
        console.error('Error updating password:', error);
    } finally {
        process.exit();
    }
}

resetPassword();
