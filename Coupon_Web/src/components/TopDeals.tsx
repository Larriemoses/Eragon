import React, { useEffect, useState } from "react";

// const API_TOKEN = "5e94ab243b5cbc00546b6e026b51ba421550c5f4"; // Removed: No longer needed if all endpoints are public
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
  const [popup, setPopup] = useState<string | null>(null);

  const showPopup = (msg: string) => {
    setPopup(msg);
    setTimeout(() => setPopup(null), 2000);
  };

  useEffect(() => {
    const fetchTopDealsData = async () => {
      setLoading(true);
      try {
        // Removed Authorization header for public GET requests
        const productsRes = await fetch(`${BACKEND_URL}/api/products`);
        if (!productsRes.ok) throw new Error(`HTTP error! status: ${productsRes.status} for products`);
        const productsData = await productsRes.json();
        const fetchedProducts: Product[] = Array.isArray(productsData) ? productsData : productsData.results || [];
        setProducts(fetchedProducts);

        // Removed Authorization header for public GET requests
        const couponsRes = await fetch(`${BACKEND_URL}/api/productcoupon/`);
        if (!couponsRes.ok) throw new Error(`HTTP error! status: ${couponsRes.status} for coupons`);
        const couponsData = await couponsRes.json();
        const fetchedCouponsRaw: any[] = Array.isArray(couponsData) ? couponsData : couponsData.results || [];

        const enrichedCoupons: ProductCoupon[] = fetchedCouponsRaw.map(coupon => {
          const productDetail = fetchedProducts.find(p => p.id === coupon.product) || {
            id: coupon.product, // Keep the product ID even if product details aren't found
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

  const topDeals = products.map(product => {
    const firstCoupon = coupons.find(coupon => coupon.product.id === product.id);
    return firstCoupon ? { product, coupon: firstCoupon } : null;
  }).filter(Boolean) as { product: Product; coupon: ProductCoupon }[];

  if (loading) {
    return <div className="text-center py-8">Loading top deals...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {popup && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded shadow-lg z-50 transition-all">
          {popup}
        </div>
      )}

      <h2 className="text-2xl font-bold text-center mb-6">Top Deals</h2>
      <div className="w-full flex flex-col items-center gap-8">
        {topDeals.length === 0 && (
          <div className="text-gray-500 text-center py-8">No top deals available.</div>
        )}
        {topDeals.map(({ product, coupon }) => {
          const logoSrc = product.logo || product.logo_url; // Use logical OR for cleaner fallback
          return (
            <div
              key={coupon.id}
              className="w-full max-w-xs sm:max-w-xl bg-white rounded-2xl shadow-xl p-4 sm:px-6 sm:py-5 flex flex-col gap-2 box-border overflow-hidden"
            >
              <div className="flex items-start gap-3">
                {logoSrc && (
                  <img
                    src={`${BACKEND_URL}${logoSrc}`} // Prepend BACKEND_URL for full path
                    alt={product.name}
                    className="h-12 w-12 sm:h-16 sm:w-16 object-contain flex-shrink-0 rounded-lg"
                    draggable={false}
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/64x64/cccccc/ffffff?text=${product.name.charAt(0)}`;
                      e.currentTarget.onerror = null;
                    }}
                  />
                )}
                <div className="flex-grow min-w-0">
                  <div className="text-green-700 font-bold text-base sm:text-lg leading-tight break-words">
                    {product.name}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
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

              <div className="font-semibold text-gray-800 mt-2 text-sm sm:text-base break-words">{coupon.title}</div>
              <div className="text-xs sm:text-sm text-gray-600 break-words">{product.title}</div>
              <div className="text-xs text-gray-500 break-words">{product.subtitle}</div>
              <div className="text-xs text-gray-400 break-words">{product.sub_subtitle}</div>
              <div className="flex items-center text-xs text-gray-500 gap-4 mt-1">
                <span>{coupon.used_count} Used</span>
                <span>{coupon.used_today} Today</span>
              </div>

              {coupon.code && coupon.code.trim() && (
                <div className="flex flex-row items-center gap-2 mt-4">
                  <input
                    className="rounded px-2 py-1 text-xs sm:text-sm font-mono w-full flex-grow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={coupon.code}
                    readOnly
                  />
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 sm:py-1 rounded text-xs sm:text-sm transition-colors duration-200"
                    onClick={() => {
                      // Removed token requirement for copy action if backend allows AllowAny
                      const tempInput = document.createElement('input');
                      tempInput.value = coupon.code;
                      document.body.appendChild(tempInput);
                      tempInput.select();
                      document.execCommand('copy'); // Note: document.execCommand('copy') is deprecated, but still widely supported. For modern approach, use navigator.clipboard.writeText(text).
                      document.body.removeChild(tempInput);
                      showPopup("Code copied!");

                      // If you want to increment 'used_count' via API on copy,
                      // you'd need to make a separate fetch call here,
                      // and that API endpoint also needs to be public (`AllowAny`).
                      // For example:
                      // fetch(`${BACKEND_URL}/api/products/productcoupon/${coupon.id}/use/`, { method: "POST" });
                    }}
                  >
                    Copy
                  </button>
                </div>
              )}
              <button className="bg-green-500 hover:bg-green-600 text-white w-full mt-4 py-2 rounded font-semibold text-xs sm:text-base transition-colors duration-200">
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