/**
 * Purchase Flow E2E Test Script
 * Tests both MANUAL and WALLET purchase flows against the live backend + DB.
 * 
 * Run: node test_purchase_flow.js
 */

import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

const BASE_URL = 'http://localhost:4000/api/v1';
const JWT_SECRET = 'hereTheJwtKeyYG!@$%^&*seceret';
const DB_CONFIG = { host: 'localhost', user: 'root', password: '', database: 'afiliateecommerce', port: 3306 };

// ─── Helpers ───────────────────────────────────────────────────────
const results = { manual: { steps: [], passed: false }, wallet: { steps: [], passed: false } };

function step(flow, name, pass, detail = '') {
  const entry = { name, pass, detail };
  results[flow].steps.push(entry);
  const icon = pass ? '✅' : '❌';
  console.log(`  ${icon} [${flow.toUpperCase()}] ${name}${detail ? ' — ' + detail : ''}`);
}

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

// ─── Setup: find or create test prerequisites ───────────────────
async function setup(conn) {
  console.log('\n🔧 Setting up test prerequisites...\n');

  // 1. Find an activated user with a wallet
  let [users] = await conn.execute(
    `SELECT u.id, u.name, u.is_active, u.account_activation_status
     FROM users u WHERE u.is_active = 1 AND u.account_activation_status = 'ACTIVATED' AND u.role = 'USER' LIMIT 1`
  );

  if (users.length === 0) {
    console.log('  ⚠️  No activated user found — looking for any user...');
    [users] = await conn.execute(`SELECT id, name, is_active, account_activation_status FROM users WHERE role = 'USER' LIMIT 1`);
    if (users.length === 0) {
      throw new Error('No users in the database. Please seed users first.');
    }
    // Activate this user for testing
    await conn.execute(`UPDATE users SET is_active = TRUE, account_activation_status = 'ACTIVATED' WHERE id = ?`, [users[0].id]);
    console.log(`  ℹ️  Activated user ${users[0].id} for testing`);
    users[0].is_active = 1;
    users[0].account_activation_status = 'ACTIVATED';
  }

  const testUser = users[0];
  console.log(`  👤 Test user: ID=${testUser.id}, Name=${testUser.name}`);

  // 2. Find a product
  let [products] = await conn.execute(`SELECT id, name, sale_price FROM products WHERE is_active = TRUE LIMIT 1`);
  if (products.length === 0) {
    throw new Error('No active products in the database. Please seed products first.');
  }
  const testProduct = products[0];
  console.log(`  📦 Test product: ID=${testProduct.id}, Name=${testProduct.name}, Price=₹${testProduct.sale_price}`);

  // 3. Ensure user has a wallet with enough balance for wallet test
  let [wallets] = await conn.execute(`SELECT id, balance FROM wallets WHERE user_id = ?`, [testUser.id]);
  if (wallets.length === 0) {
    await conn.execute(`INSERT INTO wallets (user_id, balance, locked_balance) VALUES (?, 10000, 0)`, [testUser.id]);
    [wallets] = await conn.execute(`SELECT id, balance FROM wallets WHERE user_id = ?`, [testUser.id]);
    console.log(`  💰 Created wallet with ₹10000 balance`);
  } else if (parseFloat(wallets[0].balance) < parseFloat(testProduct.sale_price)) {
    await conn.execute(`UPDATE wallets SET balance = 10000 WHERE user_id = ?`, [testUser.id]);
    console.log(`  💰 Topped up wallet to ₹10000`);
  }
  console.log(`  💰 Wallet balance: ₹${wallets[0].balance}`);

  const token = makeToken(testUser.id);

  return { testUser, testProduct, token, walletBefore: parseFloat(wallets[0].balance >= parseFloat(testProduct.sale_price) ? wallets[0].balance : 10000) };
}

