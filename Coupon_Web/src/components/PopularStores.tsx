import React, { useEffect, useState, useRef } from "react";

type Product = {
  id: number;
  name: string;
  logo: string | null;
  logo_url: string | null;
};

const BACKEND_URL = "https://eragon-backend1.onrender.com";
// const TOKEN = "5e94ab243b5cbc00546b6e026b51ba421550c5f4"; // Removed: No longer needed for public endpoints

// Helper function to get full logo URL (THIS MUST BE CONSISTENT ACROSS ALL FILES)
const getFullLogoUrl = (logoPath?: string | null) => {
  if (logoPath) {
    // Check if it's already a full URL (e.g., from Cloudinary or external source)
    if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
      return logoPath; // It's already an absolute URL, use it as is.
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

const PopularStores: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [repeatCount, setRepeatCount] = useState(2);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/products/`) // Removed headers
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((error) => {
        console.error("Error fetching popular stores:", error);
        setProducts([]);
      });
  }, []);

  useEffect(() => {
    if (products.length && marqueeRef.current) {
      const containerWidth = marqueeRef.current.offsetWidth;
      // Using 80px + 48px gap from the actual rendering logic
      const individualItemWidth = 80 + 48;
      const logoTotalWidth = products.length * individualItemWidth;
      const minRepeat = Math.ceil((containerWidth * 2) / logoTotalWidth);
      setRepeatCount(minRepeat > 2 ? minRepeat : 2);
    }
  }, [products]);

  const logos = Array.from({ length: repeatCount })
    .flatMap(() => products);

  return (
    <div className="w-full py-8 bg-white">
      <h2 className="text-center text-xl md:text-2xl font-bold mb-6">Popular Stores</h2>
      <div className="overflow-hidden relative w-full" ref={marqueeRef}>
        <div
          className="flex gap-12 animate-marquee"
          style={{
            minWidth: "200%",
            alignItems: "center",
          }}
        >
          {logos.map((product, idx) => {
            const logoSrc = product.logo || product.logo_url;
            return (
              <div key={product.id + "-" + idx} className="flex flex-col items-center min-w-[80px]">
                {logoSrc ? (
                  <img
                    src={getFullLogoUrl(logoSrc)} // <<<--- CHANGED THIS LINE to use the helper
                    alt={product.name}
                    className="h-12 md:h-16 object-contain mb-2"
                    draggable={false}
                    onError={(e) => { // Added onError for robustness
                      e.currentTarget.src = `https://placehold.co/64x64/cccccc/ffffff?text=${product.name.charAt(0)}`;
                      e.currentTarget.onerror = null;
                    }}
                  />
                ) : (
                  // Placeholder for missing logo
                  <div className="h-12 w-24 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                    {product.name.charAt(0)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PopularStores;