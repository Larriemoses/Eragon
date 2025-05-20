import React from "react";
import { Link } from "react-router-dom";

const LOGO_URL = "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1747609358/image-removebg-preview_soybkt.png"; // Use your Cloudinary logo

const Footer: React.FC = () => (
  <footer className="bg-[#232323] text-white pt-10 pb-4 mt-10">
    <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-center items-center md:items-start gap-10">
      {/* About Us */}
      <div className="flex-1 flex flex-col items-center md:items-start mb-6 md:mb-0">
        <h3 className="font-bold mb-2 text-lg">ABOUT US</h3>
        <Link to="/contact" className="mb-1 text-gray-300 hover:text-green-400 transition">Contact Us</Link>
        <Link to="/terms-of-service" className="mb-1 text-gray-300 hover:text-green-400 transition">Terms of Use</Link>
        <Link to="/privacy" className="mb-1 text-gray-300 hover:text-green-400 transition">Privacy Policy</Link>
      </div>
      {/* Logo */}
      <div className="flex flex-col items-center justify-center mb-6 md:mb-0">
        <img src={LOGO_URL} alt="Discount Region" className="h-14 mb-2" />
      </div>
      {/* Connect */}
      <div className="flex-1 flex flex-col items-center md:items-start">
        <h3 className="font-bold mb-2 text-lg">CONNECT</h3>
        <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="mb-1 text-gray-300 hover:text-green-400 transition">Whatsapp</a>
        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="mb-1 text-gray-300 hover:text-green-400 transition">Twitter</a>
        <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="mb-1 text-gray-300 hover:text-green-400 transition">Facebook</a>
        <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="mb-1 text-gray-300 hover:text-green-400 transition">Instagram</a>
        <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="mb-1 text-gray-300 hover:text-green-400 transition">Linkedin</a>
      </div>
    </div>
    <div className="max-w-3xl mx-auto mt-6 border-t border-gray-600"></div>
    <div className="text-center text-gray-400 text-sm mt-2">
      Copyright © 2025 – 2035 • All rights reserved
    </div>
  </footer>
);

export default Footer;