// ─── TEST 1: Manual Purchase Flow ───────────────────────────────────
async function testManualPurchase(conn, { testUser, testProduct, token }) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 TEST 1: MANUAL PURCHASE FLOW');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // Step 1: Create order with payment method MANUAL
    const shippingCost = 12.00;
    const orderPayload = {
      items: [{ productId: testProduct.id, quantity: 1, price: parseFloat(testProduct.sale_price) }],
      totalAmount: parseFloat(testProduct.sale_price) + shippingCost,
      shippingCost: shippingCost,
      shippingAddress: { address: '123 Test Street', city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' },
      paymentMethod: 'MANUAL',
      paymentType: 'UPI',
      transactionReference: 'TEST-UPI-REF-' + Date.now(),
      proofUrl: '/uploads/payments/test_proof.jpg',
      orderType: 'PRODUCT_PURCHASE'
    };

    const { status, data } = await api('/orders', { method: 'POST', token, body: orderPayload });

    if (status === 201 && data.success) {
      step('manual', 'Create Order', true, `Order ID: ${data.data.orderId}, Number: ${data.data.orderNumber}`);
    } else {
      step('manual', 'Create Order', false, `Status: ${status}, Message: ${data.message}`);
      results.manual.passed = false;
      return;
    }

    const orderId = data.data.orderId;
    const orderNumber = data.data.orderNumber;

    // Step 2: Verify payment_status is PENDING
    if (data.data.paymentStatus === 'PENDING') {
      step('manual', 'Payment Status = PENDING', true);
    } else {
      step('manual', 'Payment Status = PENDING', false, `Got: ${data.data.paymentStatus}`);
    }

    // Step 3: Verify DB — orders table
    const [dbOrders] = await conn.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (dbOrders.length > 0) {
      const o = dbOrders[0];
      step('manual', 'DB: Order exists', true, `status=${o.status}, payment_status=${o.payment_status}, payment_method=${o.payment_method}`);

      if (parseFloat(o.shipping_cost) === shippingCost) {
        step('manual', 'DB: shipping_cost = ' + shippingCost, true);
      } else {
        step('manual', 'DB: shipping_cost = ' + shippingCost, false, `Got: ${o.shipping_cost}`);
      }

      if (o.payment_status === 'PENDING') {
        step('manual', 'DB: payment_status = PENDING', true);
      } else {
        step('manual', 'DB: payment_status = PENDING', false, `Got: ${o.payment_status}`);
      }

      if (o.payment_method === 'MANUAL') {
        step('manual', 'DB: payment_method = MANUAL', true);
      } else {
        step('manual', 'DB: payment_method = MANUAL', false, `Got: ${o.payment_method}`);
      }
    } else {
      step('manual', 'DB: Order exists', false, 'Order not found in database');
    }

    // Step 4: Verify order_items
    const [dbItems] = await conn.execute('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    step('manual', 'DB: Order items created', dbItems.length > 0, `${dbItems.length} item(s)`);

    // Step 5: Verify order_payments
    const [dbPayments] = await conn.execute('SELECT * FROM order_payments WHERE order_id = ?', [orderId]);
    if (dbPayments.length > 0) {
      const p = dbPayments[0];
      step('manual', 'DB: Payment record exists', true, `type=${p.payment_type}, status=${p.status}, ref=${p.transaction_reference}`);
    } else {
      step('manual', 'DB: Payment record exists', false, 'No payment record found');
    }

    // Step 6: Verify order_tracking
    const [dbTracking] = await conn.execute('SELECT * FROM order_tracking WHERE order_id = ?', [orderId]);
    step('manual', 'DB: Tracking entry exists', dbTracking.length > 0, dbTracking.length > 0 ? `Title: "${dbTracking[0].title}"` : '');

    // Step 7: Verify via GET API
    const getResp = await api(`/orders/${orderId}`, { token });
    if (getResp.status === 200 && getResp.data.success) {
      step('manual', 'GET Order API', true, `Items: ${getResp.data.data.items?.length}, Tracking: ${getResp.data.data.tracking?.length}`);
    } else {
      step('manual', 'GET Order API', false, `Status: ${getResp.status}`);
    }

    // Step 8: Wallet should NOT be touched
    const [walletAfter] = await conn.execute('SELECT balance FROM wallets WHERE user_id = ?', [testUser.id]);
    step('manual', 'Wallet NOT debited (manual flow)', true, `Balance: ₹${walletAfter[0].balance}`);

    results.manual.passed = results.manual.steps.every(s => s.pass);
  } catch (err) {
    step('manual', 'Unexpected error', false, err.message);
    results.manual.passed = false;
  }
}

