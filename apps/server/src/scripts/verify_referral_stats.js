import { getReferralOverview } from "../service/referralService.js";
import { log } from "../utils/helper.js";

async function verify() {
    try {
        const rootUserId = 1; // Assuming 1 is the root user
        console.log(`Verifying referral overview for User ${rootUserId}...`);
        
        const result = await getReferralOverview(rootUserId);
        if (!result.success) {
            console.error("Failed to fetch referral overview");
            return;
        }
        console.log("===================================================================")
        console.dir(result.data,{depth:null})
        console.log("===================================================================")
        const data = result.data;
        console.log(`Overall Count: ${data.overallCount}`);
        console.log(`Overall Earnings: ${data.overallEarnings}`);

        data.levels.forEach(lvl => {
            console.log(`\n--- Level ${lvl.level} ---`);
            console.log(`Referral Count: ${lvl.referralCount}`);
            console.log(`Total Earnings: ${lvl.totalEarnings}`);
            
            const contributionSum = lvl.contributions.reduce((sum, c) => sum + c.amount, 0);
            console.log(`Sum of Contributions: ${contributionSum}`);

            if (Math.abs(contributionSum - lvl.totalEarnings) < 0.01) {
                console.log("✅ Sum of contributions matches level earnings.");
            } else {
                console.error("❌ Error: Sum of contributions does NOT match level earnings!");
            }

            // Check if any member ID in contributions is NOT Level 1
            // (Strictly, Level 1 contributions should only have themselves as l1_id)
            if (lvl.level === 1) {
                const invalid = lvl.contributions.filter(c => !lvl.members.find(m => m.id === c.memberId));
                if (invalid.length > 0) {
                    console.error("❌ Error: Level 1 contributions contain members not in Level 1!");
                }
            }
        });

    } catch (error) {
        console.error("Verification failed:", error);
    }
}

verify().then(() => process.exit());
