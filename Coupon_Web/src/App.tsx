import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import React, { useState } from "react";
import { usePageHead } from './utils/headManager';
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
    <>
      {!hideNav && <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stores" element={<Stores />} />
         <Route path="/store/:id/:slug" element={<ProductStore />} />
        <Route path="/submit-store" element={<SubmitStore />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/affiliate-disclosure" element={<Affiliate_Disclosure />} /> 
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
    </>
  );
};

function App() {
  // Initialize token from localStorage
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("adminToken"));

   usePageHead({
      title: "Discount Region - Top Coupon Codes, Verified Deals & Promo Codes",
      description: "Your go-to source for verified discounts and promo codes from top brands like Oraimo, Shopinverse, 1xBet, and leading prop firms. Begin your discount journey and save more every time!",
      ogImage: "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1747609358/image-removebg-preview_soybkt.png", // Use your main logo or a compelling social share image
      ogUrl: "https://eragon-ten.vercel.app/", // IMPORTANT: Replace with your actual domain
      canonicalUrl: "https://eragon-ten.vercel.app/", // IMPORTANT: Replace with your actual domain
    });

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