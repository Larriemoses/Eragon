import React, { useEffect, useState, useRef } from "react";

type Product = {
  id: number;
  name: string;
  logo: string | null;
  logo_url: string | null;
};

const BACKEND_URL = "https://eragon-backend1.onrender.com";
// const TOKEN = "5e94ab243b5cbc00546b6e026b51ba421550c5f4"; // Removed: No longer needed for public endpoints

const LOGO_WIDTH = 120; // px, should match min-w-[120px]
const GAP = 48; // px, should match gap-12 (12*4)

const PopularStores: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [repeatCount, setRepeatCount] = useState(2);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Removed `headers: { Authorization: Token ${TOKEN} }` because the endpoint is now public
    fetch(`${BACKEND_URL}/api/products/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((error) => {
        console.error("Error fetching popular stores:", error);
        setProducts([]); // Set to empty array on error to prevent crashes
      });
  }, []);

  // Calculate how many times to repeat the logos to fill the marquee
  useEffect(() => {
    if (products.length && marqueeRef.current) {
      const containerWidth = marqueeRef.current.offsetWidth;
      // Using 80px + 48px gap from the actual rendering logic
      // Note: `min-w-[80px]` is set on the individual logo container
      // and `gap-12` (48px) is set on the flex container.
      const individualItemWidth = 80 + 48; // 80px width + 48px gap
      const logoTotalWidth = products.length * individualItemWidth;

      // Repeat enough times to cover at least twice the container width
      // (to ensure smooth continuous marquee effect)
      const minRepeat = Math.ceil((containerWidth * 2) / logoTotalWidth);
      setRepeatCount(minRepeat > 2 ? minRepeat : 2); // Ensure at least 2 repeats
    }
  }, [products]); // Recalculate if products change

  // Build the logos array to fill the marquee
  const logos = Array.from({ length: repeatCount })
    .flatMap(() => products);

  return (
    <div className="w-full py-8 bg-white">
      <h2 className="text-center text-xl md:text-2xl font-bold mb-6">Popular Stores</h2>
      <div className="overflow-hidden relative w-full" ref={marqueeRef}>
        <div
          className="flex gap-12 animate-marquee"
          style={{
            minWidth: "200%", // Ensures enough content for continuous scrolling
            alignItems: "center",
          }}
        >
          {logos.map((product, idx) => {
            // Use logical OR for a cleaner fallback
            const logoSrc = product.logo || product.logo_url;
            return (
              <div key={product.id + "-" + idx} className="flex flex-col items-center min-w-[80px]">
                {logoSrc ? (
                  <img
                    src={`${BACKEND_URL}${logoSrc}`} // Prepend BACKEND_URL for full path
                    alt={product.name}
                    className="h-12 md:h-16 object-contain mb-2"
                    draggable={false}
                  />
                ) : (
                  <div className="h-12 w-24 bg-gray-200 rounded" /> // Placeholder for missing logo
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Marquee animation styles */}
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