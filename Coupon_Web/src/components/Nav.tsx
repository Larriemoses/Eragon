import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation

// Constants for API and logo
const BACKEND_URL = "https://eragon-backend1.onrender.com"; // Define backend URL
const LOGO_URL = "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1747609358/image-removebg-preview_soybkt.png"; // Your Cloudinary logo link

// Helper function to get full logo URL (unified logic for all components)
// (Note: This function is not directly used in Nav.tsx but kept for consistency if copied from other files)
const getFullLogoUrl = (logoPath?: string | null) => {
  if (logoPath) {
    if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
      return logoPath;
    }
    if (logoPath.startsWith('/')) {
        return `${BACKEND_URL}${logoPath}`;
    }
    return `${BACKEND_URL}/${logoPath}`;
  }
  return undefined;
};


const Nav: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]); // Simplified type as Product/Coupon interfaces are no longer directly used in Nav's logic
  const [dropdown, setDropdown] = useState(false); // For "Stores" dropdown
  const [mobileMenu, setMobileMenu] = useState(false); // For mobile hamburger menu

  const navigate = useNavigate();
  const location = useLocation(); // To check current path

  // Fetch all products for the "Stores" dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRes = await fetch(`${BACKEND_URL}/api/products/`);
        if (!productsRes.ok) {
          throw new Error(`HTTP error! status: ${productsRes.status} for products`);
        }
        const productsData = await productsRes.json();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products for Nav:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle smooth scroll for "Today Deals"
  useEffect(() => {
    if (location.hash === '#top-deals') {
      const element = document.getElementById('top-deals');
      if (element) {
        // Use setTimeout to ensure the element is rendered and the page is ready
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100); // Small delay
      }
    }
  }, [location]); // Re-run when location changes

  const handleTodayDealsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent default link behavior
    if (location.pathname === '/') {
      // If already on homepage, just scroll
      const element = document.getElementById('top-deals');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // If not on homepage, navigate first, then scroll will be handled by useEffect
      navigate('/#top-deals');
    }
    setMobileMenu(false); // Close mobile menu if open
  };

  const visibleProducts = products.slice(0, 5); // Adjust the number of visible products as needed
  const hasMoreProducts = products.length > 5;

  return (
    <header className="w-full bg-white shadow-sm mb-5">
      <nav className="w-[90%] container mx-auto flex items-center justify-between py-3 px-4 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={LOGO_URL} alt="Discount Region" className="h-10 w-auto" />
        </Link>

        {/* Removed Desktop Search Bar */}
        {/* Removed Mobile Search Bar */}

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-6 font-normal text-black">
          <li className=" hover:text-gray-700">
            <Link to="/" className="hover:text-gray-700 cursor-pointer">
              Home
            </Link>
          </li>
          <li>
            {/* Modified: Link to Top Deals section on homepage with smooth scroll */}
            <a
              href="/#top-deals" // Use href for semantic anchor link, handle with onClick
              onClick={handleTodayDealsClick}
              className="hover:text-gray-700 cursor-pointer"
            >
              Today Deals
            </a>
          </li>
          <li
            className="relative"
            onMouseEnter={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
            onClick={() => setDropdown(!dropdown)}
          >
            <button className="flex items-center gap-1 cursor-pointer hover:text-gray-700">
              Stores
              <svg
                className={`w-4 h-4 transform transition-transform duration-200 ${dropdown ? 'rotate-180' : 'rotate-0'}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
            {/* Stores Dropdown */}
            {dropdown && (
              <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg z-20">
                <ul className="flex flex-col py-2">
                  {visibleProducts.map((product: any) => ( // Use any for simplicity here
                    <li key={product.id} className="w-full">
                      <Link
                        to={`/store/${product.id}`}
                        className="block px-4 py-2 text-black hover:bg-gray-100 transition-colors duration-150 text-sm"
                        onClick={() => setDropdown(false)}
                      >
                        {product.name}
                      </Link>
                    </li>
                  ))}
                  {hasMoreProducts && (
                    <li className="w-full">
                      <Link
                        to="/stores"
                        className="block px-4 py-2 text-green-500 font-medium hover:underline transition-colors duration-150 text-base"
                        onClick={() => setDropdown(false)}
                      >
                        See More Stores
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </li>
          <li>
            <Link
              to="/submit-store"
              className="block text-center text-base py-3 cursor-pointer hover:text-gray-700"
            >
              Submit a Store
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="block text-center text-base py-3 cursor-pointer hover:text-gray-700"
            >
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          <svg
            className="w-7 h-7 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>

        {/* Mobile Menu Overlay */}
        {mobileMenu && (
          <div className="fixed inset-0 bg-white z-30 flex flex-col md:hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenu(false)}>
                <img src={LOGO_URL} alt="Discount Region" className="h-10 w-auto" />
              </Link>
              <button
                className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setMobileMenu(false)}
              >
                <svg
                  className="w-7 h-7 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>
            {/* Removed Mobile Search Bar inside menu */}

            <ul className="flex flex-col gap-2 p-4 font-medium overflow-y-auto flex-grow">
              <li>
                <Link
                  to="/"
                  onClick={() => setMobileMenu(false)}
                  className="block text-center text-lg py-3 cursor-pointer hover:bg-gray-100 rounded-md transition-colors duration-150"
                >
                  Home
                </Link>
              </li>
              <li>
                {/* Modified: Link to Top Deals section on homepage with smooth scroll */}
                <a
                  href="/#top-deals"
                  onClick={handleTodayDealsClick}
                  className="block text-center text-lg py-3 cursor-pointer hover:bg-gray-100 rounded-md transition-colors duration-150"
                >
                  Today Deals
                </a>
              </li>
              <li>
                {/* Using details/summary for mobile dropdown */}
                <details className="w-full">
                  <summary className="cursor-pointer text-center text-lg py-3 hover:bg-gray-100 rounded-md transition-colors duration-150">
                    Stores
                  </summary>
                  <ul className="flex flex-col items-center py-2 bg-gray-50 rounded-md mt-1">
                    {visibleProducts.map((product: any) => ( // Use any for simplicity
                      <li key={product.id} className="w-full">
                        <Link
                          to={`/store/${product.id}`}
                          className="block text-center text-base py-2 px-4 cursor-pointer hover:bg-gray-100 rounded-md transition-colors duration-150"
                          onClick={() => setMobileMenu(false)}
                        >
                          {product.name}
                        </Link>
                      </li>
                    ))}
                    {hasMoreProducts && (
                      <li className="w-full">
                        <Link
                          to="/stores"
                          className="block text-center text-base py-2 px-4 text-green-600 font-semibold hover:underline cursor-pointer hover:bg-gray-100 rounded-md transition-colors duration-150"
                          onClick={() => setMobileMenu(false)}
                        >
                          See More Stores
                        </Link>
                      </li>
                    )}
                  </ul>
                </details>
              </li>
              <li>
                <Link
                  to="/submit-store"
                  onClick={() => setMobileMenu(false)}
                  className="block text-center text-lg py-3 cursor-pointer hover:bg-gray-100 rounded-md transition-colors duration-150"
                >
                  Submit a Store
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenu(false)}
                  className="block text-center text-lg py-3 cursor-pointer hover:bg-gray-100 rounded-md transition-colors duration-150"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
      <hr className="border-t border-gray-200" />
    </header>
  );
};

export default Nav;