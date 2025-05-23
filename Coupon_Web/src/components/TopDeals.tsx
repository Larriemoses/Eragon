import React, { useEffect, useState } from "react";

const API_TOKEN = "5e94ab243b5cbc00546b6e026b51ba421550c5f4";
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
  product: Product; // Changed to Product object
  title: string;
  code: string;
  discount: string;
  expiry_date: string;
  likes: number;
  dislikes: number;
  used_count: number;
  used_today: number;
}

const TopDeals: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<ProductCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState<string | null>(null); // For copy popup

  // Show popup for 2 seconds
  const showPopup = (msg: string) => {
    setPopup(msg);
    setTimeout(() => setPopup(null), 2000);
  };

  useEffect(() => {
    const fetchTopDealsData = async () => {
      setLoading(true);
      try {
        // Fetch products first
        const productsRes = await fetch(`${BACKEND_URL}/api/products`, {
          headers: { Authorization: `Token ${API_TOKEN}` },
        });
        const productsData = await productsRes.json();
        const fetchedProducts: Product[] = Array.isArray(productsData) ? productsData : productsData.results || [];
        setProducts(fetchedProducts);

        // Then fetch coupons
        const couponsRes = await fetch(`${BACKEND_URL}/api/productcoupon/`, {
          headers: { Authorization: `Token ${API_TOKEN}` },
        });
        const couponsData = await couponsRes.json();
        const fetchedCouponsRaw: any[] = Array.isArray(couponsData) ? couponsData : couponsData.results || [];

        // Enrich coupons with product details
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

  // Get the first coupon for each product
  const topDeals = products.map(product => {
    const firstCoupon = coupons.find(coupon => coupon.product.id === product.id);
    return firstCoupon ? { product, coupon: firstCoupon } : null;
  }).filter(Boolean) as { product: Product; coupon: ProductCoupon }[];

  if (loading) {
    return <div className="text-center py-8">Loading top deals...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto"> {/* Main container with padding and max-width */}
      {/* Popup message */}
      {popup && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded shadow-lg z-50 transition-all">
          {popup}
        </div>
      )}

      <h2 className="text-2xl font-bold text-center mb-6">Top Deals</h2>
      <div className="w-full flex flex-col items-center gap-6"> {/* Full width wrapper for deals */}
        {topDeals.length === 0 && (
          <div className="text-gray-500 text-center py-8">No top deals available.</div>
        )}
        {topDeals.map(({ product, coupon }) => {
          const logoSrc = product.logo ? `${BACKEND_URL}${product.logo}` : product.logo_url || "";
          return (
            <div
              key={coupon.id}
              // Responsive padding: p-4 on small, sm:px-6 sm:py-5 on larger
              className="w-full max-w-xl bg-white rounded-2xl shadow-md p-4 sm:px-6 sm:py-5 flex flex-col gap-2"
            >
              <div className="flex items-start gap-3"> {/* Smaller gap for compact mobile view */}
                {logoSrc && (
                  <img
                    src={logoSrc}
                    alt={product.name}
                    className="h-16 w-16 object-contain flex-shrink-0 rounded-lg"
                    draggable={false}
                    onError={(e) => { // Fallback for broken image URLs
                      e.currentTarget.src = `https://placehold.co/64x64/cccccc/ffffff?text=${product.name.charAt(0)}`;
                      e.currentTarget.onerror = null; // Prevent infinite loop
                    }}
                  />
                )}
                <div className="flex-grow min-w-0"> {/* min-w-0 allows flex item to shrink */}
                  <div className="text-green-700 font-bold text-lg leading-tight break-words"> {/* Allow name to wrap */}
                    {product.name}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1"> {/* Flex wrap for badges */}
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded flex-shrink-0">
                      Discount is active
                    </span>
                    <span className="text-xs text-green-600 flex items-center flex-shrink-0">
                      <svg width="16" height="16" fill="none" className="inline mr-1"><circle cx="8" cy="8" r="8" fill="#22c55e"/><path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Remaining coupon info below the logo/header */}
              <div className="font-semibold text-gray-800 mt-2">{coupon.title}</div>
              <div className="text-sm text-gray-600">{product.title}</div>
              <div className="text-xs text-gray-500">{product.subtitle}</div>
              <div className="text-xs text-gray-400">{product.sub_subtitle}</div>
              <div className="flex items-center text-xs text-gray-500 gap-4 mt-1">
                <span>{coupon.used_count} Used</span>
                <span>{coupon.used_today} Today</span>
              </div>

              {/* Coupon code input and button: Stack on mobile, row on larger screens */}
              {coupon.code && coupon.code.trim() && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4">
                  <input
                    className="rounded px-2 py-1 text-sm font-mono w-full sm:w-auto flex-grow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={coupon.code}
                    readOnly
                  />
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 sm:py-1 rounded text-sm transition-colors duration-200 w-full sm:w-auto" // Full width on mobile, auto on larger
                    onClick={() => {
                      const tempInput = document.createElement('input');
                      tempInput.value = coupon.code;
                      document.body.appendChild(tempInput);
                      tempInput.select();
                      document.execCommand('copy');
                      document.body.removeChild(tempInput);
                      showPopup("Code copied!");
                    }}
                  >
                    Copy
                  </button>
                </div>
              )}
              <button className="bg-green-500 hover:bg-green-600 text-white w-full mt-4 py-2 rounded font-semibold transition-colors duration-200">
                Shop Now
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopDeals;