// ProductCouponsSection.tsx
import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
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

const API_TOKEN = "5e94ab243b5cbc00546b6e026b51ba421550c5f4";

const ProductCouponsSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<ProductCoupon[]>([]);
  const [activeProduct, setActiveProduct] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const fetchCoupons = () => {
    fetch("https://eragon-backend1.onrender.com/api/productcoupon/", {
      headers: { Authorization: `Token ${API_TOKEN}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch coupons");
        return res.json();
      })
      .then(setCoupons)
      .catch(err => setError(err.message));
  };

  useEffect(() => {
    setError(null);

    fetch("https://eragon-backend1.onrender.com/api/products", {
      headers: { Authorization: `Token ${API_TOKEN}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then(data => {
        // If your API returns { results: [...] }
        if (Array.isArray(data)) {
          setProducts(data);
          if (data.length > 0) setActiveProduct(data[0].id);
        } else if (Array.isArray(data.results)) {
          setProducts(data.results);
          if (data.results.length > 0) setActiveProduct(data.results[0].id);
        } else {
          setProducts([]);
        }
      })
      .catch(err => setError(err.message));

    fetchCoupons();
  }, []);

  const handleLike = (id: number) => {
    fetch(`https://eragon-backend1.onrender.com/api/products/productcoupon/${id}/like/`, {
      method: "POST",
      headers: { Authorization: `Token ${API_TOKEN}` },
    }).then(fetchCoupons);
  };

  const handleDislike = (id: number) => {
    fetch(`https://eragon-backend1.onrender.com/api/products/productcoupon/${id}/dislike/`, {
      method: "POST",
      headers: { Authorization: `Token ${API_TOKEN}` },
    }).then(fetchCoupons);
  };

  const handleCopy = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    fetch(`https://eragon-backend1.onrender.com/api/products/productcoupon/${id}/use/`, {
      method: "POST",
      headers: { Authorization: `Token ${API_TOKEN}` },
    }).then(fetchCoupons);
  };

  return (
    <div className="p-4 md:p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Products & Coupons</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        {products.map(product => (
          <button
            key={product.id}
            className={`p-3 rounded shadow text-center font-semibold transition border
              ${activeProduct === product.id
                ? "bg-green-600 text-white border-green-700"
                : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-green-100"}
            `}
            onClick={() => setActiveProduct(product.id)}
          >
            {product.name}
          </button>
        ))}
      </div>

      {/* Coupon Filter */}
      <input
        type="text"
        placeholder="Filter by coupon code..."
        className="mb-4 p-2 border rounded w-full"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />

      {/* Coupons for Active Product */}
      <div>
        {coupons
          .filter(
            coupon =>
              coupon.product === activeProduct &&
              coupon.code.toLowerCase().includes(filter.toLowerCase())
          )
          .map(coupon => (
            <div
              key={coupon.id}
              className="flex flex-col md:flex-row md:items-center justify-between border-b py-4 gap-4"
            >
              <div>
                <div className="font-bold text-lg">{coupon.title}</div>
                <div className="text-sm text-gray-600">
                  {coupon.discount}% Off — Expires: {coupon.expiry_date}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <span
                  className="bg-green-600 text-white px-6 py-2 rounded font-bold select-all cursor-default"
                >
                  {coupon.code}
                </span>
                <button
                  className="mx-2 cursor-pointer text-gray-500 hover:text-gray-700"
                  title="Copy"
                  onClick={() => handleCopy(coupon.code, coupon.id)}
                >
                  <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="5" width="10" height="10" rx="2" />
                    <rect x="9" y="9" width="10" height="10" rx="2" />
                  </svg>
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleLike(coupon.id)}
                    className="border p-2 cursor-pointer rounded hover:bg-gray-200"
                    title="Like"
                  >
                    👍
                  </button>
                  <button
                    onClick={() => handleDislike(coupon.id)}
                    className="border p-2 cursor-pointer rounded hover:bg-gray-100"
                    title="Dislike"
                  >
                    👎
                  </button>
                </div>
                <span className="ml-2 text-green-700 font-semibold">
                  {coupon.likes} 👍 / {coupon.dislikes} 👎
                </span>
                <span className="ml-2 text-gray-700">
                  {coupon.used_count} Used - {coupon.used_today} Today
                </span>
              </div>
            </div>
          ))}
        {coupons.filter(coupon => coupon.product === activeProduct && coupon.code.toLowerCase().includes(filter.toLowerCase())).length === 0 && (
          <div className="text-gray-500 text-center py-8">No coupons for this product.</div>
        )}
      </div>
    </div>
  );
};

export default ProductCouponsSection;