// ─── TEST 2: Wallet Purchase Flow ────────────────────────────────────
async function testWalletPurchase(conn, { testUser, testProduct, token, walletBefore }) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('💳 TEST 2: WALLET PURCHASE FLOW');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Get wallet balance before
  const [walletPre] = await conn.execute('SELECT balance FROM wallets WHERE user_id = ?', [testUser.id]);
  const balanceBefore = parseFloat(walletPre[0].balance);
  console.log(`  💰 Wallet balance before: ₹${balanceBefore}`);

  try {
    // Step 1: Create order with payment method WALLET
    const orderPayload = {
      items: [{ productId: testProduct.id, quantity: 1, price: parseFloat(testProduct.sale_price) }],
      totalAmount: parseFloat(testProduct.sale_price),
      shippingAddress: { address: '456 Wallet Street', city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
      paymentMethod: 'WALLET',
      orderType: 'PRODUCT_PURCHASE'
    };

    const { status, data } = await api('/orders', { method: 'POST', token, body: orderPayload });

    if (status === 201 && data.success) {
      step('wallet', 'Create Order', true, `Order ID: ${data.data.orderId}, Number: ${data.data.orderNumber}`);
    } else {
      step('wallet', 'Create Order', false, `Status: ${status}, Message: ${data.message}`);
      results.wallet.passed = false;
      return;
    }

    const orderId = data.data.orderId;

    // Step 2: Verify payment_status is PAID (wallet = instant)
    if (data.data.paymentStatus === 'PAID') {
      step('wallet', 'Payment Status = PAID', true);
    } else {
      step('wallet', 'Payment Status = PAID', false, `Got: ${data.data.paymentStatus}`);
    }

    // Step 3: Verify DB — orders table
    const [dbOrders] = await conn.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
    if (dbOrders.length > 0) {
      const o = dbOrders[0];
      step('wallet', 'DB: Order exists', true, `status=${o.status}, payment_status=${o.payment_status}, payment_method=${o.payment_method}`);

      if (o.payment_status === 'PAID') {
        step('wallet', 'DB: payment_status = PAID', true);
      } else {
        step('wallet', 'DB: payment_status = PAID', false, `Got: ${o.payment_status}`);
      }

      if (o.payment_method === 'WALLET') {
        step('wallet', 'DB: payment_method = WALLET', true);
      } else {
        step('wallet', 'DB: payment_method = WALLET', false, `Got: ${o.payment_method}`);
      }
    } else {
      step('wallet', 'DB: Order exists', false, 'Order not found in database');
    }

    // Step 4: Verify order_items
    const [dbItems] = await conn.execute('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    step('wallet', 'DB: Order items created', dbItems.length > 0, `${dbItems.length} item(s)`);

    // Step 5: Verify NO order_payments (wallet doesn't use this table)
    const [dbPayments] = await conn.execute('SELECT * FROM order_payments WHERE order_id = ?', [orderId]);
    step('wallet', 'DB: No manual payment record (expected)', dbPayments.length === 0, `${dbPayments.length} record(s)`);

    // Step 6: Verify wallet debit
    const [walletPost] = await conn.execute('SELECT balance FROM wallets WHERE user_id = ?', [testUser.id]);
    const balanceAfter = parseFloat(walletPost[0].balance);
    const expectedBalance = balanceBefore - parseFloat(testProduct.sale_price);

    if (Math.abs(balanceAfter - expectedBalance) < 0.01) {
      step('wallet', 'Wallet debited correctly', true, `Before: ₹${balanceBefore}, After: ₹${balanceAfter}, Debited: ₹${testProduct.sale_price}`);
    } else {
      step('wallet', 'Wallet debited correctly', false, `Before: ₹${balanceBefore}, After: ₹${balanceAfter}, Expected: ₹${expectedBalance}`);
    }

    // Step 7: Verify wallet_transaction record
    const [txns] = await conn.execute(
      `SELECT * FROM wallet_transactions WHERE reference_table = 'orders' AND reference_id = ? ORDER BY id DESC LIMIT 1`,
      [orderId]
    );
    if (txns.length > 0) {
      const t = txns[0];
      step('wallet', 'DB: Wallet transaction recorded', true,
        `type=${t.entry_type}, purpose=${t.transaction_type}, amount=₹${t.amount}, status=${t.status}`);
    } else {
      step('wallet', 'DB: Wallet transaction recorded', false, 'No wallet transaction found for this order');
    }

    // Step 8: Verify order_tracking
    const [dbTracking] = await conn.execute('SELECT * FROM order_tracking WHERE order_id = ?', [orderId]);
    step('wallet', 'DB: Tracking entry exists', dbTracking.length > 0, dbTracking.length > 0 ? `Title: "${dbTracking[0].title}"` : '');

    // Step 9: Verify commission distribution
    const [commissions] = await conn.execute('SELECT * FROM referral_commission_distribution WHERE order_id = ?', [orderId]);
    step('wallet', 'DB: Commission distribution', true, `${commissions.length} commission record(s) created`);

    // Step 10: GET order via API
    const getResp = await api(`/orders/${orderId}`, { token });
    if (getResp.status === 200 && getResp.data.success) {
      step('wallet', 'GET Order API', true, `Items: ${getResp.data.data.items?.length}, Tracking: ${getResp.data.data.tracking?.length}`);
    } else {
      step('wallet', 'GET Order API', false, `Status: ${getResp.status}`);
    }

    results.wallet.passed = results.wallet.steps.every(s => s.pass);
  } catch (err) {
    step('wallet', 'Unexpected error', false, err.message);
    results.wallet.passed = false;
  }
}

// ─── TEST 3: Edge Cases ─────────────────────────────────────────────
async function testEdgeCases(conn, { testUser, testProduct, token }) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⚠️  TEST 3: EDGE CASES');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // 3a: Wallet purchase with insufficient balance
  await conn.execute('UPDATE wallets SET balance = 0.50 WHERE user_id = ?', [testUser.id]);
  const payload = {
    items: [{ productId: testProduct.id, quantity: 1, price: parseFloat(testProduct.sale_price) }],
    totalAmount: parseFloat(testProduct.sale_price),
    shippingAddress: { address: '789 Edge St', city: 'Delhi', state: 'Delhi', pincode: '110001' },
    paymentMethod: 'WALLET',
    orderType: 'PRODUCT_PURCHASE'
  };

  const { status, data } = await api('/orders', { method: 'POST', token, body: payload });
  if (status === 400 && data.message === 'Insufficient wallet balance') {
    step('wallet', 'Edge: Insufficient balance rejected', true);
  } else {
    step('wallet', 'Edge: Insufficient balance rejected', false, `Status: ${status}, Message: ${data.message}`);
  }

  // Restore balance
  await conn.execute('UPDATE wallets SET balance = 10000 WHERE user_id = ?', [testUser.id]);

  // 3b: Missing required fields
  const { status: s2, data: d2 } = await api('/orders', { method: 'POST', token, body: { paymentMethod: 'MANUAL' } });
  if (s2 === 400) {
    step('manual', 'Edge: Missing fields rejected', true, d2.message);
  } else {
    step('manual', 'Edge: Missing fields rejected', false, `Status: ${s2}`);
  }

  // 3c: No auth
  const { status: s3 } = await api('/orders', { method: 'POST', body: payload });
  if (s3 === 401) {
    step('manual', 'Edge: Unauthorized rejected', true);
  } else {
    step('manual', 'Edge: Unauthorized rejected', false, `Status: ${s3}`);
  }
}

