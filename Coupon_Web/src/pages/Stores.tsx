// Store.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  logo?: string | null;
  logo_url?: string | null;
  title?: string;
  subtitle?: string;
  sub_subtitle?: string;
}

const API_URL = "https://eragon-backend1.onrender.com/api/products/";
const BACKEND_BASE_URL = "https://eragon-backend1.onrender.com";

const Store: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to get full logo URL (unified logic)
  const getFullLogoUrl = (logoPath?: string | null) => {
    if (logoPath) {
      if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
        return logoPath;
      }
      return `${BACKEND_BASE_URL}${logoPath}`;
    }
    return undefined;
  };

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const productData = Array.isArray(data) ? data : data.results || [];

        // --- START OF NEW SORTING LOGIC ---
        const sortedProducts = [...productData].sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();

          const isOraimoA = nameA.includes("oraimo");
          const isOraimoB = nameB.includes("oraimo");

          if (isOraimoA && !isOraimoB) {
            return -1; // 'a' (Oraimo) comes before 'b'
          }
          if (!isOraimoA && isOraimoB) {
            return 1; // 'b' (Oraimo) comes before 'a'
          }
          // If both are Oraimo or neither are Oraimo, sort alphabetically by name
          return nameA.localeCompare(nameB);
        });
        // --- END OF NEW SORTING LOGIC ---

        setProducts(sortedProducts); // Set the sorted products
      })
      .catch((error) => {
        console.error("Error fetching products in Store component:", error);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []); // Empty dependency array means this runs once on mount

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