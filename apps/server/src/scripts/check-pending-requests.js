import { queryRunner } from '../config/db.js';

async function checkPendingRequests() {
    try {
        console.log('Checking pending recharge requests...');
        const rows = await queryRunner("SELECT id, user_id, amount, payment_reference, proof_image, status FROM recharge_requests WHERE status = 'REVIEW_PENDING'");
        
        console.log(`Found ${rows.length} pending requests.`);
        console.table(rows);
        
        // specific check for absolute paths
        const absolutePaths = rows.filter(r => r.proof_image && r.proof_image.includes(':'));
        if (absolutePaths.length > 0) {
            console.log('WARNING: The following requests have absolute paths:');
            console.table(absolutePaths);
        } else {
            console.log('All pending requests have relative paths (or no proof image).');
        }

    } catch (error) {
        console.error('Error checking requests:', error);
    } finally {
        process.exit();
    }
}

checkPendingRequests();
