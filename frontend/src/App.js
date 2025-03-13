// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import Dashboard from './components/Dashboard';
import UserDashboard from './pages/UserDashboard';
import MinePage from './pages/Mine';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/u/dashboard" element={<UserDashboard />} />
        <Route path="/a/dashboard" element={<Dashboard />} />
        <Route path="/mine" element={<MinePage />} />
      </Routes>
    </Router>
  );
};

export default App;
