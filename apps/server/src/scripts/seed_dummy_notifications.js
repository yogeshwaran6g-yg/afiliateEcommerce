import { queryRunner } from '../config/db.js';

const dummyNotifications = [
    ['Spring Mega Sale 2026', 'Get up to 50% off on all electronics and fashion items this spring.', 'Our biggest sale of the year is here! Enjoy massive discounts across all categories including the latest smartphones, designer clothing, and home appliances. Free shipping on orders over $500. Don\'t miss out on these exclusive deals available for a limited time only.', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1000', '2026-04-30 23:59:59'],
    ['New Premium Earbuds Pro', 'Experience crystal clear sound with the all-new noise-cancelling earbuds.', 'Introducing the latest iteration of our signature audio series. The Earbuds Pro 2 featured advanced active noise cancellation, 40-hour battery life, and spatial audio support. Available now in Midnight Black and Arctic White.', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=1000', '2026-05-15 23:59:59'],
    ['Referral Program Update', 'Earn double commission on all successful referrals this weekend.', 'Boost your earnings! For the next 48 hours, we are doubling successful referral payouts. Invite your network and start earning more. Check your dashboard for the updated commission tracking.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000', '2026-02-16 23:59:59'],
    ['System Maintenance Notice', 'Brief downtime scheduled for security and performance optimizations.', 'Our platform will undergo scheduled maintenance on Sunday, Feb 20th, between 2:00 AM and 4:00 AM UTC. This update includes critical security patches and performance improvements to make your experience smoother.', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000', '2026-02-21 00:00:00'],
    ['Gourmet Coffee Collection', 'Explore our new organic beans sourced from the finest plantations.', 'Sip the excellence with our new organic signature blends. Sourced sustainably from ethical farms, our latest collection features unique flavor profiles ranging from dark chocolate to citrus highlights.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000', '2026-06-01 23:59:59'],
    ['Network Expansion in Asia', 'We are officially launching our affiliate operations in Tokyo and Seoul.', 'Exciting news! We are expanding our global footprint to the Asian market. New distribution centers are now active in Tokyo and Seoul, providing faster shipping and localized support for our partners in the region.', 'https://images.unsplash.com/photo-1540959733332-e94e270b4d82?auto=format&fit=crop&q=80&w=1000', '2026-12-31 23:59:59'],
    ['Cyber Security Awareness Month', 'Protect your account with these 5 essential security tips.', 'Your security is our priority. Learn how to identify phishing attempts, enable two-factor authentication, and create strong passwords. Read the full guide in our support center to keep your business safe.', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000', '2026-03-31 23:59:59'],
    ['Smart Home Series III', 'The future of living is here with our integrated IoT home ecosystem.', 'Transform your living space with the smart home automation kit. Control lighting, temperature, and security from your smartphone. Compatible with all major voice assistants.', 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=1000', '2026-08-10 23:59:59'],
    ['Exclusive Webinar: Scaling Your Business', 'Join our top affiliates for a deep dive into successful growth strategies.', 'Register for our limited-capacity webinar where industry leaders share their secrets to scaling a profitable affiliate business. Live Q&A session included.', 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&q=80&w=1000', '2026-03-05 18:00:00'],
    ['New Payment Method: Crypto Payments', 'You can now withdraw your earnings in major cryptocurrencies.', 'By popular demand, we have added cryptocurrency withdrawal options. You can now receive your payments in BTC, ETH, and USDT with lower transaction fees. Update your wallet settings to get started.', 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=1000', '2026-12-31 23:59:59']
];

async function seed() {
    console.log("Seeding dummy notifications...");
    try {
        for (const [heading, sDesc, lDesc, img, endTime] of dummyNotifications) {
            await queryRunner(
                `INSERT INTO notifications (heading, short_description, long_description, image_url, advertisement_end_time) 
                 VALUES (?, ?, ?, ?, ?)`,
                [heading, sDesc, lDesc, img, endTime]
            );
        }
        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
