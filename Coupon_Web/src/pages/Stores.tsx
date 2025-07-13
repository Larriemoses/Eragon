// src/pages/Store.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePageHead } from "../utils/headManager";
import { slugify } from "../utils/slugify";

interface Product {
  id: number;
  name: string;
  logo?: string | null;
  logo_url?: string | null;
}

const API_URL = "https://eragon-backend1.onrender.com/api/products/";
const BACKEND_BASE_URL = "https://eragon-backend1.onrender.com";

const getFullLogoUrl = (logoPath?: string | null) => {
  if (!logoPath) return undefined;
  if (logoPath.startsWith("http://") || logoPath.startsWith("https://")) {
    return logoPath;
  }
  return `${BACKEND_BASE_URL}${logoPath.startsWith("/") ? "" : "/"}${logoPath}`;
};

const Store: React.FC = () => {
  const [liveBaseUrl, setLiveBaseUrl] = useState<string | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ FIXED: Await getPrerenderLiveBaseUrl if available
  useEffect(() => {
    const resolveLiveBaseUrl = async () => {
      if (typeof window !== "undefined") {
        if ((window as any).getPrerenderLiveBaseUrl) {
          try {
            const resolved = await (window as any).getPrerenderLiveBaseUrl();
            setLiveBaseUrl(resolved);
          } catch {
            setLiveBaseUrl(window.location.origin);
          }
        } else {
          setLiveBaseUrl(window.location.origin);
        }
      }
    };
    resolveLiveBaseUrl();
  }, []);

  usePageHead({
    title: "All Stores & Brands - Verified Coupons & Deals | Discount Region",
    description:
      "Browse a comprehensive list of top brands and stores offering verified discount codes on gadgets, trading tools, and everyday essentials. Find Oraimo, prop firms, Shopinverse & more.",
    keywords:
      "stores, brands, verified coupons, discount codes, prop firms, oraimo, shopinverse, 1xbet",
    ogImage:
      "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1747609358/image-removebg-preview_soybkt.png",
    ogUrl: liveBaseUrl ? `${liveBaseUrl}/stores/` : undefined,
    canonicalUrl: liveBaseUrl ? `${liveBaseUrl}/stores/` : undefined,
  });

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const productData: Product[] = Array.isArray(data)
          ? data
          : data.results || [];

        const specificPriorities = [
          "Oraimo Nigeria",
          "Oraimo Ghana",
          "Oraimo Morocco",
          "FundedNext",
          "Maven Trading",
        ];

        const sortedProducts = [...productData].sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          const indexA = specificPriorities.findIndex(
            (p) => p.toLowerCase() === nameA
          );
          const indexB = specificPriorities.findIndex(
            (p) => p.toLowerCase() === nameB
          );

          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;

          const scoreA = nameA.includes("oraimo") ? 1 : 2;
          const scoreB = nameB.includes("oraimo") ? 1 : 2;

          return scoreA !== scoreB
            ? scoreA - scoreB
            : nameA.localeCompare(nameB);
        });

        setProducts(sortedProducts);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-6">
      <h1 className="text-2xl font-bold mb-6">Stores</h1>
      <div className="bg-gray-100 rounded-xl shadow p-6 w-full max-w-2xl">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => {
              const logoSrc = product.logo || product.logo_url;
              const productSlug = slugify(product.name);
              return (
                <div
                  key={product.id}
                  className="flex flex-col items-center bg-gray-50 rounded-xl p-4 shadow hover:shadow-lg transition"
                >
                  <div className="w-20 h-20 flex items-center justify-center bg-white rounded-lg mb-3">
                    {logoSrc ? (
                      <img
                        src={getFullLogoUrl(logoSrc)}
                        alt={product.name}
                        className="max-w-[60px] max-h-[60px] object-contain"
                        onError={(e) => {
                          e.currentTarget.src = `https://placehold.co/60x60/cccccc/ffffff?text=${product.name.charAt(
                            0
                          )}`;
                          e.currentTarget.onerror = null;
                        }}
                      />
                    ) : (
                      <span className="text-gray-400 text-2xl">?</span>
                    )}
                  </div>
                  <div className="font-semibold text-center mb-2">
                    {product.name}
                  </div>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-bold transition"
                    onClick={() =>
                      navigate(`/store/${product.id}/${productSlug}`)
                    }
                  >
                    Open Store
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
