import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React, { useState } from "react";

import './App.css';
import Home from './pages/Home'
import Stores from './pages/Stores';
import Nav from './components/Nav';
import Login from './admin/Login';
import AdminPage from './admin/AdminPage';
import ProductStore from './pages/ProductStore';
import Footer from './components/Footer';
import SubmitStore from './pages/SubmitStore';
import Contact from './pages/Contact';
import TermsOfService from './pages/TermsOfService';
import Privacy from './pages/Privacy';
import Affiliate_Disclosure from './pages/Affiliate_Disclosure'

const AppContent: React.FC<{ token: string | null; setToken: (t: string) => void }> = ({ token, setToken }) => {
  const location = useLocation();
  const hideNav = location.pathname === "/admin-login" || location.pathname === "/admin-dashboard";

  return (
    
    <div data-prerender-ready="true">
      {!hideNav && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stores" element={<Stores />} />
        {/* Your current route for product pages */}
        <Route path="/store/:id/:slug" element={<ProductStore />} />
        <Route path="/submit-store" element={<SubmitStore />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/affiliate-disclosure" element={<Affiliate_Disclosure />} />

        {/* Catch-all route for 404 - keep this as it's good practice */}
        <Route path="*" element={<h2>Page Not Found</h2>} />

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
      {!hideNav && <Footer />}
    </div>
    // --- END CRITICAL FIX ---
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