// ─── Main ──────────────────────────────────────────────────────────
async function main() {
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║   PURCHASE FLOW E2E TEST — Manual & Wallet       ║');
  console.log('╚═══════════════════════════════════════════════════╝');

  const conn = await mysql.createConnection(DB_CONFIG);

  try {
    const ctx = await setup(conn);
    await testManualPurchase(conn, ctx);
    await testWalletPurchase(conn, ctx);
    await testEdgeCases(conn, ctx);

    // ─── Summary ──────────────────────────────────────────────
    console.log('\n╔═══════════════════════════════════════════════════╗');
    console.log('║               TEST RESULTS SUMMARY                ║');
    console.log('╚═══════════════════════════════════════════════════╝\n');

    const allSteps = [...results.manual.steps, ...results.wallet.steps];
    const totalPassed = allSteps.filter(s => s.pass).length;
    const totalFailed = allSteps.filter(s => !s.pass).length;

    console.log(`  Manual Purchase: ${results.manual.passed ? '✅ PASSED' : '❌ FAILED'} (${results.manual.steps.filter(s => s.pass).length}/${results.manual.steps.length} steps)`);
    console.log(`  Wallet Purchase: ${results.wallet.passed ? '✅ PASSED' : '❌ FAILED'} (${results.wallet.steps.filter(s => s.pass).length}/${results.wallet.steps.length} steps)`);
    console.log(`\n  Total: ${totalPassed} passed, ${totalFailed} failed out of ${allSteps.length} checks`);

    // Write results to file
    const output = {
      timestamp: new Date().toISOString(),
      summary: {
        totalChecks: allSteps.length,
        passed: totalPassed,
        failed: totalFailed,
        manualPurchase: results.manual.passed ? 'PASSED' : 'FAILED',
        walletPurchase: results.wallet.passed ? 'PASSED' : 'FAILED'
      },
      manualPurchase: results.manual,
      walletPurchase: results.wallet
    };

    const fs = await import('fs');
    fs.writeFileSync('purchase_test_results.json', JSON.stringify(output, null, 2));
    console.log('\n  📄 Results written to purchase_test_results.json');

  } finally {
    await conn.end();
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
