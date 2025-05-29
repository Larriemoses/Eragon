  // Store.tsx
  import React, { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { usePageHead } from '../utils/headManager';



  interface Product {
    id: number;
    name: string;
    logo?: string | null;
    logo_url?: string | null;
    title?: string;
    subtitle?: string;
    sub_subtitle?: string;
    country?: string;
  }

 const API_URL = "https://eragon-backend1.onrender.com/api/products/";
const BACKEND_BASE_URL = "https://eragon-backend1.onrender.com";

// Helper function to get full logo URL (unified logic)
const getFullLogoUrl = (logoPath?: string | null) => {
  if (logoPath) {
    if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
      return logoPath;
    }
    // Ensure no double slashes if logoPath already starts with '/'
    if (logoPath.startsWith('/')) {
        return `${BACKEND_BASE_URL}${logoPath}`;
    }
    return `${BACKEND_BASE_URL}/${logoPath}`; // Add a leading slash if missing
  }
  return undefined;
};

const Store: React.FC = () => {
  // <--- CORRECT PLACEMENT OF usePageHead HOOK ---
  // It MUST be the very first thing called inside the functional component's body.
  usePageHead({
    title: "All Stores & Brands - Verified Coupons & Deals | Discount Region", // Adjusted title for stores page
    description: "Browse a comprehensive list of top brands and stores offering verified discount codes on gadgets, trading tools, and everyday essentials. Find Oraimo, prop firms, Shopinverse & more.", // Adjusted description for stores page
    ogImage: "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1747609358/image-removebg-preview_soybkt.png", // Use your main logo or a compelling social share image
    ogUrl: "https://www.yourdomain.com/stores", // IMPORTANT: Replace with your actual domain
    canonicalUrl: "https://www.yourdomain.com/stores", // IMPORTANT: Replace with your actual domain
  });
  // <--- END CORRECT PLACEMENT ---

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const productData: Product[] = Array.isArray(data) ? data : data.results || [];

        // --- START OF REVISED SORTING LOGIC FOR HARDCODED PRIORITY ---
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
            (priorityName) => priorityName.toLowerCase() === nameA
          );
          const indexB = specificPriorities.findIndex(
            (priorityName) => priorityName.toLowerCase() === nameB
          );

          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }

          if (indexA !== -1) {
            return -1;
          }

          if (indexB !== -1) {
            return 1;
          }

          let scoreA: number;
          if (nameA.includes("oraimo")) {
            scoreA = 1;
          } else {
            scoreA = 2;
          }

          let scoreB: number;
          if (nameB.includes("oraimo")) {
            scoreB = 1;
          } else {
            scoreB = 2;
          }

          if (scoreA !== scoreB) {
            return scoreA - scoreB;
          }

          return nameA.localeCompare(nameB);
        });
        setProducts(sortedProducts);
      })
      .catch((error) => {
        console.error("Error fetching products in Store component:", error);
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
              return (
                <div
                  key={product.id}
                  className="flex flex-col items-center bg-gray-50 rounded-xl p-4 shadow hover:shadow-lg transition"
                >
                  <div className="w-20 h-20 flex items-center justify-center bg-white rounded-lg mb-3 ">
                    {logoSrc ? (
                      <img
                        src={getFullLogoUrl(logoSrc)}
                        alt={product.name}
                        className="max-w-[60px] max-h-[60px] object-contain"
                        onError={(e) => {
                          e.currentTarget.src = `https://placehold.co/60x60/cccccc/ffffff?text=${product.name.charAt(0)}`;
                          e.currentTarget.onerror = null;
                        }}
                      />
                    ) : (
                      <span className="text-gray-400 text-2xl">?</span>
                    )}
                  </div>
                  <div className="font-semibold text-center mb-2">{product.name}</div>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-bold transition"
                    onClick={() => navigate(`/store/${product.id}`)}
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

