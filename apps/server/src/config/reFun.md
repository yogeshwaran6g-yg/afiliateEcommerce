# Referral System – Required Functions (6-Level, Ecommerce)

This document lists **all required functions (operations)** needed to implement a **6-level referral system** for an ecommerce platform using **MySQL + MERN**.

The system is **ledger-based**, **refund-safe**, and **scalable**.

---

## 1. Referral Commission Configuration (ADMIN)

Manage commission percentages per referral level.

```ts
getReferralCommissionConfig()
createReferralCommissionConfig()
updateReferralCommissionConfig(level)
toggleReferralCommission(level, isActive)
```

**Purpose**

* Control commission % for levels 1–6
* No code changes required when business rules change

---

## 2. User Referral Setup

Handle referral identity and relationships during signup.

```ts
generateReferralCode(userId)
validateReferralCode(code)
attachReferralOnSignup(userId, referralCode)
buildReferralTree(userId, referrerId)
```

**Notes**

* Referral tree is built **once**
* Max depth enforced: **6 levels**
* No recursion at runtime

---

## 3. Referral Tree Operations

Work with the `referral_tree` table.

```ts
insertReferralTree(uplineId, downlineId, level)
getReferralTreeByDownline(downlineId)
getReferralTreeByUpline(uplineId)
hasReferralLink(uplineId, downlineId)
```

**Purpose**

* Prevent duplicate ancestor paths
* Fast upline/downline queries
* Support analytics & commission logic

---

## 4. Order → Referral Commission Creation

Triggered after **payment success**.

```ts
calculateReferralCommission(orderId)
createReferralCommissionEntries(orderId)
```

### Internal Helper Functions

```ts
getEligibleUplines(downlineId)
getCommissionPercent(level)
calculateCommissionAmount(orderAmount, percent)
```

**Result**

* Creates commission ledger entries with `PENDING` status

---

## 5. Payment Event Hooks

Connected to payment gateway (Cashfree / Stripe / Razorpay).

```ts
onPaymentSuccess(orderId, paymentId)
onPaymentFailed(orderId)
onPaymentRefunded(orderId)
```

**Behavior**

* Success → create referral commissions
* Refund → reverse commissions
* Failure → no commission

---

## 6. Commission Lifecycle Management

Control commission state transitions.

```ts
approveReferralCommission(orderId)
reverseReferralCommission(orderId)
```

**Rules**

* `APPROVED` → after order delivered
* `REVERSED` → refund / cancel / dispute

---

## 7. Wallet & Earnings (Derived from Ledger)

No direct balance column. Values are **derived**.

```ts
getUserReferralEarnings(userId)
getUserPendingReferralEarnings(userId)
getUserReferralStatement(userId, filters)
```

**Derived From**

* `referral_commissions` table
* Status-based aggregation

---

## 8. Referral Analytics & Reports

Used for dashboards (User & Admin).

```ts
getReferralStats(userId)
getReferralLevelStats(userId)
getTopReferrers(limit)
```

**Examples**

* Total team size
* Earnings per level
* Top earners leaderboard

---

## 9. Admin Controls

Manual overrides and audits.

```ts
listAllReferralCommissions(filters)
forceApproveCommission(id)
forceReverseCommission(id)
```

**Use Cases**

* Manual dispute resolution
* Fraud correction
* Accounting audits

---

## 10. Validation & Abuse Prevention

Critical for security and trust.

```ts
preventSelfReferral(userId, referralCode)
preventReferralLoop(userId, referrerId)
validateReferralDepth(referrerId)
```

**Prevents**

* Self-referral
* Circular chains
* Exceeding 6 levels

---

## 11. Sync & Recovery (Optional / Pro)

Used for fixing corrupted data or migrations.

```ts
rebuildReferralTree(userId)
recalculateReferralCommissions(orderId)
```

---

## MVP – Minimum Required Functions

For a **working MVP**, only these are mandatory:

```ts
attachReferralOnSignup()
buildReferralTree()
getReferralCommissionConfig()
createReferralCommissionEntries()
approveReferralCommission()
getUserReferralEarnings()

## Key Design Rules

* ❌ No recursive queries per order
* ❌ No direct wallet balance updates
* ✅ Ledger-based commissions
* ✅ Event-driven lifecycle
* ✅ Refund-safe by design
