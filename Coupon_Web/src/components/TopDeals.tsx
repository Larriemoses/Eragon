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
  is_signup_store?: boolean; // --- ADDED: New field for Product interface ---
}

interface ProductCoupon {
  id: number;
  product: Product; // Note: This product is an object, not just an ID
  title: string;
  code: string;
  discount: string; // Assuming this is a string like "10%" or "20.00"
  expiry_date?: string; // Add expiry_date as optional
  likes: number; // Assuming you have these fields on your ProductCoupon model
  dislikes: number; // Assuming you have these fields on your ProductCoupon model
  used_count: number;
  used_today: number;
  shop_now_url?: string | null;
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
  const [coupons, setCoupons] = useState<ProductCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState<string | null>(null);
  // products state is fine here as it's used internally by useEffect for mapping.

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
        // Ensure fetchedProducts are an array, handling potential 'results' key from DRF pagination
        const fetchedProducts: Product[] = Array.isArray(productsData) ? productsData : productsData.results || [];
        // No need to setProducts to state here if only used for coupon enrichment.
        // setProducts(fetchedProducts); // Removed if not directly rendered or used elsewhere.

        const couponsRes = await fetch(`${BACKEND_URL}/api/productcoupon/`);
        if (!couponsRes.ok) throw new Error(`HTTP error! status: ${couponsRes.status} for coupons`);
        const couponsData = await couponsRes.json();
        const fetchedCouponsRaw: any[] = Array.isArray(couponsData) ? couponsData : couponsData.results || [];

        const enrichedCoupons: ProductCoupon[] = fetchedCouponsRaw.map(coupon => {
          const productDetail = fetchedProducts.find(p => p.id === coupon.product) || {
            id: coupon.product,
            name: "Unknown Product",
            logo: null,
            logo_url: null,
            title: "",
            subtitle: "",
            sub_subtitle: "",
            is_signup_store: false // Default to false if product not found
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
  }, []); // Empty dependency array, runs once on mount

  const topDealsCoupons: ProductCoupon[] = React.useMemo(() => {
    const productToBestCouponMap = new Map<number, ProductCoupon>();

    // Group coupons by product ID and find the best one for each
    coupons.forEach(coupon => {
      const currentBest = productToBestCouponMap.get(coupon.product.id);

      // "Better" is defined by higher combined used_count + used_today
      if (!currentBest || (coupon.used_count + coupon.used_today) > (currentBest.used_count + currentBest.used_today)) {
        productToBestCouponMap.set(coupon.product.id, coupon);
      }
    });

    // Convert map values to an array
    let selectedCoupons = Array.from(productToBestCouponMap.values());

    // Sort the selected coupons by overall usage (most popular first)
    selectedCoupons.sort((a, b) => (b.used_count + b.used_today) - (a.used_count + a.used_today));

    // This now returns one coupon per product, sorted by usage, without a hard limit.
    return selectedCoupons;
  }, [coupons]); // Recalculate only when 'coupons' data changes

  if (loading) {
    return <div className="text-center py-8">Loading top deals...</div>;
  }

  return (
    <div className="w-full flex flex-col gap-4 mb-3" id="top-deals"> {/* Added id for smooth scrolling */}
      {popup && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded shadow-lg z-50 transition-all">
          {popup}
        </div>
      )}

      <h2 className="text-2xl font-bold text-center">Top Deals</h2>
      <div className="max-w-xl w-[90%] mx-auto flex flex-col gap-6">
        {topDealsCoupons.length === 0 && (
          <div className="text-gray-500 text-center py-8">No top deals available from unique products.</div>
        )}
        {topDealsCoupons.map((coupon) => {
          const product = coupon.product;
          const logoSrc = getFullLogoUrl(product.logo ?? product.logo_url);

          // --- NEW LOGIC: Determine button text based on product.is_signup_store ---
          const buttonText = product.is_signup_store ? 'Sign Up' : 'Shop Now';
          const isSignupStoreAction = product.is_signup_store; // Store boolean for clarity
          // --- END NEW LOGIC ---

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
              {coupon.code && ( // Only show if code exists
                <div className="flex flex-wrap gap-2 items-center mt-auto">
                  <span className="bg-gray-200 px-4 py-2 rounded font-bold text-lg select-all">
                    {coupon.code}
                  </span>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold flex-shrink-0"
                    onClick={() => {
                      navigator.clipboard.writeText(coupon.code);
                      showPopup("Code copied!");
                      // Use product.id to update usage if coupon.id alone isn't enough,
                      // or just pass coupon.id as it's what your backend expects for 'use' action.
                      fetch(`${BACKEND_URL}/api/productcoupon/${coupon.id}/use/`, { method: "POST" })
                        .then(() => { /* Maybe refresh data or update state if needed */ })
                        .catch(err => console.error("Error updating coupon usage:", err));
                    }}
                  >
                    Copy
                  </button>
                </div>
              )}

              {/* Shop Now / Sign Up Button */}
              {coupon.shop_now_url ? ( // Only show button if a URL exists
                <a
                  href={coupon.shop_now_url}
                  className={`block mt-2 ${isSignupStoreAction ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'} text-white text-center py-2 rounded font-bold`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {buttonText} {/* Dynamic text */}
                </a>
              ) : (
                // Display a disabled button if no URL is available for the action
                <button
                    className="block mt-2 bg-gray-300 text-gray-600 text-center py-2 rounded font-bold cursor-not-allowed"
                    disabled
                >
                    {buttonText} (Link N/A) {/* Dynamic text with N/A */}
                </button>
              )}
            </div>
          );
        })}
         
      </div>
    </div>
  );
};

export default TopDeals;