import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import CommissionStructure from "./pages/CommissionStructure";
import Genealogy from "./pages/Genealogy";
import Payouts from "./pages/Payouts";
import Products from "./pages/Products";
import Announcements from "./pages/Announcements";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import Transactions from "./pages/Transactions";
import Recharges from "./pages/Recharges";
import Withdrawals from "./pages/Withdrawals";
import KYCVerification from "./pages/KYCVerification";
import KYCDetails from "./pages/KYCDetails";
import Login from "./pages/Login";
import Tickets from "./pages/Tickets";

import Layout from "./components/Layout";


import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings/commission" element={<CommissionStructure />} />
            <Route path="/genealogy" element={<Genealogy />} />
            <Route path="/payouts" element={<Payouts />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/products" element={<Products />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/recharges" element={<Recharges />} />
            <Route path="/withdrawals" element={<Withdrawals />} />

            <Route path="/users" element={<Users />} />
            <Route path="/users/:userId" element={<UserDetails />} />

            <Route path="/kyc" element={<KYCVerification />} />
            <Route path="/kyc/:userId" element={<KYCDetails />} />
            <Route path="/tickets" element={<Tickets />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
