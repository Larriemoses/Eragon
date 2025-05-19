import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LOGO_URL = "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1747609358/image-removebg-preview_soybkt.png"; // Replace with your Cloudinary logo link
const API_TOKEN = "5e94ab243b5cbc00546b6e026b51ba421550c5f4";
const API_URL = "https://upgraded-rotary-phone-jggv9pw6p56hxgq-8000.app.github.dev/api/products/";

interface Product {
  id: number;
  name: string;
}

const Nav: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [dropdown, setDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_URL, {
      headers: { Authorization: `Token ${API_TOKEN}` },
    })
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search navigation if needed
    navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  const visibleProducts = products.slice(0, 5); // Adjust the number of visible products as needed
  const hasMoreProducts = products.length > 5;

  return (
    <header className="w-full bg-white shadow-sm">
      <nav className="w-[90%] container mx-auto flex items-center justify-between py-3 px-4 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={LOGO_URL} alt="Discount Region" className="h-10 w-auto" />
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex-1 mx-4 max-w-lg hidden md:flex"
        >
          <input
            type="text"
            className="w-full border border-gray-200 rounded-l-full px-4 py-2 outline-none"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-500 rounded-r-full px-4 flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </button>
        </form>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-6 font-normal text-black">
          <li className=" hover:text-gray-700">
            <Link to="/" className="hover:text-gray-700 cursor-pointer">
              Home
            </Link>
          </li>
          <li>
            <Link to="/today-deals" className=" hover:text-gray-700 cursor-pointer">
              Today Deals
            </Link>
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
                className="w-4 h-4"
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
            {/* Dropdown */}
            {dropdown && (
              <div className="absolute left-0 top-full mt-2 w-56 bg-white  rounded shadow-lg z-20">
                <ul className="flex flex-col items-center py-2">
                  {visibleProducts.map((product) => (
                    <li key={product.id} className="w-full text-center">
                      <Link
                        to={`/store/${product.id}`}
                        className="block px-4 py-2 text-black hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => setDropdown(false)}
                      >
                        {product.name}
                      </Link>
                    </li>
                  ))}
                  {hasMoreProducts && (
                    <li className="w-full text-center">
                      <Link
                        to="/stores"
                        className="block px-4 py-2 text-green-500 font-medium hover:underline cursor-pointer text-lg"
                        onClick={() => setDropdown(false)}
                      >
                        See More
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
              className="block text-center text-1xl py-3 cursor-pointer hover:text-gray-700"
            >
              Submit a Store
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="block text-center text-1xl py-3 cursor-pointer hover:text-gray-700"
            >
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          <svg
            className="w-7 h-7"
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

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md z-30 md:hidden">
            <ul className="flex flex-col gap-2 p-4 font-medium">
              <li>
                <Link
                  to="/"
                  onClick={() => setMobileMenu(false)}
                  className="block text-center text-lg py-3 cursor-pointer"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/today-deals"
                  onClick={() => setMobileMenu(false)}
                  className="block text-center text-lg py-3 cursor-pointer"
                >
                  Today Deals
                </Link>
              </li>
              <li>
                <details>
                  <summary className="cursor-pointer text-center text-lg py-3">
                    Stores
                  </summary>
                  <ul className="flex flex-col items-center py-2">
                    {visibleProducts.map((product) => (
                      <li key={product.id} className="w-full text-center">
                        <Link
                          to={`/store/${product.id}`}
                          className="block text-center text-lg py-3 cursor-pointer"
                          onClick={() => setMobileMenu(false)}
                        >
                          {product.name}
                        </Link>
                      </li>
                    ))}
                    {hasMoreProducts && (
                      <li className="w-full text-center">
                        <Link
                          to="/stores"
                          className="block text-center text-lg py-3 text-green-500 font-medium hover:underline cursor-pointer"
                          onClick={() => setMobileMenu(false)}
                        >
                          See More
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
                  className="block text-center text-lg py-3 cursor-pointer"
                >
                  Submit a Store
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenu(false)}
                  className="block text-center text-lg py-3 cursor-pointer"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
      {/* Mobile Search Bar */}
      <form onSubmit={handleSearch} className="flex md:hidden px-4 pb-2">
        <input
          type="text"
          className="w-full border border-gray-200 rounded-l-full px-4 py-2 outline-none"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-500 rounded-r-full px-4 flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle
              cx="11"
              cy="11"
              r="8"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
      </form>
    </header>
  );
};

export default Nav;
