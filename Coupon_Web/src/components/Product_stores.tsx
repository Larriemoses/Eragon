import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SubmitDeal from "../components/SubmitDeal";

interface Product {
  id: number;
  name: string;
  logo?: string | null;
  logo_url?: string | null;
  title?: string;
  subtitle?: string;
  sub_subtitle?: string;
  footer_section_effortless_savings_title?: string;
  footer_section_effortless_savings_description?: string;
  footer_section_how_to_use_title?: string;
  footer_section_how_to_use_steps?: string; // Now a plain string
  footer_section_how_to_use_note?: string;
  footer_section_tips_title?: string;
  footer_section_tips_list?: string; // Now a plain string
  footer_section_contact_title?: string;
  footer_section_contact_description?: string;
  footer_contact_phone?: string;
  footer_contact_email?: string;
  footer_contact_whatsapp?: string;
  social_facebook_url?: string | null;
  social_twitter_url?: string | null;
  social_instagram_url?: string | null;
}

interface Coupon {
  id: number;
  product: number;
  title: string;
  code: string;
  discount: string;
  used_count: number;
  used_today: number;
  shop_now_url?: string | null; // <--- ADDED: Include shop_now_url in Coupon interface
}

const BACKEND_URL = "https://eragon-backend1.onrender.com";
const PRODUCT_API = `${BACKEND_URL}/api/products/`;
const COUPON_API = `${BACKEND_URL}/api/productcoupon/`;

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
    });
    fetch(COUPON_API)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status} when refreshing coupons`);
        return res.json();
      })
      .then(data => {
        const couponData = Array.isArray(data) ? data : data.results || [];
        setCoupons(couponData.filter((c: Coupon) => c.product === Number(id)))
      })
      .catch(error => console.error("Error refreshing coupons after copy:", error));
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const fetchProduct = fetch(`${PRODUCT_API}${id}/`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(setProduct)
      .catch(error => {
        console.error("Error fetching product:", error);
        setProduct(null);
      });

    const fetchCoupons = fetch(COUPON_API)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status} when fetching coupons`);
        return res.json();
      })
      .then(data => {
        const couponData = Array.isArray(data) ? data : data.results || [];
        setCoupons(couponData.filter((c: Coupon) => c.product === Number(id)))
      })
      .catch(error => console.error("Error fetching coupons:", error));

    Promise.all([fetchProduct, fetchCoupons])
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
              src={getFullLogoUrl(product.logo ?? product.logo_url)} // Use helper for logo URL
              alt={product.name}
              className="w-30 h-30 object-contain rounded bg-white"
            />
          ) : null}
        </div>
        {/* Adjusted coupon list container for responsiveness */}
        <div className="w-full flex flex-col items-center gap-6 md:flex-row md:flex-wrap md:justify-center">
          {coupons.length === 0 ? (
            <div className="text-center text-gray-500">No coupons available for this store.</div>
          ) : (
            coupons.map((coupon) => (
              <div
                key={coupon.id}
                // Reduced width for desktop, maintaining w-[90%] for mobile
                className="w-[90%] sm:w-[80%] md:w-[45%] lg:w-[30%] xl:w-[23%] max-w-xs bg-white rounded-xl shadow-xl p-4 flex flex-col gap-2 relative overflow-hidden"
              >
                {/* Product Logo */}
                <div className="flex justify-start mb-2">
                  {product.logo || product.logo_url ? (
                    <img
                      src={getFullLogoUrl(product.logo ?? product.logo_url)} // Use helper for logo URL
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
                    <span className="bg-gray-200 px-4 py-2 rounded font-bold text-lg select-all">
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
                {/* --- UPDATED: Shop Now button uses coupon.shop_now_url --- */}
                {coupon.shop_now_url && (
                  <a
                    href={coupon.shop_now_url}
                    className="block mt-2 bg-green-500 hover:bg-green-600 text-white text-center py-2 rounded font-bold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Shop Now
                  </a>
                )}
                {/* --- END UPDATED --- */}
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- Product Footer Content (embedded here) --- */}
      {/* Footer Section: Effortless Savings */}
      {(product.footer_section_effortless_savings_title || product.footer_section_effortless_savings_description) && (
        <div className="max-w-xl w-[90%] mt-8 bg-gray-100 p-6 rounded-lg shadow">
          <h2
            className="text-2xl font-bold text-gray-800 mb-2 text-center"
            dangerouslySetInnerHTML={{ __html: product.footer_section_effortless_savings_title || "" }}
          />
          <p
            className="text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.footer_section_effortless_savings_description || "" }}
          />
        </div>
      )}

      {/* Footer Section: How to Use (updated to handle plain text or array) */}
      {(product.footer_section_how_to_use_title || product.footer_section_how_to_use_steps || product.footer_section_how_to_use_note) && (
        <div className="max-w-xl w-[90%] mt-8 bg-gray-100 p-6 rounded-lg shadow">
          <h2
            className="text-2xl font-bold text-gray-800 mb-2 text-center"
            dangerouslySetInnerHTML={{ __html: product.footer_section_how_to_use_title || "" }}
          />
          {product.footer_section_how_to_use_steps && (
            Array.isArray(product.footer_section_how_to_use_steps) ? (
              <ol className="list-decimal list-inside text-gray-600 mb-4">
                {product.footer_section_how_to_use_steps.map((step, index) => (
                  <li key={index} className="mb-1" dangerouslySetInnerHTML={{ __html: step }} />
                ))}
              </ol>
            ) : (
              <p
                className="text-gray-600 leading-relaxed mb-4"
                dangerouslySetInnerHTML={{ __html: product.footer_section_how_to_use_steps }}
              />
            )
          )}
          {product.footer_section_how_to_use_note && (
            <p
              className="text-sm text-gray-500 italic"
              dangerouslySetInnerHTML={{ __html: product.footer_section_how_to_use_note }}
            />
          )}
        </div>
      )}

      {/* Footer Section: Tips (updated to handle plain text or array) */}
      {(product.footer_section_tips_title || product.footer_section_tips_list) && (
        <div className="max-w-xl w-[90%] mt-8 bg-gray-100 p-6 rounded-lg shadow">
          <h2
            className="text-2xl font-bold text-gray-800 mb-2 text-center"
            dangerouslySetInnerHTML={{ __html: product.footer_section_tips_title || "" }}
          />
          {product.footer_section_tips_list && (
            Array.isArray(product.footer_section_tips_list) ? (
              <ul className="list-disc list-inside text-gray-600">
                {product.footer_section_tips_list.map((tip, index) => (
                  <li key={index} className="mb-1" dangerouslySetInnerHTML={{ __html: tip }} />
                ))}
              </ul>
            ) : (
              <p
                className="text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.footer_section_tips_list }}
              />
            )
          )}
        </div>
      )}

      {/* Footer Section: Contact */}
      {(product.footer_section_contact_title || product.footer_section_contact_description || product.footer_contact_phone || product.footer_contact_email || product.footer_contact_whatsapp) && (
        <div className="max-w-xl w-[90%] mt-8 bg-gray-100 p-6 rounded-lg shadow">
          <h2
            className="text-2xl font-bold text-gray-800 mb-2 text-center"
            dangerouslySetInnerHTML={{ __html: product.footer_section_contact_title || "" }}
          />
          {product.footer_section_contact_description && (
            <p
              className="text-gray-600 mb-4"
              dangerouslySetInnerHTML={{ __html: product.footer_section_contact_description }}
            />
          )}
          {/* Adjusted contact section for grid layout on mobile */}
          <div className="grid grid-cols-1 gap-4 text-gray-700 md:grid-cols-2">
            {product.footer_contact_phone && (
              <div className="flex flex-col mb-2"> {/* Changed from p to div, added flex-col */}
                <span className="font-semibold">Phone:</span>
                <a href={`tel:${product.footer_contact_phone}`} className="text-blue-600 hover:underline">
                  {product.footer_contact_phone}
                </a>
              </div>
            )}
            {product.footer_contact_email && (
              <div className="flex flex-col mb-2"> {/* Changed from p to div, added flex-col */}
                <span className="font-semibold">Email:</span>
                <a href={`mailto:${product.footer_contact_email}`} className="text-blue-600 hover:underline">
                  {product.footer_contact_email}
                </a>
              </div>
            )}
            {product.footer_contact_whatsapp && (
              <div className="flex flex-col"> {/* Changed from p to div, added flex-col */}
                <span className="font-semibold">WhatsApp:</span>
                <a
                  href={`https://wa.me/${product.footer_contact_whatsapp?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  {product.footer_contact_whatsapp}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
      {/* --- End of Product Footer Content --- */}

      {/* --- Social Media Buttons --- */}
      {(product.social_facebook_url || product.social_twitter_url || product.social_instagram_url) && (
        <div className="max-w-xl w-[90%] mt-8 flex justify-center gap-2 flex-wrap md:flex-nowrap">
          {product.social_facebook_url && (
            <a
              href={product.social_facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-bold flex-grow text-sm md:text-base text-center"
            >
              Facebook
            </a>
          )}
          {product.social_twitter_url && (
            <a
              href={product.social_twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-bold flex-grow text-sm md:text-base text-center"
            >
              Twitter
            </a>
          )}
          {product.social_instagram_url && (
            <a
              href={product.social_instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-bold flex-grow text-sm md:text-base text-center"
            >
              Instagram
            </a>
          )}
        </div>
      )}
      {/* --- End of Social Media Buttons --- */}
      <SubmitDeal />
    </div>
  );
};

export default ProductStore;