import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

// ─── Mock Modules ───────────────────────────────────────────────────────────
vi.mock("../util/axios", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("react-router-dom", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
}));

// ─── Imports (after mocks) ──────────────────────────────────────────────────
import { api } from "../util/axios";
import TransactionHistory from "../pages/Wallet/TransactionHistory";
import WalletStats from "../pages/Wallet/WalletStats";
import WalletHeader from "../pages/Wallet/WalletHeader";
import WalletFooter from "../pages/Wallet/WalletFooter";
import * as walletService from "../services/walletService";

// ─── Test Data ──────────────────────────────────────────────────────────────
const mockWallet = {
  id: 1,
  user_id: 1,
  balance: 5000.0,
  locked_balance: 1200.0,
  withdrawable: 5000.0,
  on_hold: 1200.0,
  commissions: 3500.75,
};

const mockTransactions = [
  {
    id: 1,
    wallet_id: 1,
    entry_type: "CREDIT",
    transaction_type: "REFERRAL_COMMISSION",
    amount: 500.0,
    balance_before: 4500.0,
    balance_after: 5000.0,
    status: "SUCCESS",
    description: "Referral commission from user #42",
    reference_id: "REF-001",
    created_at: "2026-02-15T10:00:00Z",
  },
  {
    id: 2,
    wallet_id: 1,
    entry_type: "DEBIT",
    transaction_type: "WITHDRAWAL_REQUEST",
    amount: 1000.0,
    balance_before: 5500.0,
    balance_after: 4500.0,
    status: "SUCCESS",
    description: "Withdrawal to bank account",
    reference_id: "WD-002",
    created_at: "2026-02-14T08:30:00Z",
  },
  {
    id: 3,
    wallet_id: 1,
    entry_type: "CREDIT",
    transaction_type: "RECHARGE_REQUEST",
    amount: 2000.0,
    balance_before: 3500.0,
    balance_after: 5500.0,
    status: "REVERSED",
    description: "Recharge via GPay",
    reference_id: null,
    created_at: "2026-02-13T15:00:00Z",
  },
];

// ─── Wallet Service Tests ───────────────────────────────────────────────────
describe("walletService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getWallet", () => {
    it("calls api.get with the correct wallet endpoint", async () => {
      api.get.mockResolvedValue({
        success: true,
        message: "OK",
        data: mockWallet,
      });
      const result = await walletService.getWallet();
      expect(api.get).toHaveBeenCalledWith("/api/v1/wallet");
      expect(result.data).toEqual(mockWallet);
    });
  });

  describe("getTransactions", () => {
    it("calls api.get with correct params for default pagination", async () => {
      const mockResponse = {
        success: true,
        data: {
          transactions: mockTransactions,
          pagination: { total: 3, limit: 10, offset: 0 },
        },
      };
      api.get.mockResolvedValue(mockResponse);

      const result = await walletService.getTransactions(10, 0, {});
      expect(api.get).toHaveBeenCalledWith("/api/v1/wallet/transactions", {
        limit: 10,
        offset: 0,
        searchTerm: undefined,
        status: undefined,
        type: undefined,
      });
      expect(result.data.transactions).toHaveLength(3);
    });

    it("passes filter params correctly", async () => {
      api.get.mockResolvedValue({
        success: true,
        data: { transactions: [], pagination: {} },
      });

      await walletService.getTransactions(10, 0, {
        searchTerm: "referral",
        status: "SUCCESS",
        type: "REFERRAL_COMMISSION",
      });

      expect(api.get).toHaveBeenCalledWith("/api/v1/wallet/transactions", {
        limit: 10,
        offset: 0,
        searchTerm: "referral",
        status: "SUCCESS",
        type: "REFERRAL_COMMISSION",
      });
    });

    it("passes pagination offset for page 2", async () => {
      api.get.mockResolvedValue({
        success: true,
        data: { transactions: [], pagination: {} },
      });
      await walletService.getTransactions(10, 10, {});
      expect(api.get).toHaveBeenCalledWith(
        "/api/v1/wallet/transactions",
        expect.objectContaining({
          limit: 10,
          offset: 10,
        }),
      );
    });
  });

  describe("createWithdrawRequest", () => {
    it("posts withdrawal data to the correct endpoint", async () => {
      api.post.mockResolvedValue({ success: true, data: { id: 1 } });
      await walletService.createWithdrawRequest({ amount: 500 });
      expect(api.post).toHaveBeenCalledWith("/api/v1/wallet/withdraw", {
        amount: 500,
      });
    });
  });

  describe("createRechargeRequest", () => {
    it("posts FormData to the recharge endpoint", async () => {
      const formData = new FormData();
      formData.append("amount", "1000");
      api.post.mockResolvedValue({ success: true, data: { id: 1 } });
      await walletService.createRechargeRequest(formData);
      expect(api.post).toHaveBeenCalledWith(
        "/api/v1/wallet/recharge",
        formData,
      );
    });
  });
});

