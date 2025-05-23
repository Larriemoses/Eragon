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

const API_TOKEN = "5e94ab243b5cbc00546b6e026b51ba421550c5f4";
const API_URL = "https://eragon-backend1.onrender.com/api/products/";

const Store: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

    useEffect(() => {
    fetch(API_URL, {
      headers: { Authorization: `Token ${API_TOKEN}` },
       })
       
            .then((res) => res.json())
      .then((data) => setProducts(data))
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
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col items-center bg-gray-50 rounded-xl p-4 shadow hover:shadow-lg transition"
              >
                <div className="w-20 h-20 flex items-center justify-center bg-white rounded-lg mb-3 ">
                  {product.logo || product.logo_url ? (
                    <img
                      src={product.logo ?? product.logo_url ?? undefined}
                      alt={product.name}
                      className="max-w-[60px] max-h-[60px] object-contain"
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
            ))}
          </div>
        )}
      </div>

          </div>
  );
};

export default Store;
      