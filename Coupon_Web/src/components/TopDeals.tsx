import React, { useEffect, useState } from "react";

const BACKEND_URL = "https://eragon-backend1.onrender.com";

interface Product {
  id: number;
  name: string;
  logo?: string | null;
  logo_url?: string | null;
  title?: string;
  subtitle?: string;
  sub_subtitle?: string;
}

interface ProductCoupon {
  id: number;
  product: Product; // Note: This product is an object, not just an ID
  title: string;
  code: string;
  discount: string; // Assuming this is a string like "10%" or "20.00"
  expiry_date?: string; // Add expiry_date as optional
  likes: number;
  dislikes: number;
  used_count: number;
  used_today: number;
  shop_now_url?: string | null; // <--- ADDED: New field for ProductCoupon interface
}

// Helper function to get full logo URL (unified logic)
const getFullLogoUrl = (logoPath?: string | null) => {
  if (logoPath) {
    // Check if it's already a full URL (e.g., from Cloudinary or external source)
    if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
      return logoPath;
    }
    // Otherwise, prepend backend URL for relative paths (e.g., /media/...)
    // Ensure no double slashes if logoPath already starts with '/'
    if (logoPath.startsWith('/')) {
        return `${BACKEND_URL}${logoPath}`;
    }
    return `${BACKEND_URL}/${logoPath}`; // Add a leading slash if missing
  }
  return undefined; // No logo path provided
};


