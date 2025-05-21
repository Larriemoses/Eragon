import React, { useEffect, useState, useRef } from "react";

type Product = {
  id: number;
  name: string;
  logo: string | null;
  logo_url: string | null;
};

const BACKEND_URL = "https://eragon-backend.onrender.com";
const TOKEN = "5e94ab243b5cbc00546b6e026b51ba421550c5f4"; // Your API token

const LOGO_WIDTH = 120; // px, should match min-w-[120px]
const GAP = 48; // px, should match gap-12 (12*4)

const PopularStores: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [repeatCount, setRepeatCount] = useState(2);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/products/`, {
      headers: {
        Authorization: `Token ${TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  // Calculate how many times to repeat the logos to fill the marquee
  useEffect(() => {
    if (products.length && marqueeRef.current) {
      const containerWidth = marqueeRef.current.offsetWidth;
      const logoTotalWidth = products.length * (LOGO_WIDTH + GAP);
      const minRepeat = Math.ceil((containerWidth * 2) / logoTotalWidth);
      setRepeatCount(minRepeat > 2 ? minRepeat : 2);
    }
  }, [products]);

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
            minWidth: "200%",
            alignItems: "center",
          }}
        >
          {logos.map((product, idx) => {
            const logoSrc = product.logo
              ? `${BACKEND_URL}${product.logo}`
              : product.logo_url || "";
            return (
              <div key={product.id + "-" + idx} className="flex flex-col items-center min-w-[120px]">
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    alt={product.name}
                    className="h-12 md:h-16 object-contain mb-2"
                    draggable={false}
                  />
                ) : (
                  <div className="h-12 w-24 bg-gray-200 rounded" />
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