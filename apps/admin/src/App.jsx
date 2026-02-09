import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import CommissionStructure from "./pages/CommissionStructure";
import Genealogy from "./pages/Genealogy";
import Payouts from "./pages/Payouts";
import Products from "./pages/Products";
import Users from "./pages/Users";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings/commission" element={<CommissionStructure />} />
        <Route path="/genealogy" element={<Genealogy />} />
        <Route path="/payouts" element={<Payouts />} />
        <Route path="/products" element={<Products />} />
        <Route path="/users" element={<Users />} />
        {/* Add more admin routes here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
