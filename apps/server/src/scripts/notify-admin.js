/**
 * notify-admin.js
 * ---------------
 * A simple CLI script to send a custom notification to ALL admin accounts.
 *
 * Usage:
 *   node src/scripts/notify-admin.js \
 *     --type ORDER \
 *     --title "New order placed" \
 *     --description "User #42 placed an order for ₹2,500" \
 *     --link "/orders"
 *
 * All flags:
 *   --type         (required) Notification type: ORDER | PAYMENT | WALLET | ACCOUNT | SYSTEM
 *   --title        (required) Short heading shown in the notification
 *   --description  (optional) Body text
 *   --link         (optional) Admin route to navigate to (e.g. /orders, /wallets)
 *
 * If --link is provided, the description is stored as JSON so the
 * admin panel can render a "View Details" button automatically.
 */

import pool from "../config/db.js";
import "../config/env.js"; // load env vars

// ─── Parse CLI args ────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const get = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : null;
};

const type        = get("--type");
const title       = get("--title");
const description = get("--description") || "";
const link        = get("--link") || null;

// ─── Validation ────────────────────────────────────────────────────────────────
if (!type || !title) {
    console.error("❌  Missing required flags: --type and --title are required.");
    console.error("    Example:");
    console.error('    node src/scripts/notify-admin.js --type ORDER --title "New order" --description "User placed order" --link /orders');
    process.exit(1);
}

const VALID_TYPES = ["ORDER", "PAYMENT", "WALLET", "ACCOUNT", "SYSTEM"];
if (!VALID_TYPES.includes(type.toUpperCase())) {
    console.warn(`⚠️  Unknown type "${type}". Valid types: ${VALID_TYPES.join(", ")}`);
}

// ─── Main ──────────────────────────────────────────────────────────────────────
const notifyAdmins = async () => {
    let connection;
    try {
        connection = await pool.getConnection();

        // 1. Fetch all non-blocked admin IDs
        const [admins] = await connection.execute(
            `SELECT id, name, email FROM users WHERE role = 'ADMIN' AND is_blocked = 0`
        );

        if (!admins || admins.length === 0) {
            console.log("ℹ️  No admin accounts found. Nothing sent.");
            return;
        }

        console.log(`📋 Found ${admins.length} admin(s):`);
        admins.forEach((a) => console.log(`   • [${a.id}] ${a.name} <${a.email}>`));

        // 2. Build description payload
        //    If a link is provided, store as JSON so the admin UI can render
        //    a "View Details" button (matches existing notifyAdmins service behaviour).
        const finalDescription = link
            ? JSON.stringify({ text: description, link })
            : description || null;

        // 3. Bulk insert one notification per admin
        const values = admins.map((a) => [
            a.id,
            title,
            type.toUpperCase(),
            finalDescription,
        ]);

        const [result] = await connection.query(
            `INSERT INTO user_notifications (user_id, title, type, description) VALUES ?`,
            [values]
        );

        if (result?.affectedRows > 0) {
            console.log(`\n✅ Successfully sent notification to ${result.affectedRows} admin(s).`);
            console.log(`   Type        : ${type.toUpperCase()}`);
            console.log(`   Title       : ${title}`);
            if (description) console.log(`   Description : ${description}`);
            if (link)        console.log(`   Link        : ${link}`);
        } else {
            console.error("❌ Insert succeeded but 0 rows affected.");
        }

    } catch (err) {
        console.error("❌ Error sending admin notification:", err.message);
        process.exit(1);
    } finally {
        if (connection) connection.release();
        process.exit(0);
    }
};

notifyAdmins();