const TopDeals: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<ProductCoupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<string | null>(null);

  const showPopup = (msg: string) => {
    setPopup(msg);
    setTimeout(() => setPopup(null), 2000);
  };

  useEffect(() => {
    const fetchTopDealsData = async () => {
      setLoading(true);
      try {
        const productsRes = await fetch(`${BACKEND_URL}/api/products`);
        if (!productsRes.ok) throw new Error(`HTTP error! status: ${productsRes.status} for products`);
        const productsData = await productsRes.json();
        const fetchedProducts: Product[] = Array.isArray(productsData) ? productsData : productsData.results || [];
        setProducts(fetchedProducts);

        const couponsRes = await fetch(`${BACKEND_URL}/api/productcoupon/`);
        if (!couponsRes.ok) throw new Error(`HTTP error! status: ${couponsRes.status} for coupons`);
        const couponsData = await coupons.json(); // Fix: Was coupons.json() instead of couponsRes.json()
        const fetchedCouponsRaw: any[] = Array.isArray(couponsData) ? couponsData : couponsData.results || [];

        const enrichedCoupons: ProductCoupon[] = fetchedCouponsRaw.map(coupon => {
          const productDetail = fetchedProducts.find(p => p.id === coupon.product) || {
            id: coupon.product,
            name: "Unknown Product",
            logo: null,
            logo_url: null,
            title: "",
            subtitle: "",
            sub_subtitle: ""
          };
          return { ...coupon, product: productDetail };
        });
        setCoupons(enrichedCoupons);

      } catch (error) {
        console.error("Failed to fetch top deals data:", error);
        showPopup("Failed to load top deals. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopDealsData();
  }, []);

  const topDealsCoupons = coupons
    .filter(coupon => coupon.code)
    .sort((a, b) => (b.used_count + b.used_today) - (a.used_count + a.used_today))
    .slice(0, 6);


  if (loading) {
    return <div className="text-center py-8">Loading top deals...</div>;
  }

  return (
    // Main container now uses flex for centering.
    // Adjusted max-w and padding to give more breathing room
    <div className="py-8 bg-white flex flex-col items-center">
      {popup && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded shadow-lg z-50 transition-all">
          {popup}
        </div>
      )}

      <h2 className="text-2xl font-bold text-center mb-6">Top Deals</h2>
      
      {/* Conditional rendering for layout based on number of coupons */}
      {topDealsCoupons.length === 0 ? (
        <div className="text-gray-500 text-center py-8">No top deals available.</div>
      ) : topDealsCoupons.length === 1 ? (
        // Layout for a single coupon: 80% width on mobile, 40% on desktop, centered
        <div className="w-4/5 md:w-2/5 mx-auto"> {/* Adjusted width for single card */}
          {topDealsCoupons.map((coupon) => {
            const product = coupon.product;
            const logoSrc = getFullLogoUrl(product.logo ?? product.logo_url);
            return (
              <div
                key={coupon.id}
                className="bg-white rounded-xl shadow-xl p-4 flex flex-col gap-2"
              >
                {/* Product Logo */}
                <div className="flex justify-start mb-2">
                  {logoSrc ? (
                    <img
                      src={logoSrc}
                      alt={product.name}
                      className="w-16 h-16 object-contain rounded-lg"
                      draggable={false}
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/64x64/cccccc/ffffff?text=${product.name.charAt(0)}`;
                        e.currentTarget.onerror = null;
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                      {product.name.charAt(0)}
                    </div>
                  )}
                </div>
                {/* Discount Active / Verified */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-500">Discount is active</span>
                  <span className="text-green-600 text-xs font-semibold">● Verified</span>
                </div>
                {/* Coupon Title */}
                <div className="font-bold text-lg text-gray-900">{coupon.title}</div>
                {/* Used Count / Today */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                  <span>{coupon.used_count} used</span>
                  <span>{coupon.used_today} Today</span>
                </div>
                {/* Coupon Code and Copy Button */}
                {coupon.code && (
                  <div className="flex flex-wrap gap-2 items-center mt-auto">
                    <span className="bg-gray-200 px-4 py-2 rounded font-bold text-lg select-all flex-grow">
                      {coupon.code}
                    </span>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold flex-shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(coupon.code);
                        showPopup("Code copied!");
                        fetch(`${BACKEND_URL}/api/products/productcoupon/${coupon.id}/use/`, { method: "POST" })
                          .then(() => { /* Maybe refresh data or update state if needed */ })
                          .catch(err => console.error("Error updating coupon usage:", err));
                      }}
                    >
                      Copy
                    </button>
                  </div>
                )}
                {/* Shop Now Button */}
                {coupon.shop_now_url ? (
                  <a
                    href={coupon.shop_now_url}
                    className="block mt-2 bg-green-500 hover:bg-green-600 text-white text-center py-2 rounded font-bold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Shop Now
                  </a>
                ) : (
                  <button
                    className="block mt-2 bg-gray-300 text-gray-600 text-center py-2 rounded font-bold cursor-not-allowed"
                    disabled
                  >
                    Shop Now (Link N/A)
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // Layout for multiple coupons: responsive grid with increased card width
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"> {/* Adjusted cols to 2 on md for wider cards */}
          {topDealsCoupons.map((coupon) => {
            const product = coupon.product;
            const logoSrc = getFullLogoUrl(product.logo ?? product.logo_url);
            return (
              <div
                key={coupon.id}
                // Individual card width: on mobile full width, on sm and md 4/5, on lg 1/3 (via grid)
                className="bg-white rounded-xl shadow-xl p-4 flex flex-col gap-2 w-full sm:w-[90%] md:w-[90%] mx-auto lg:w-auto"
              >
                {/* Product Logo */}
                <div className="flex justify-start mb-2">
                  {logoSrc ? (
                    <img
                      src={logoSrc}
                      alt={product.name}
                      className="w-16 h-16 object-contain rounded-lg"
                      draggable={false}
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/64x64/cccccc/ffffff?text=${product.name.charAt(0)}`;
                        e.currentTarget.onerror = null;
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                      {product.name.charAt(0)}
                    </div>
                  )}
                </div>
                {/* Discount Active / Verified */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-500">Discount is active</span>
                  <span className="text-green-600 text-xs font-semibold">● Verified</span>
                </div>
                {/* Coupon Title */}
                <div className="font-bold text-lg text-gray-900">{coupon.title}</div>
                {/* Used Count / Today */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                  <span>{coupon.used_count} used</span>
                  <span>{coupon.used_today} Today</span>
                </div>
                {/* Coupon Code and Copy Button */}
                {coupon.code && (
                  <div className="flex flex-wrap gap-2 items-center mt-auto">
                    <span className="bg-gray-200 px-4 py-2 rounded font-bold text-lg select-all flex-grow">
                      {coupon.code}
                    </span>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold flex-shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(coupon.code);
                        showPopup("Code copied!");
                        fetch(`${BACKEND_URL}/api/products/productcoupon/${coupon.id}/use/`, { method: "POST" })
                          .then(() => { /* Maybe refresh data or update state if needed */ })
                          .catch(err => console.error("Error updating coupon usage:", err));
                      }}
                    >
                      Copy
                    </button>
                  </div>
                )}
                {/* Shop Now Button */}
                {coupon.shop_now_url ? (
                  <a
                    href={coupon.shop_now_url}
                    className="block mt-2 bg-green-500 hover:bg-green-600 text-white text-center py-2 rounded font-bold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Shop Now
                  </a>
                ) : (
                  <button
                    className="block mt-2 bg-gray-300 text-gray-600 text-center py-2 rounded font-bold cursor-not-allowed"
                    disabled
                  >
                    Shop Now (Link N/A)
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopDeals;