import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

// Constants for API and logo
const BACKEND_URL = "https://eragon-backend1.onrender.com"; // Define backend URL
const LOGO_URL = "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1747609358/image-removebg-preview_soybkt.png"; // Your Cloudinary logo link
const PRODUCT_API_URL = `${BACKEND_URL}/api/products/`; // Changed to use BACKEND_URL
const COUPON_API_URL = `${BACKEND_URL}/api/productcoupon/`; // Changed to use BACKEND_URL

// Interface for Product data
interface Product {
  id: number;
  name: string;
  logo?: string | null;
  logo_url?: string | null;
}

// Interface for Coupon data (needed for filtering)
interface Coupon {
  id: number;
  product: number; // Foreign key to Product
  title: string;
  code: string;
}

// Interface for a combined search result item
interface SearchResultItem {
  type: 'product' | 'coupon';
  id: number;
  name: string; // Product name or coupon title
  link: string; // URL to navigate to (e.g., /store/:id)
  subText?: string; // e.g., "Coupon for [Product Name]"
}

// Helper function to get full logo URL (unified logic for all components)
const getFullLogoUrl = (logoPath?: string | null) => {
  if (logoPath) {
    // Check if it's already a full URL (e.g., from Cloudinary)
    if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
      return logoPath;
    }
    // Otherwise, prepend backend URL for relative paths (e.g., /media/...)
    // Ensure no double slashes if logoPath already starts with '/'
    if (logoPath.startsWith('/')) {
        return `<span class="math-inline">\{BACKEND\_URL\}</span>{logoPath}`;
    }
    return `<span class="math-inline">\{BACKEND\_URL\}/</span>{logoPath}`; // Add a leading slash if missing
  }
  return undefined; // No logo
};


