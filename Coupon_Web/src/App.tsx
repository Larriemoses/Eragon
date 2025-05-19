import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React, { useState } from "react";
import './App.css';
import Home from './pages/Home'
import Stores from './pages/Stores';
import Nav from './components/Nav';
import Login from './admin/Login';
import AdminPage from './admin/AdminPage';
import ProductStore from './pages/ProductStore';

const AppContent: React.FC<{ token: string | null; setToken: (t: string) => void }> = ({ token, setToken }) => {
  const location = useLocation();
  const hideNav = location.pathname === "/admin-login" || location.pathname === "/admin-dashboard";

  return (
    <>
      {!hideNav && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/store/:id" element={<ProductStore />} /> {/* <-- Fix here */}
        <Route
          path="/admin-login"
          element={<Login onLogin={setToken} />}
        />
        <Route
          path="/admin-dashboard"
          element={
            token ? <AdminPage token={token} /> : <Navigate to="/admin-login" />
          }
        />
      </Routes>
    </>
  );
};

function App() {
  // Initialize token from localStorage
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("adminToken"));

  // Update localStorage whenever token changes
  React.useEffect(() => {
    if (token) {
      localStorage.setItem("adminToken", token);
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [token]);

  return (
    <Router>
      <AppContent token={token} setToken={setToken} />
    </Router>
  );
}

export default App;