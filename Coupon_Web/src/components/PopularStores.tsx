import React, { useEffect, useState, useRef } from "react";




type Product = {
  id: number;
  name: string;
  logo: string | null;
  logo_url: string | null;
};

const BACKEND_URL = "https://eragon-backend1.onrender.com";

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
  // We need to ensure we have at least two copies of the products for seamless loop
  // The repeatCount logic for width calculation is less critical now for the animation itself,
  // but could still be useful for ensuring enough content to fill the screen initially
  // before the loop starts. For a truly seamless loop, just duplicating once is sufficient.
  const marqueeInnerRef = useRef<HTMLDivElement>(null); // Ref for the inner animated div

  useEffect(() => {
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
        setProducts([]);
      });
  }, []);

  // Duplicate products for seamless looping
  // We need at least two sets of products to make the infinite loop work smoothly
  const duplicatedProducts = products.length > 0 ? [...products, ...products] : [];

  return (
    <div className="w-full py-8 bg-white">
      <h2 className="text-center text-xl md:text-2xl font-bold mb-6">Popular Stores</h2>
      {/* Outer container for overflow hidden */}
      <div className="overflow-hidden relative w-full">
        {/* Inner container that will be animated */}
        {products.length > 0 && ( // Only render if products are available
            <div
            ref={marqueeInnerRef} // Apply ref to the inner div
            className="flex gap-12 animate-marquee"
            style={{
                // Set minWidth to ensure it holds two copies of the content
                // The actual width will be determined by its children
                minWidth: 'fit-content', // Allow content to determine width
                // We will control the animation via CSS
            }}
            >
            {duplicatedProducts.map((product, idx) => {
                const logoSrc = product.logo || product.logo_url;
                // Use a combination of product.id and index for a unique key
                // when duplicating the list.
                return (
                <div key={`${product.id}-${idx}`} className="flex flex-col items-center min-w-[80px]">
                    {logoSrc ? (
                    <img
                        src={getFullLogoUrl(logoSrc)}
                        alt={product.name}
                        className="h-12 md:h-16 object-contain mb-2"
                        draggable={false}
                        onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/64x64/cccccc/ffffff?text=${product.name.charAt(0)}`;
                        e.currentTarget.onerror = null;
                        }}
                    />
                    ) : (
                    <div className="h-12 w-24 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                        {product.name.charAt(0)}
                    </div>
                    )}
                </div>
                );
            })}
            </div>
        )}
      </div>
      {/* Moved style block directly into the component or a global CSS file for better practice */}
     
    </div>
  );
};

export default PopularStores;