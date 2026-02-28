import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import React, { Suspense, lazy } from "react";
const PopupNotices = lazy(() => import("./pages/PopupNotices"));
import CommissionStructure from "./pages/CommissionStructure";
import Genealogy from "./pages/Genealogy";
import Payouts from "./pages/Payouts";
import Products from "./pages/Products";
import Announcements from "./pages/Announcements";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import WalletTransactions from "./pages/transactions/index.jsx";
import Recharges from "./pages/recharges/index.jsx";
import Withdrawals from "./pages/withdrawals/index.jsx";
import KYCVerification from "./pages/KYCVerification";
import KYCDetails from "./pages/KYCDetails";
import Login from "./pages/Login";
import Tickets from "./pages/Tickets";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

import UserNotifications from "./pages/UserNotifications";
import Notifications from "./pages/Notifications";
import Categories from "./pages/Categories";
import ReferralLink from "./pages/ReferralLink";
import OrderTracking from "./pages/OrderTracking";
import OrderPayments from "./pages/order-payments/index.jsx";

import Layout from "./components/Layout";


import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <Routes>
          <Route path="/admin/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/popup-notices" element={
              <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold animate-pulse">Loading Popup Notices...</div>}>
                <PopupNotices />
              </Suspense>
            } />
            <Route path="/settings/commission" element={<CommissionStructure />} />
            <Route path="/genealogy" element={<Genealogy />} />
            <Route path="/genealogy/:userId" element={<Genealogy />} />
            <Route path="/payouts" element={<Payouts />} />
            <Route path="/transactions" element={<WalletTransactions />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/recharges" element={<Recharges />} />
            <Route path="/withdrawals" element={<Withdrawals />} />


            <Route path="/users" element={<Users />} />
            <Route path="/users/:userId" element={<UserDetails />} />
            <Route path="/users/:userId/referral" element={<ReferralLink />} />

            <Route path="/kyc" element={<KYCVerification />} />
            <Route path="/kyc/:userId" element={<KYCDetails />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/order-payment" element={<OrderPayments />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/user-notifications/send/:userId" element={<UserNotifications />} />
            <Route path="/user-notifications/:userId?" element={<UserNotifications />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
