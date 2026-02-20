import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProfileProvider } from "./context/ProfileContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";

import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ClientLayout from "./components/ClientLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./components/Leaderboard";
import CommunicationCenter from "./components/CommunicationCenter/index.jsx";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import Products from "./pages/Products";
import Ranks from "./pages/ranks/index";
import Network from "./pages/network/index";
import DirectReferrals from "./pages/network/DirectReferrals";
import NetworkTree from "./pages/network/NetworkTree";
import Cart from "./pages/Cart";
import Support from "./pages/support/index";
import Profile from "./pages/profile/index";
import Settings from "./pages/settings/index";
import Wallet from "./pages/Wallet";
import CompleteRegistration from "./pages/CompleteRegistration";
import Withdrawals from "./pages/withdrawals/index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Otp from "./pages/Otp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <ProductProvider>
          <CartProvider>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={true}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              transition={Bounce}
            />
            <BrowserRouter>
              <Routes>
                {/* redirect root */}
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />

                {/* routes with ClientLayout */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<ClientLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/ranks" element={<Ranks />} />
                    <Route path="/network/my-team" element={<Network />} />
                    <Route
                      path="/network/direct-referrals"
                      element={<DirectReferrals />}
                    />
                    <Route path="/network/tree" element={<NetworkTree />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route
                      path="/wallet/add-funds"
                      element={<Wallet.AddFunds />}
                    />
                    <Route path="/withdrawals" element={<Withdrawals />} />
                    <Route
                      path="/notifications"
                      element={<CommunicationCenter />}
                    />
                  </Route>
                </Route>

                {/* auth routes without layout */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/complete-registration"
                  element={<CompleteRegistration />}
                />
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
