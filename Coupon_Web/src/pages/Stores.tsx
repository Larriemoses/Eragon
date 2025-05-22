import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductFooter from "../components/ProductFooter";

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
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const [newStore, setNewStore] = useState({
    name: "",
    logo_url: "",
    title: "",
    subtitle: "",
    sub_subtitle: "",
  });

  useEffect(() => {
    fetch(API_URL, {
      headers: { Authorization: `Token ${API_TOKEN}` },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStore({ ...newStore, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${API_TOKEN}`,
        },
        body: JSON.stringify(newStore),
      });

      if (!response.ok) {
        throw new Error("Failed to submit store.");
      }

      const created = await response.json();
      setProducts((prev) => [...prev, created]);
      setSubmitted(true);
      setNewStore({
        name: "",
        logo_url: "",
        title: "",
        subtitle: "",
        sub_subtitle: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Stores</h1>

      {/* Store Submission Form */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-3 text-center">Submit a New Store</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Store Name"
            value={newStore.name}
            onChange={handleChange}
            required
            className="bg-gray-100 px-4 py-2 rounded"
          />
          <input
            type="text"
            name="logo_url"
            placeholder="Logo URL"
            value={newStore.logo_url}
            onChange={handleChange}
            className="bg-gray-100 px-4 py-2 rounded"
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newStore.title}
            onChange={handleChange}
            className="bg-gray-100 px-4 py-2 rounded"
          />
          <input
            type="text"
            name="subtitle"
            placeholder="Subtitle"
            value={newStore.subtitle}
            onChange={handleChange}
            className="bg-gray-100 px-4 py-2 rounded"
          />
          <input
            type="text"
            name="sub_subtitle"
            placeholder="Sub Subtitle"
            value={newStore.sub_subtitle}
            onChange={handleChange}
            className="bg-gray-100 px-4 py-2 rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 transition"
          >
            Submit Store
          </button>
          {submitted && (
            <p className="text-green-600 text-sm text-center">
              Store submitted successfully!
            </p>
          )}
        </form>
      </div>

      {/* Store Listings */}
      <div className="w-full max-w-5xl bg-gray-100 rounded-xl shadow p-6">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col items-center bg-white rounded-xl p-4 shadow hover:shadow-lg transition"
              >
                <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-lg mb-3">
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
                <div className="font-semibold text-center mb-2">
                  {product.name}
                </div>
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

      {/* Optional Footer */}
      <ProductFooter />
    </div>
  );
};

export default Store;
