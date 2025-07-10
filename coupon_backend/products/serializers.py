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
  is_signup_store?: boolean;
}

interface ProductCoupon {
  id: number;
  product: Product;
  title: string;
  code: string;
  discount: string;
  expiry_date?: string;
  likes: number;
  dislikes: number;
  used_count: number;
  used_today: number;
  shop_now_url?: string | null;
}

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


const TopDeals: React.FC = () => {
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
        const productsRes = await fetch(`${BACKEND_URL}/api/products/`);
        if (!productsRes.ok) throw new Error(`HTTP error! status: ${productsRes.status} for products`);
        const productsData = await productsRes.json();
        const fetchedProducts: Product[] = Array.isArray(productsData) ? productsData : productsData.results || [];

        const couponsRes = await fetch(`${BACKEND_URL}/api/productcoupon/`);
        if (!couponsRes.ok) throw new Error(`HTTP error! status: ${couponsRes.status} for coupons`);
        const couponsData = await couponsRes.json();
        const fetchedCouponsRaw: any[] = Array.isArray(couponsData) ? couponsData : couponsData.results || [];

        let enrichedCoupons: ProductCoupon[] = fetchedCouponsRaw.map(coupon => {
          const productDetail = fetchedProducts.find(p => p.id === coupon.product) || {
            id: coupon.product,
            name: "Unknown Product",
            logo: null,
            logo_url: null,
            title: "",
            subtitle: "",
            sub_subtitle: "",
            is_signup_store: false
          };
          return { ...coupon, product: productDetail };
        });

        // --- ONE-TIME FORCE RESET LOGIC (ADD THIS BLOCK) ---
        const forceResetKey = "forceResetUsedToday_TopDeals"; // Unique key for this one-time reset

        if (localStorage.getItem(forceResetKey) === null) {
            console.log("TopDeals: Performing one-time force reset of 'used_today'.");
            enrichedCoupons = enrichedCoupons.map(coupon => ({
                ...coupon,
                used_today: 0,
            }));
            localStorage.setItem(forceResetKey, "true"); // Mark as done
        }
        // --- END ONE-TIME FORCE RESET LOGIC ---

        // Daily Reset Logic (Apply AFTER the one-time force reset)
        const lastVisitDate = localStorage.getItem("topDealsLastVisitDate");
        const today = new Date().toDateString(); // e.g., "Thu Jul 10 2025"

        let couponsToSet = enrichedCoupons; // Start with the potentially force-reset data

        if (lastVisitDate !== today) {
          console.log("DEBUG(TopDeals): New day detected. Resetting 'used_today' for all coupons.");
          couponsToSet = couponsToSet.map(coupon => ({
            ...coupon,
            used_today: 0, // Set to 0 if it's a new day
          }));
          localStorage.setItem("topDealsLastVisitDate", today); // Store the current date for TopDeals
        } else {
            console.log("DEBUG(TopDeals): Same day. 'used_today' values are preserved (unless force-reset).");
        }
        
        setCoupons(couponsToSet);

      } catch (error) {
        console.error("Failed to fetch top deals data in TopDeals component:", error);
        showPopup("Failed to load top deals. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopDealsData();
  }, []);

  const topDealsCoupons: ProductCoupon[] = React.useMemo(() => {
    const productToBestCouponMap = new Map<number, ProductCoupon>();

    coupons.forEach(coupon => {
      if (coupon.product && typeof coupon.product.id === 'number') {
        const currentBest = productToBestCouponMap.get(coupon.product.id);

        if (!currentBest || (coupon.used_count + coupon.used_today) > (currentBest.used_count + currentBest.used_today)) {
          productToBestCouponMap.set(coupon.product.id, coupon);
        }
      } else {
        console.warn("DEBUG(TopDeals): Skipping coupon due to invalid product ID:", coupon);
      }
    });

    let selectedCoupons = Array.from(productToBestCouponMap.values());
    selectedCoupons.sort((a, b) => (b.used_count + b.used_today) - (a.used_count + a.used_today));

    return selectedCoupons;
  }, [coupons]);

  if (loading) {
    return (
        <div className="text-center py-8" id="top-deals" data-prerender-ready="false">
            Loading top deals...
        </div>
    );
  }

  return (
    <div
        className="w-full flex flex-col gap-4 mb-3"
        id="top-deals"
        data-prerender-ready="true"
    >
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

          const buttonText = product.is_signup_store === true ? 'Sign Up' : 'Shop Now';
          const isSignupStoreAction = product.is_signup_store;

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
                      // Optionally update the frontend used_today count immediately
                      setCoupons(prevCoupons => prevCoupons.map(c =>
                        c.id === coupon.id ? { ...c, used_today: c.used_today + 1, used_count: c.used_count + 1 } : c
                      ));
                      fetch(`${BACKEND_URL}/api/productcoupon/${coupon.id}/use/`, { method: "POST" })
                        .then(() => { /* Backend will update its counts, no need to refetch all here */ })
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
                  {buttonText}
                </a>
              ) : (
                // Display a disabled button if no URL is available for the action
                <button
                    className="block mt-2 bg-gray-300 text-gray-600 text-center py-2 rounded font-bold cursor-not-allowed"
                    disabled
                >
                  {buttonText} (Link N/A)
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