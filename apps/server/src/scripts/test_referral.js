import pool from '../config/db.js';
import { createReferral, distributeCommission } from '../service/referralService.js';
import { log } from '../utils/helper.js';

const runTest = async () => {
    
    try {
        log("Starting Referral System Test...", "info");
        await pool.query("DELETE FROM users WHERE id IN (2001, 2002, 2003)");
        log("Cleaned up previous test data.", "info");

        const timestamp = Date.now();
        const users = [
            { id: 2001, name: 'Test Root', email: `root${timestamp}@test.com` },
            { id: 2002, name: 'Test Child A', email: `a${timestamp}@test.com` },
            { id: 2003, name: 'Test Child B', email: `b${timestamp}@test.com` }
        ];

        for (const u of users) {
             // Use INSERT IGNORE just in case
            await pool.query(
                `INSERT IGNORE INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`,
                [u.id, u.name, u.email, 'pass']
            );
        }
        log("Test Users Created/Ensured.", "success");

        // 2. Link Users: Root -> A -> B
        // Root (2001) -> A (2002)
        await createReferral(2001, 2002);
        
        // A (2002) -> B (2003)
        await createReferral(2002, 2003);
        
        log("Referrals Linked.", "success");

        // Verify Tree Structure for B (2003)
        // Should have: (2002, 2003, 1) and (2001, 2003, 2)
        const [treeRows] = await pool.query(
            `SELECT * FROM referral_tree WHERE downline_id = ? ORDER BY level`,
            [2003]
        );
        log(`Tree Rows for User B: ${JSON.stringify(treeRows)}`, "debug");

        if (treeRows.length !== 2) throw new Error("Incorrect tree depth");
        if (treeRows[0].upline_id !== 2002 || treeRows[0].level !== 1) throw new Error("Level 1 mismatch");
        if (treeRows[1].upline_id !== 2001 || treeRows[1].level !== 2) throw new Error("Level 2 mismatch");
        log("Tree Structure Verified.", "success");


        // 3. create Order for B (2003)
        const orderId = 99999 + Math.floor(Math.random() * 1000);
        await pool.query(
            `INSERT INTO orders (id, user_id, amount, status) VALUES (?, ?, ?, ?)`,
            [orderId, 2003, 1000.00, 'COMPLETED']
        );
        log(`Order ${orderId} created for User B.`, "success");

        // 4. Distribute Commission
        await distributeCommission(orderId, 2003, 1000.00);

        // 5. Verify Commissions
        // Config: Lvl 1 = 10% (100.00), Lvl 2 = 5% (50.00)
        const [commRows] = await pool.query(
            `SELECT * FROM referral_commission_distribution WHERE order_id = ? ORDER BY level`,
            [orderId]
        );
        log(`Commission Rows: ${JSON.stringify(commRows)}`, "debug");

        if (commRows.length !== 2) throw new Error("Incorrect commission entries");
        
        // Check Lvl 1 (User A - 2002)
        const comm1 = commRows.find(r => r.upline_id === 2002);
        if (!comm1 || parseFloat(comm1.amount) !== 100.00) throw new Error("Level 1 commission mismatch");

        // Check Lvl 2 (User Root - 2001)
        const comm2 = commRows.find(r => r.upline_id === 2001);
        if (!comm2 || parseFloat(comm2.amount) !== 50.00) throw new Error("Level 2 commission mismatch");

        log("Commissions Verified Successfully!", "success");

    } catch (error) {
        log(`Test Failed: ${error.message}`, "error");
        process.exit(1);
    }
    
};

runTest()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
