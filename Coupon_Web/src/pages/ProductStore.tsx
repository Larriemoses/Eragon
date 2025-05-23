import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductFooter from "../components/ProductFooter";
import SubmitDeal from "../components/SubmitDeal";

interface Product {
  id: number;
  name: string;
  logo?: string | null;
  logo_url?: string | null;
  title?: string;
  subtitle?: string;
  sub_subtitle?: string;
}

interface Coupon {
  id: number;
  product: number;
  title: string;
  code: string;
  discount: string;
  used_count: number;
  used_today: number;
}

const API_TOKEN = "5e94ab243b5cbc00546b6e026b51ba421550c5f4";
const PRODUCT_API = "https://eragon-backend1.onrender.com/api/products/";
const COUPON_API = "https://eragon-backend1.onrender.com/api/productcoupon/";

const ProductStore: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCopy = async (coupon: Coupon) => {
    navigator.clipboard.writeText(coupon.code);
    await fetch(`${COUPON_API}${coupon.id}/use/`, {
      method: "POST",
      headers: { Authorization: `Token ${API_TOKEN}` },
    });
    // Refresh coupons
    fetch(COUPON_API, {
      headers: { Authorization: `Token ${API_TOKEN}` },
    })
      .then(res => res.json())
      .then(data => setCoupons(data.filter((c: Coupon) => c.product === Number(id))));
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${PRODUCT_API}${id}/`, {
      headers: { Authorization: `Token ${API_TOKEN}` },
    })
      .then(res => res.json())
      .then(setProduct);

    fetch(COUPON_API, {
      headers: { Authorization: `Token ${API_TOKEN}` },
    })
      .then(res => res.json())
      .then(data => setCoupons(data.filter((c: Coupon) => c.product === Number(id))))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl mb-4">Product not found.</div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => navigate("/stores")}
        >
          Back to Stores
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-white py-8">
      <div className="max-w-xl w-[90%] flex flex-col items-center">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-1">
          {product.title || product.name}
        </h1>
        {/* Subtitle */}
        {product.subtitle && (
          <div className="text-center text-lg text-gray-900 mb-1">
            <h2 className="font-bold">{product.subtitle}</h2>
          </div>
        )}
        {/* Sub-sub-title */}
        {product.sub_subtitle && (
          <div className="text-center text-base text-gray-500 mb-4">
            {product.sub_subtitle}
          </div>
        )}
        <div className="flex justify-center mb-6">
          {product.logo || product.logo_url ? (
            <img
              src={product.logo ?? product.logo_url ?? undefined}
              alt={product.name}
              className="w-30 h-30 object-contain rounded bg-white"
            />
          ) : null}
        </div>
        <div className="w-full flex flex-col gap-6">
          {coupons.length === 0 ? (
            <div className="text-center text-gray-500">No coupons available for this store.</div>
          ) : (
            coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-grey-100 rounded-xl shadow-xl p-4 flex flex-col gap-2"
              >
                {/* Product Logo */}
                <div className="flex justify-start mb-2">
                  {product.logo || product.logo_url ? (
                    <img
                      src={product.logo ?? product.logo_url ?? undefined}
                      alt={product.name}
                      className="w-18 h-18 object-contain rounded bg-white"
                    />
                  ) : null}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-500">Discount is active</span>
                  <span className="text-green-600 text-xs font-semibold">● Verified</span>
                </div>
                <div className="font-bold text-lg">{coupon.title}</div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                  <span>{coupon.used_count} used</span>
                  <span>{coupon.used_today} Today</span>
                </div>
                {/* Only show code and Copy button if coupon.code exists */}
                {coupon.code && (
                  <div className="flex gap-2">
                    <span className="bg-gray-100 px-4 py-2 rounded font-bold text-lg select-all">
                      {coupon.code}
                    </span>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-bold"
                      onClick={() => handleCopy(coupon)}
                    >
                      Copy
                    </button>
                  </div>
                )}
                <a
                  href="#"
                  className="block mt-2 bg-green-500 hover:bg-green-600 text-white text-center py-2 rounded font-bold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Now
                </a>
              </div>
            ))
          )}
        </div>
      </div>
      <ProductFooter />
      <SubmitDeal />


    </div>
  );
};

export default ProductStore;