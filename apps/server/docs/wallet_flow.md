# Wallet & Withdrawal Flow Documentation

This document explains the technical flow of the wallet system, specifically focusing on how withdrawal requests affect balances and how the "locked balance" mechanism works.

## Overview
The wallet system uses a dual-balance approach to handle pending transactions safely:
1.  **Balance**: The total amount currently available to the user.
2.  **Locked Balance**: Amount held for pending requests (like withdrawals).

---

## 1. Withdrawal Request Process
When a user initiates a withdrawal request, the following steps occur:

### Steps:
1.  **Validation**:
    *   System ensures the user has fewer than 2 pending withdrawal requests.
    *   Verifies that bank details (account name, number, IFSC, bank name) are completed in the user's profile.
    *   Validates that the withdrawal amount is within the allowed limits (e.g., max ₹50,000).
2.  **Fee Calculation**:
    *   A platform fee (commission) is calculated based on system settings (default: 5%).
    *   `net_amount` = `total_amount` - `platform_fee`.
3.  **Database Entry**:
    *   A record is inserted into `withdrawal_requests` with status `REVIEW_PENDING`.
4.  **Balance Locking (Immediate)**:
    *   The `holdBalance` function is called.
    *   **Wallet Table Update**:
        *   `balance` is **decreased** by the full withdrawal amount.
        *   `locked_balance` is **increased** by the full withdrawal amount.
    *   **Transaction Record**:
        *   A record is added to `wallet_transactions` with status `PENDING` and type `WITHDRAWAL_REQUEST`.

> [!IMPORTANT]
> At this stage, the user's "Available Balance" is already reduced, preventing them from spending the same money twice.

---

## 2. Admin Approval Flow
Once an admin reviews and approves the request:

### Steps:
1.  **Release Locked Balance**:
    *   The `releaseHeldBalance` function is called.
    *   **Wallet Table Update**:
        *   `locked_balance` is **decreased** by the withdrawal amount.
        *   *Note: The main `balance` remains unchanged here because it was already deducted when the request was created.*
2.  **Status Updates**:
    *   `withdrawal_requests` status changes to `APPROVED`.
    *   `wallet_transactions` status changes to `SUCCESS`.
3.  **Notification**: (If implemented) The user receives a notification about the approval.

---

## 3. Admin Rejection Flow
If an admin rejects the request:

### Steps:
1.  **Rollback Balance**:
    *   The `rollbackHeldBalance` function is called.
    *   **Wallet Table Update**:
        *   `balance` is **increased** by the withdrawal amount (returning the money to the user).
        *   `locked_balance` is **decreased** by the withdrawal amount.
2.  **Status Updates**:
    *   `withdrawal_requests` status changes to `REJECTED`.
    *   `wallet_transactions` status changes to `FAILED`.

---

## Summary Table of State Changes

| Action | `balance` | `locked_balance` | Request Status | Transaction Status |
| :--- | :--- | :--- | :--- | :--- |
| **Request Created** | Decreased (-X) | Increased (+X) | `REVIEW_PENDING` | `PENDING` |
| **Admin Approved** | No Change | Decreased (-X) | `APPROVED` | `SUCCESS` |
| **Admin Rejected** | Increased (+X) | Decreased (-X) | `REJECTED` | `FAILED` |

---

## Technical Reference (Files Involved)
- **Services**: `apps/server/src/services/withdrawalService.js`, `apps/server/src/services/walletService.js`
- **Controller**: `apps/server/src/controllers/withdrawalController.js`
- **Tables**: `wallets`, `wallet_transactions`, `withdrawal_requests`