const Nav: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [allCoupons, setAllCoupons] = useState<Coupon[]>([]); // Store all coupons for client-side search
  const [dropdown, setDropdown] = useState(false); // For "Stores" dropdown
  const [mobileMenu, setMobileMenu] = useState(false); // For mobile hamburger menu
  const [search, setSearch] = useState(""); // Current search input value
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]); // Results for search dropdown
  const [showSearchResults, setShowSearchResults] = useState(false); // Visibility of search results dropdown

  const searchInputRef = useRef<HTMLInputElement>(null); // Ref for desktop search input
  const mobileSearchInputRef = useRef<HTMLInputElement>(null); // Ref for mobile search input

  // Debounce mechanism for live search
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch all products and coupons on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Removed `headers: { Authorization: Token ${API_TOKEN} }` because endpoints are now public
        const [productsRes, couponsRes] = await Promise.all([
          fetch(PRODUCT_API_URL),
          fetch(COUPON_API_URL),
        ]);

        // Check if responses are OK before parsing JSON
        if (!productsRes.ok) {
          throw new Error(`HTTP error! status: ${productsRes.status} for products`);
        }
        if (!couponsRes.ok) {
          throw new Error(`HTTP error! status: ${couponsRes.status} for coupons`);
        }

        const productsData: Product[] = await productsRes.json();
        const couponsData: Coupon[] = await couponsRes.json();

        setProducts(productsData);
        setAllCoupons(couponsData);
      } catch (error) {
        console.error("Error fetching initial data for Nav:", error);
        // You might want to set an error state here to show a message to the user
      }
    };

    fetchAllData();
  }, []);

  // Function to perform the search and update searchResults
  const performSearch = (query: string) => {
    if (query.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const foundResults: SearchResultItem[] = [];

    // Search products by name
    products.forEach(product => {
      if (product.name.toLowerCase().includes(lowerCaseQuery)) {
        foundResults.push({
          type: 'product',
          id: product.id,
          name: product.name,
          link: `/store/${product.id}`,
        });
      }
    });

    // Search coupons by title or code
    allCoupons.forEach(coupon => {
      if (coupon.title.toLowerCase().includes(lowerCaseQuery) || coupon.code.toLowerCase().includes(lowerCaseQuery)) {
        const associatedProduct = products.find(p => p.id === coupon.product);
        foundResults.push({
          type: 'coupon',
          id: coupon.id,
          name: coupon.title,
          link: `/store/${coupon.product}`,
          subText: associatedProduct ? `for ${associatedProduct.name}` : 'Unknown Store',
        });
      }
    });

    setSearchResults(foundResults);
    setShowSearchResults(true);
  };

  // Handle search input change (with debounce for live search)
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    // Clear previous debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new debounce timeout
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300); // 300ms debounce time
  };

  // Handle search form submission (e.g., pressing Enter or clicking search button)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current); // Clear any pending debounced search
    }
    performSearch(search); // Perform search immediately on submit
    // Optionally, navigate to a dedicated search results page if no specific result is clicked
    // navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        mobileSearchInputRef.current &&
        !mobileSearchInputRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.search-results-dropdown')
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const visibleProducts = products.slice(0, 5); // Adjust the number of visible products as needed
  const hasMoreProducts = products.length > 5;

  return (
    <header className="w-full bg-white shadow-sm mb-5">
      <nav className="w-[90%] container mx-auto flex items-center justify-between py-3 px-4 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={LOGO_URL} alt="Discount Region" className="h-10 w-auto" /> {/* LOGO_URL is already absolute */}
        </Link>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 mx-4 max-w-lg hidden md:flex relative" // Added relative for dropdown positioning
        >
          <input
            ref={searchInputRef} // Attach ref
            type="text"
            className="w-full border border-gray-200 rounded-l-full px-4 py-2 outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
            placeholder="Search products or coupons..."
            value={search}
            onChange={handleSearchInputChange}
            onFocus={() => search.trim() !== "" && performSearch(search)} // Show results on focus if search is not empty
          />
          <button
            type="submit"
            className="bg-green-500 rounded-r-full px-4 flex items-center justify-center hover:bg-green-600 transition-colors duration-200"
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
          {/* Desktop Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="search-results-dropdown absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-2 z-40 max-h-80 overflow-y-auto">
              <ul className="py-1">
                {searchResults.map((result) => (
                  <li key={`<span class="math-inline">\{result\.type\}\-</span>{result.id}`}>
                    <Link
                      to={result.link}
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearch(""); // Clear search input on click
                      }}
                      className="flex flex-col px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                    >
                      <span className="font-semibold text-gray-800">
                        {result.name}
                        {result.type === 'coupon' && <span className="ml-2 text-xs text-gray-500">({result.subText})</span>}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">{result.type}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {showSearchResults && searchResults.length === 0 && search.trim() !== "" && (
            <div className="search-results-dropdown absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-2 z-40 p-4 text-center text-gray-500">
              No results found.
            </div>
          )}
        </form>

        {/* Desktop Nav Links */}
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
            // onClick handler for better mobile/tablet touch experience
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
                  {visibleProducts.map((product) => (
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
            {/* Mobile Search Bar inside menu */}
            <form onSubmit={handleSearchSubmit} className="flex p-4 relative">
              <input
                ref={mobileSearchInputRef} // Attach ref
                type="text"
                className="w-full border border-gray-200 rounded-l-full px-4 py-2 outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
                placeholder="Search products or coupons..."
                value={search}
                onChange={handleSearchInputChange}
                onFocus={() => search.trim() !== "" && performSearch(search)} // Show results on focus if search is not empty
              />
              <button
                type="submit"
                className="bg-green-500 rounded-r-full px-4 flex items-center justify-center hover:bg-green-600 transition-colors duration-200"
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
              {/* Mobile Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="search-results-dropdown absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-md shadow-lg mt-2 z-40 max-h-60 overflow-y-auto">
                  <ul className="py-1">
                    {searchResults.map((result) => (
                      <li key={`<span class="math-inline">\{result\.type\}\-</span>{result.id}`}>
                        <Link
                          to={result.link}
                          onClick={() => {
                            setShowSearchResults(false);
                            setMobileMenu(false); // Close mobile menu
                            setSearch(""); // Clear search input
                          }}
                          className="flex flex-col px-4 py-2 hover:bg-gray-100 transition-colors duration-150"
                        >
                          <span className="font-semibold text-gray-800">
                            {result.name}
                            {result.type === 'coupon' && <span className="ml-2 text-xs text-gray-500">({result.subText})</span>}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">{result.type}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {showSearchResults && searchResults.length === 0 && search.trim() !== "" && (
                <div className="search-results-dropdown absolute top-full left-0 w-full bg-white border border-gray-200 rounded-b-md shadow-lg mt-2 z-40 p-4 text-center text-gray-500">
                  No results found.
                </div>
              )}
            </form>

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
                <Link
                  to="/today-deals"
                  onClick={() => setMobileMenu(false)}
                  className="block text-center text-lg py-3 cursor-pointer hover:bg-gray-100 rounded-md transition-colors duration-150"
                >
                  Today Deals
                </Link>
              </li>
              <li>
                {/* Using details/summary for mobile dropdown */}
                <details className="w-full">
                  <summary className="cursor-pointer text-center text-lg py-3 hover:bg-gray-100 rounded-md transition-colors duration-150">
                    Stores
                  </summary>
                  <ul className="flex flex-col items-center py-2 bg-gray-50 rounded-md mt-1">
                    {visibleProducts.map((product) => (
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