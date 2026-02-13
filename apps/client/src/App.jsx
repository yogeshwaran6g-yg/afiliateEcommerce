import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";

import ClientLayout from "./components/ClientLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./components/Leaderboard";
import CommunicationCenter from "./components/CommunicationCenter";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import Products from "./pages/Products";
import Ranks from "./pages/ranks/index";
import Network from "./pages/network/index";
import Cart from "./pages/Cart";
import Support from "./pages/support/index";
import Profile from "./pages/profile/index";
import Wallet from "./pages/Wallet";
import CompleteRegistration from "./pages/CompleteRegistration";
import Withdrawals from "./pages/withdrawals/index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Otp from "./pages/Otp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Temporary placeholder pages
const Inventory = () => (
  <div className="p-8 text-2xl font-bold">Inventory Page (Coming Soon)</div>
);

const Teams = () => (
  <div className="p-8 text-2xl font-bold">Teams Page (Coming Soon)</div>
);

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ProductProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                {/* redirect root */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* routes with ClientLayout */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/complete-registration" element={<CompleteRegistration />} />
                  <Route element={<ClientLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/ranks" element={<Ranks />} />
                    <Route path="/network" element={<Network />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/withdrawals" element={<Withdrawals />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/teams" element={<Teams />} />
                    <Route path="/notifications" element={<CommunicationCenter />} />
                  </Route>
                </Route>

                {/* auth routes without layout */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-otp" element={<Otp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </ProductProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;

