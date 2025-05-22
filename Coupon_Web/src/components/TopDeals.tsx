import React, { useEffect, useState } from "react";

const API_TOKEN = "5e94ab243b5cbc00546b6e026b51ba421550c5f4";
const BACKEND_URL = "https://eragon-backend1.onrender.com";

interface Product {
  id: number;
  name: string;
  logo?: string | null;
  logo_url?: string | null;
}

interface ProductCoupon {
  id: number;
  product: number;
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

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${BACKEND_URL}/api/products`, {
        headers: { Authorization: `Token ${API_TOKEN}` },
      }).then(res => res.json()),
      fetch(`${BACKEND_URL}/api/productcoupon/`, {
        headers: { Authorization: `Token ${API_TOKEN}` },
      }).then(res => res.json()),
    ]).then(([productsData, couponsData]) => {
      setProducts(Array.isArray(productsData) ? productsData : productsData.results || []);
      setCoupons(Array.isArray(couponsData) ? couponsData : couponsData.results || []);
      setLoading(false);
    });
  }, []);

  // Get the first coupon for each product
  const topDeals = products.map(product => {
    const firstCoupon = coupons.find(coupon => coupon.product === product.id);
    return firstCoupon ? { product, coupon: firstCoupon } : null;
  }).filter(Boolean) as { product: Product; coupon: ProductCoupon }[];

  if (loading) {
    return <div className="text-center py-8">Loading top deals...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Top Deals</h2>
      <div className="w-full flex flex-col items-center gap-6">
        {topDeals.length === 0 && (
          <div className="text-gray-500 text-center py-8">No top deals available.</div>
        )}
        {topDeals.map(({ product, coupon }) => {
          // Uncomment and adjust if you want to show product logo
          // const logoSrc = product.logo ? `${BACKEND_URL}${product.logo}` : product.logo_url || "";
          return (
            <div
              key={coupon.id}
              className="w-full max-w-xl bg-white rounded-2xl shadow-md px-6 py-5 flex flex-col gap-2"
            >
              <div className="flex items-center gap-3 mb-2">
                {/* {logoSrc && (
                  <img
                    src={logoSrc}
                    alt={product.name}
                    className="h-8 object-contain"
                    draggable={false}
                  />
                )} */}
                <span className="font-bold text-green-700 text-lg">{product.name}</span>
                <span className="ml-auto text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                  Discount is active
                </span>
                <span className="ml-2 text-xs text-green-600 flex items-center">
                  <svg width="16" height="16" fill="none" className="inline mr-1"><circle cx="8" cy="8" r="8" fill="#22c55e"/><path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Verified
                </span>
              </div>
              <div className="font-semibold text-gray-800">{coupon.title}</div>
              <div className="flex items-center text-xs text-gray-500 gap-4">
                <span>{coupon.used_count} Used</span>
                <span>{coupon.used_today} Today</span>
              </div>
              {/* Only show code/copy if coupon.code exists */}
              {coupon.code && coupon.code.trim() && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    className="rounded px-2 py-1 text-sm font-mono w-32"
                    value={coupon.code}
                    readOnly
                  />
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                    onClick={() => navigator.clipboard.writeText(coupon.code)}
                  >
                    Copy
                  </button>
                </div>
              )}
              <button className="bg-green-500 hover:bg-green-600 text-white w-full mt-2 py-2 rounded font-semibold">
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