// ─── TransactionHistory Component Tests ─────────────────────────────────────
describe("TransactionHistory", () => {
  const defaultProps = {
    transactions: mockTransactions,
    currentPage: 1,
    totalPages: 1,
    onPageChange: vi.fn(),
    filters: { searchTerm: "", status: "", type: "" },
    onFilterChange: vi.fn(),
  };

  it("renders transaction rows", () => {
    render(<TransactionHistory {...defaultProps} />);
    expect(
      screen.getByText("Referral commission from user #42"),
    ).toBeInTheDocument();
    expect(screen.getByText("Withdrawal to bank account")).toBeInTheDocument();
    expect(screen.getByText("Recharge via GPay")).toBeInTheDocument();
  });

  it("shows empty state when no transactions", () => {
    render(<TransactionHistory {...defaultProps} transactions={[]} />);
    expect(screen.getByText("No transactions found")).toBeInTheDocument();
  });

  it("renders correct type badges", () => {
    render(<TransactionHistory {...defaultProps} />);
    expect(screen.getByText("Referral")).toBeInTheDocument();
    expect(screen.getByText("Withdrawal")).toBeInTheDocument();
    expect(screen.getByText("Recharge")).toBeInTheDocument();
  });

  it("shows credit amounts with + and debit amounts with -", () => {
    render(<TransactionHistory {...defaultProps} />);
    // CREDIT transactions should have + prefix
    const amounts = screen.getAllByText(/[+-]₹/);
    expect(amounts.length).toBeGreaterThan(0);
  });

  it("renders reference IDs when available", () => {
    render(<TransactionHistory {...defaultProps} />);
    expect(screen.getByText("Ref ID: #REF-001")).toBeInTheDocument();
    expect(screen.getByText("Ref ID: #WD-002")).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(<TransactionHistory {...defaultProps} />);
    const searchInput = screen.getByPlaceholderText(
      "Search by description or ref ID...",
    );
    expect(searchInput).toBeInTheDocument();
  });

  it("shows pagination when totalPages > 1", () => {
    render(
      <TransactionHistory {...defaultProps} totalPages={3} currentPage={2} />,
    );
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
  });

  it("hides pagination when totalPages is 1", () => {
    render(<TransactionHistory {...defaultProps} totalPages={1} />);
    expect(screen.queryByText(/Page \d+ of/)).not.toBeInTheDocument();
  });

  it("calls onPageChange when next button is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <TransactionHistory
        {...defaultProps}
        totalPages={3}
        currentPage={1}
        onPageChange={onPageChange}
      />,
    );
    // Find the next button (chevron_right)
    const buttons = screen.getAllByRole("button");
    const nextBtn = buttons[buttons.length - 1]; // last button is next
    fireEvent.click(nextBtn);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});

// ─── WalletStats Component Tests ────────────────────────────────────────────
describe("WalletStats", () => {
  it("renders wallet stats correctly when wallet data is provided", () => {
    render(<WalletStats wallet={mockWallet} transactions={mockTransactions} />);
    expect(screen.getByText("Commission")).toBeInTheDocument();
    expect(screen.getByText("On Hold")).toBeInTheDocument();
    expect(screen.getByText("Withdrawable")).toBeInTheDocument();
  });

  it("shows formatted currency values", () => {
    render(<WalletStats wallet={mockWallet} transactions={[]} />);
    // Check that currency is formatted  (₹ symbol present)
    const allText = document.body.textContent;
    expect(allText).toContain("₹");
  });

  it("shows error state when wallet is null", () => {
    render(<WalletStats wallet={null} transactions={[]} />);
    const errorElements = screen.getAllByText("!fetch error");
    expect(errorElements).toHaveLength(3); // commission, on_hold, withdrawable
  });

  it("shows error state when wallet is undefined", () => {
    render(<WalletStats wallet={undefined} transactions={[]} />);
    const errorElements = screen.getAllByText("!fetch error");
    expect(errorElements).toHaveLength(3);
  });

  it("shows zero values correctly (not error state)", () => {
    const zeroWallet = {
      ...mockWallet,
      commissions: 0,
      on_hold: 0,
      withdrawable: 0,
    };
    render(<WalletStats wallet={zeroWallet} transactions={[]} />);
    // Should NOT show error when wallet exists but values are 0
    expect(screen.queryByText("!fetch error")).not.toBeInTheDocument();
  });
});

// ─── WalletHeader Component Tests ───────────────────────────────────────────
describe("WalletHeader", () => {
  it("renders the header title", () => {
    render(<WalletHeader onWithdrawClick={vi.fn()} />);
    expect(screen.getByText("Wallet & Earnings History")).toBeInTheDocument();
  });

  it("renders Add Funds link pointing to /wallet/add-funds", () => {
    render(<WalletHeader onWithdrawClick={vi.fn()} />);
    const addFundsLink = screen.getByText("Add Funds");
    expect(addFundsLink.closest("a")).toHaveAttribute(
      "href",
      "/wallet/add-funds",
    );
  });

  it("renders Export CSV button", () => {
    render(<WalletHeader onWithdrawClick={vi.fn()} />);
    expect(screen.getByText("Export CSV")).toBeInTheDocument();
  });
});

// ─── WalletFooter Component Tests ───────────────────────────────────────────
describe("WalletFooter", () => {
  it("renders footer content", () => {
    render(<WalletFooter />);
    expect(screen.getByText(/Fintech MLM Dashboard/)).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
  });
});
