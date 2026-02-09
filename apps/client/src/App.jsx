import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Leaderboard from './components/Leaderboard'
import CommunicationCenter from './components/CommunicationCenter'

// Placeholder components for other routes
const Inventory = () => <div className="p-8 text-2xl font-bold">Inventory Page (Coming Soon)</div>
const Teams = () => <div className="p-8 text-2xl font-bold">Teams Page (Coming Soon)</div>

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/notifications" element={<CommunicationCenter />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
