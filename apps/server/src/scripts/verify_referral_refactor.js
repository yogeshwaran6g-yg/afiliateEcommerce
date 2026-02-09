import { getReferralOverview } from "#service/referralService.js";
import { log } from "#utils/helper.js";

async function verify() {
    try {
        const rootUserId = 1; // Assuming 1 is the root user
        console.log(`Verifying referral overview for User ${rootUserId}...`);
        
        const result = await getReferralOverview(rootUserId);
        if (!result.success) {
            console.error("Failed to fetch referral overview");
            return;
        }

        const data = result.data;
        console.dir(data,{depth:null})
        console.log("===================================================================");
        console.log("ROOT INFO:");
        console.log(JSON.stringify(data.root, null, 2));
        console.log(`Overall Count: ${data.overallCount}`);
        console.log(`Overall Earnings: ${data.overallEarnings}`);
        console.log("===================================================================");

        data.levels.forEach(lvl => {
            console.log(`\n--- Level ${lvl.level} ---`);
            console.log(`Referral Count: ${lvl.referralCount}`);
            console.log(`Total Earnings: ${lvl.totalEarnings}`);
            
            lvl.members.forEach(m => {
                console.log(`  Member: ${m.name} (ID: ${m.id})`);
                console.log(`    Referrer: ${m.referrer ? `${m.referrer.name} (ID: ${m.referrer.id})` : 'None'}`);
                console.log(`    Downline Earnings (for Root): ${m.downlineEarnings}`);
            });
        });

        // Basic consistency checks
        const summedEarnings = data.levels.reduce((sum, l) => sum + l.totalEarnings, 0);
        if (Math.abs(summedEarnings - data.overallEarnings) < 0.01) {
            console.log("\n✅ Overall earnings matches sum of level earnings.");
        } else {
            console.error("\n❌ Error: Overall earnings does NOT match sum of level earnings!");
        }

        // L1 Downline Earnings check: Sum of L1 downlineEarnings should equal sum of L2-L6 earnings
        if (data.levels.length > 0) {
            const l1Members = data.levels.find(l => l.level === 1)?.members || [];
            const l1DownlineEarningsSum = l1Members.reduce((sum, m) => sum + m.downlineEarnings, 0);
            
            const l2PlusEarningsSum = data.levels
                .filter(l => l.level > 1)
                .reduce((sum, l) => sum + l.totalEarnings, 0);
            
            console.log(`\nL1 Downline Earnings Sum: ${l1DownlineEarningsSum}`);
            console.log(`L2-L6 Total Earnings Sum: ${l2PlusEarningsSum}`);
            
            if (Math.abs(l1DownlineEarningsSum - l2PlusEarningsSum) < 0.01) {
                console.log("✅ L1 downline earnings correctly account for all L2-L6 commissions.");
            } else {
                console.warn("⚠️ Note: L1 downline earnings sum does not perfectly match L2-L6 total earnings. This might be expected if some L2-L6 earnings are from orphan branches or if logic differs.");
            }
        }

    } catch (error) {
        console.error("Verification failed:", error);
    }
}

verify().then(() => process.exit());
