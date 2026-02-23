/**
 * Final Activation Restriction Verification Script
 */

import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import * as withdrawalService from './src/services/withdrawalService.js';

const BASE_URL = 'http://localhost:4000/api/v1';
const JWT_SECRET = 'hereTheJwtKeyYG!@$%^&*seceret';
const DB_CONFIG = { host: 'localhost', user: 'root', password: '', database: 'afiliateecommerce', port: 3306 };

async function api(path, opts = {}) {
  const resp = await fetch(`${BASE_URL}${path}`, {
    method: opts.method || 'GET',
    headers: { 'Content-Type': 'application/json', ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}), ...opts.headers },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await resp.json();
  return { status: resp.status, data };
}

function makeToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
}

async function runTest() {
  const conn = await mysql.createConnection(DB_CONFIG);
  try {
    console.log('--- STARTING FINAL VERIFICATION ---');

    // 1. Setup Non-Activated User
    const [userRows] = await conn.execute("SELECT id FROM users WHERE phone = '9999999999'");
    let userId;
    if (userRows.length === 0) {
        const [res] = await conn.execute("INSERT INTO users (name, phone, referral_id, account_activation_status, is_active) VALUES ('Test User', '9999999999', 'TESTREF', 'NOT_STARTED', 0)");
        userId = res.insertId;
        await conn.execute("INSERT INTO wallets (user_id, balance) VALUES (?, 1000)", [userId]);
    } else {
        userId = userRows[0].id;
        await conn.execute("UPDATE users SET account_activation_status = 'NOT_STARTED', is_active = 0 WHERE id = ?", [userId]);
        await conn.execute("UPDATE wallets SET balance = 1000 WHERE user_id = ?", [userId]);
    }
    const token = makeToken(userId);
    console.log(`Test User ID: ${userId}, Status: NOT_STARTED, Wallet: 1000`);

    // 2. Setup Product
    const [productRows] = await conn.execute("SELECT id, sale_price FROM products WHERE is_active = 1 LIMIT 1");
    const product = productRows[0];

    // 3. Test Product Purchase (Should Fail with 403)
    console.log('\nTesting Product Purchase for Non-Activated User...');
    const orderPayload = {
      items: [{ productId: product.id, quantity: 1, price: parseFloat(product.sale_price) }],
      totalAmount: parseFloat(product.sale_price),
      shippingAddress: { address: 'Test St', city: 'Test City', state: 'Test State', pincode: '000000' },
      paymentMethod: 'WALLET',
      orderType: 'PRODUCT_PURCHASE'
    };
    const res1 = await api('/orders', { method: 'POST', token, body: orderPayload });
    if (res1.status === 403 && (res1.data.message.includes('must be activated') || res1.data.message.includes('not activated'))) {
        console.log('✅ Correctly rejected product purchase (status 403).');
    } else {
        console.log('❌ Unexpected result for product purchase:', res1.status, res1.data);
    }

    // 4. Test Withdrawal Service Directly (Should Throw)
    console.log('\nTesting Withdrawal Service Directly for Non-Activated User...');
    try {
        await withdrawalService.createWithdrawalRequest(userId, 100);
        console.log('❌ Failed to reject withdrawal service call.');
    } catch (err) {
        if (err.message.includes('must be activated')) {
            console.log('✅ Correctly threw activation error in service.');
        } else {
            console.log('❌ Unexpected error in service:', err.message);
        }
    }

    // 5. Test Activation Order via API (Should Pass with 201)
    console.log('\nTesting Activation Order for Non-Activated User...');
    const activationPayload = {
      items: [{ productId: product.id, quantity: 1, price: 500 }],
      totalAmount: 500,
      shippingAddress: { address: 'Test St', city: 'Test City', state: 'Test State', pincode: '000000' },
      paymentMethod: 'WALLET',
      orderType: 'ACTIVATION'
    };
    const res3 = await api('/orders', { method: 'POST', token, body: activationPayload });
    if (res3.status === 201) {
        console.log('✅ Correctly allowed activation order (status 201).');
    } else {
        console.log('❌ Failed to allow activation order:', res3.status, res3.data);
    }

    console.log('\n--- FINAL VERIFICATION COMPLETE ---');

  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    await conn.end();
  }
}

runTest();
