import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SubmitDeal from "../components/SubmitDeal";
import { usePageHead } from '../utils/headManager';

interface Product {
  id: number;
  name: string;
  logo?: string | null;
  logo_url?: string | null;
  title?: string;
  subtitle?: string;
  sub_subtitle?: string;
  main_affiliate_url?: string | null;
  footer_section_effortless_savings_title?: string;
  footer_section_effortless_savings_description?: string;
  footer_section_how_to_use_title?: string;
  footer_section_how_to_use_steps?: string;
  footer_section_how_to_use_note?: string;
  footer_section_tips_title?: string;
  footer_section_tips_list?: string;
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
  shop_now_url?: string | null;
}

const BACKEND_URL = "https://eragon-backend1.onrender.com";
const PRODUCT_BY_SLUG_API = `${BACKEND_URL}/api/products/by_slug/`;
const COUPON_API = `${BACKEND_URL}/api/productcoupon/`;

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


const ProductStore: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);

  // --- Dynamic Head Management Logic (Consolidated and Unconditional) ---
  // Determine head content based on loading state and product data
  let headTitle = 'Product Details | Discount Region';
  let headDescription = 'Discover great deals and coupons for products at Discount Region.';
  let headOgImage = 'https://res.cloudinary.com/dvl2r3bdw/image/upload/v1747609358/image-removebg-preview_soybkt.png'; // Fallback

  if (!loading) { // Once loading is complete, determine content
    if (product) {
      headTitle = product.name ? `${product.name} Coupons & Deals | Discount Region` : headTitle;
      headDescription = product.subtitle ? `${product.subtitle} ${product.sub_subtitle || ''} Find all verified ${product.name} coupon codes and discounts at Discount Region. Save significantly.` : headDescription;
      headOgImage = product.logo_url || product.logo || headOgImage;
    } else { // Product not found
      headTitle = "Product Not Found | Discount Region";
      headDescription = "The product or store you are looking for could not be found on Discount Region.";
      // ogImage can remain fallback
    }
  }

  // --- CALL usePageHead UNCONDITIONALLY HERE ---
  usePageHead({
    title: headTitle,
    description: headDescription,
    ogImage: headOgImage,
    ogUrl: window.location.href,
    ogType: 'website',
    canonicalUrl: window.location.href,
  });
  // --- END HEAD MANAGEMENT ---


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
        setCoupons(couponData.filter((c: Coupon) => c.product === currentProductId))
      })
      .catch(error => console.error("Error refreshing coupons after copy:", error));
  };

  useEffect(() => {
    if (!slug) {
        setLoading(false);
        return;
    }
    setLoading(true);

    fetch(`${PRODUCT_BY_SLUG_API}${slug}/`)
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) {
              setProduct(null);
              setCurrentProductId(null);
              setCoupons([]);
              setLoading(false);
              return Promise.reject(new Error("Product not found (404)"));
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(productData => {
          setProduct(productData);
          setCurrentProductId(productData.id);
          return productData.id;
      })
      .then(fetchedProductId => {
          return fetch(COUPON_API)
              .then(res => {
                  if (!res.ok) throw new Error(`HTTP error! status: ${res.status} when fetching coupons`);
                  return res.json();
              })
              .then(couponResponseData => {
                  const couponData = Array.isArray(couponResponseData) ? couponResponseData : couponResponseData.results || [];
                  setCoupons(couponData.filter((c: Coupon) => c.product === fetchedProductId));
              });
      })
      .catch(error => {
        console.error("Error fetching product or coupons:", error);
        setLoading(false);
      });
  }, [slug]);

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

  const mainProductLinkUrl = product.main_affiliate_url && product.main_affiliate_url.trim() !== ''
    ? product.main_affiliate_url.trim()
    : '#';

  return (
    <div className="min-h-screen flex flex-col items-center bg-white py-8">
      <div className="max-w-xl w-[90%] flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-1">
          {product.title || product.name}
        </h1>
        {product.subtitle && (
          <div className="text-center text-lg text-gray-900 mb-1">
            <h2 className="font-bold">{product.subtitle}</h2>
          </div>
        )}
        {product.sub_subtitle && (
          <div className="text-center text-base text-gray-500 mb-4">
            {product.sub_subtitle}
          </div>
        )}
        <div className="flex justify-center mb-6">
          {(product.logo || product.logo_url) ? (
            <a
              href={mainProductLinkUrl}
              target={mainProductLinkUrl !== '#' ? "_blank" : "_self"}
              rel={mainProductLinkUrl !== '#' ? "noopener noreferrer" : ""}
            >
              <img
                src={getFullLogoUrl(product.logo ?? product.logo_url)}
                alt={product.name}
                className="w-30 h-30 object-contain rounded bg-white"
              />
            </a>
          ) : null}
        </div>
        <div className="w-full flex flex-col items-center gap-6 md:flex-row md:flex-wrap md:justify-center">
          {coupons.length === 0 ? (
            <div className="text-center text-gray-500">No coupons available for this store.</div>
          ) : (
            coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="w-[90%] sm:w-[80%] md:w-[100%] max-w-xs rounded-xl shadow-xl p-4 flex flex-col gap-2 relative overflow-hidden"
              >
                <div className="flex justify-start mb-2">
                  {product.logo || product.logo_url ? (
                    <img
                      src={getFullLogoUrl(product.logo ?? product.logo_url)}
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
              </div>
            ))
          )}
        </div>
      </div>

      {(product.footer_section_effortless_savings_title || product.footer_section_effortless_savings_description) && (
        <div className="max-w-xl w-[90%] mt-8 p-6 rounded-lg shadow">
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
      {(product.footer_section_how_to_use_title || product.footer_section_how_to_use_steps || product.footer_section_how_to_use_note) && (
        <div className="max-w-xl w-[90%] mt-8 p-6 rounded-lg shadow">
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
      {(product.footer_section_tips_title || product.footer_section_tips_list) && (
        <div className="max-w-xl w-[90%] mt-8 p-6 rounded-lg shadow">
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
      {(product.footer_section_contact_title || product.footer_section_contact_description || product.footer_contact_phone || product.footer_contact_email || product.footer_contact_whatsapp) && (
        <div className="max-w-xl w-[90%] mt-8 p-6 rounded-lg shadow">
          <h2
            className="text-2xl font-bold text-gray-800 mb-4 text-center"
            dangerouslySetInnerHTML={{ __html: product.footer_section_contact_title || "" }}
          />
          <p
            className="text-gray-600 mb-6 text-center"
            dangerouslySetInnerHTML={{ __html: product.footer_section_contact_description }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-4 text-gray-700">  
            {product.footer_contact_phone && (
              <div className="flex flex-col items-center text-center">
                <p className="font-bold text-lg mb-2">📞 Phone Support</p>
                {product.footer_contact_phone.split('\n').map((num, index) => (
                  <a key={index} href={`tel:${num.replace(/\D/g, '')}`} className="text-blue-600 hover:underline mb-1 last:mb-0">
                    {num.trim()}
                  </a>
                ))}
              </div>
            )}
            {product.footer_contact_email && (
              <div className="flex flex-col items-center text-center md:col-span-1">
                <p className="font-bold text-lg mb-2">✉️ Email Support</p>
                {product.footer_contact_email.split('\n').map((email, index) => (
                    <p key={index} className="mb-1 last:mb-0">
                      <a href={`mailto:${email.trim()}`} className="text-blue-600 hover:underline">
                        {email.trim()}
                      </a>
                    </p>
                ))}
              </div>
            )}
            {product.footer_contact_whatsapp && (
              <div className="flex flex-col items-center text-center md:col-start-2 md:row-start-1">
                <p className="font-bold text-lg mb-2">💬 Whatsapp Support</p>
                <p className="text-gray-800 mb-1">Chat with a rep:</p>
                {product.footer_contact_whatsapp.split('\n').map((num, index) => (
                  <a
                    key={index}
                    href={`https://wa.me/${num.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline mb-1 last:mb-0"
                  >
                    {num.trim()}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
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
      <SubmitDeal />
    </div>
  );
};

export default ProductStore;