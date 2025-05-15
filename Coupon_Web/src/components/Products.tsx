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
}

const API_TOKEN = "5e94ab243b5cbc00546b6e026b51ba421550c5f4"; // <-- Put your token here

const ProductCouponsSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<ProductCoupon[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);

    fetch("https://upgraded-rotary-phone-jggv9pw6p56hxgq-8000.app.github.dev/api/products", {
      headers: {
        Authorization: `Token ${API_TOKEN}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then(setProducts)
      .catch(err => setError(err.message));

    fetch("https://upgraded-rotary-phone-jggv9pw6p56hxgq-8000.app.github.dev/api/productcoupon/", {
      headers: {
        Authorization: `Token ${API_TOKEN}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch coupons");
        return res.json();
      })
      .then(setCoupons)
      .catch(err => setError(err.message));
  }, []);

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Products & Coupons</h2>
      <input
        type="text"
        placeholder="Filter by coupon code..."
        className="mb-4 p-2 border rounded w-full"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {products.map(product => (
        <div key={product.id} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
          <ul>
            {coupons
              .filter(
                coupon =>
                  coupon.product === product.id &&
                  coupon.code.toLowerCase().includes(filter.toLowerCase())
              )
              .map(coupon => (
                <li
                  key={coupon.id}
                  className="mb-2 p-3 border rounded bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <span className="font-medium">{coupon.title}</span> —{" "}
                    <span className="text-blue-600">{coupon.code}</span> —{" "}
                    <span className="text-green-600">{coupon.discount}% off</span> —{" "}
                    <span className="text-gray-500">Expires: {coupon.expiry_date}</span>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ProductCouponsSection;