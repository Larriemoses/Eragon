import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
}

interface AdminPageProps {
  token: string;
}

interface ProductCoupon {
  id: number;
  product: Product;
  title: string;
  code: string;
  discount: string;
  used_count: number;
  used_today: number;
}

const AdminPage: React.FC<AdminPageProps> = ({ token }) => {
  const [coupons, setCoupons] = useState<ProductCoupon[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState("");
  const [popup, setPopup] = useState<string | null>(null);
  const navigate = useNavigate();

  // Show popup for 2 seconds
  const showPopup = (msg: string) => {
    setPopup(msg);
    setTimeout(() => setPopup(null), 2000);
  };

  // Fetch products and coupons
  useEffect(() => {
    fetch("https://upgraded-rotary-phone-jggv9pw6p56hxgq-8000.app.github.dev/api/products", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then(setProducts);

    fetch("https://upgraded-rotary-phone-jggv9pw6p56hxgq-8000.app.github.dev/api/productcoupon/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then(setCoupons);
  }, [token]);

  // Add coupon
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!productId || !title || !code || !discount) {
      showPopup("All fields are required.");
      setLoading(false);
      return;
    }

    const res = await fetch("https://upgraded-rotary-phone-jggv9pw6p56hxgq-8000.app.github.dev/api/productcoupon/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        product: productId,
        title,
        code,
        discount,
      }),
    });
    if (res.ok) {
      const newCoupon = await res.json();
      const productObj = products.find((p) => p.id === newCoupon.product) || { id: newCoupon.product, name: "" };
      setCoupons([
        { ...newCoupon, product: productObj },
        ...coupons,
      ]);
      setTitle("");
      setCode("");
      setDiscount("");
      setProductId("");
      showPopup("Coupon added successfully!");
    } else {
      // Show backend error
      const errorData = await res.json();
      showPopup(
        typeof errorData === "string"
          ? errorData
          : Object.values(errorData).flat().join(" ")
      );
    }
    setLoading(false);
  };

  // Add product handler
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.trim()) return;
    const res = await fetch("https://upgraded-rotary-phone-jggv9pw6p56hxgq-8000.app.github.dev/api/products/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ name: newProduct }),
    });
    if (res.ok) {
      const product = await res.json();
      setProducts([product, ...products]);
      setNewProduct("");
      showPopup("Product added successfully!");
    }
  };

  // Delete coupon
  const handleDelete = async (id: number) => {
    await fetch(`https://upgraded-rotary-phone-jggv9pw6p56hxgq-8000.app.github.dev/api/productcoupon/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    });
    setCoupons(coupons.filter((c) => c.id !== id));
    showPopup("Coupon deleted successfully!");
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
    window.location.reload();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Popup message */}
      {popup && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded shadow-lg z-50 transition-all">
          {popup}
        </div>
      )}
      <div className="bg-blue-500 text-white rounded-t px-6 py-4 text-center text-3xl font-bold">
        Coupon Management Dashboard
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-b shadow mb-6">
        {/* Responsive Logout Button */}
        <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2 mb-4">
          <button
            className="bg-red-500 px-4 py-2 rounded text-white w-full sm:w-auto"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Add Product Form */}
        <form
          onSubmit={handleAddProduct}
          className="mb-6 flex flex-col sm:flex-row gap-2 items-stretch sm:items-end"
        >
          <div className="flex-1 w-full">
            <label className="block mb-1 font-semibold">Add New Product:</label>
            <input
              className="w-full p-2 border rounded"
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full sm:w-auto"
          >
            Add Product
          </button>
        </form>

        {/* Add Coupon Form */}
        <form onSubmit={handleAdd} className="mb-6">
          <div className="mb-2 font-semibold">Add New Coupon</div>
          <label className="block mb-1">Product:</label>
          <select
            className="w-full mb-2 p-2 border rounded"
            value={productId}
            onChange={(e) => setProductId(Number(e.target.value))}
            required
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <label className="block mb-1">Offer:</label>
          <input
            className="w-full mb-2 p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter offer details"
            required
          />
          <label className="block mb-1">Code:</label>
          <input
            className="w-full mb-2 p-2 border rounded"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter coupon code"
            required
          />
          <label className="block mb-1">Discount:</label>
          <input
            className="w-full mb-4 p-2 border rounded"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="Enter discount (e.g. 10.00)"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Coupon"}
          </button>
        </form>
        <div>
          <div className="font-semibold mb-2">All Coupons</div>
          <div className="overflow-x-auto">
            {/* Table for small screens and up */}
            <table className="min-w-full bg-white border hidden sm:table">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-2 font-bold py-2">Product</th>
                  <th className="px-2 py-2">Offer</th>
                  <th className="px-2 py-2">Code</th>
                  <th className="px-2 py-2">Discount</th>
                  <th className="px-2 py-2">Clicks</th>
                  <th className="px-2 py-2">Today</th>
                  <th className="px-2 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-2 font-bold py-2">{c.product?.name}</td>
                    <td className="px-2 py-2">{c.title}</td>
                    <td className="px-2 py-2">{c.code}</td>
                    <td className="px-2 py-2">{c.discount}</td>
                    <td className="px-2 py-2">{c.used_count}</td>
                    <td className="px-2 py-2">{c.used_today}</td>
                    <td className="px-2 py-2">
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleDelete(c.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No coupons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Card layout for mobile */}
            <div className="sm:hidden flex flex-col gap-4">
              {coupons.length === 0 && (
                <div className="text-center py-4 border rounded">No coupons found.</div>
              )}
              {coupons.map((c) => (
                <div key={c.id} className="border rounded p-3 shadow bg-white">
                  <div className="font-bold text-blue-700 mb-1">{c.title}</div>
                  <div className="text-sm mb-1"><span className="font-semibold">Product:</span> {c.product?.name}</div>
                  <div className="text-sm mb-1"><span className="font-semibold">Code:</span> {c.code}</div>
                  <div className="text-sm mb-1"><span className="font-semibold">Discount:</span> {c.discount}</div>
                  <div className="flex flex-wrap gap-2 text-xs mt-2">
                    <span className="bg-gray-100 px-2 py-1 rounded">Clicks: {c.used_count}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">Today: {c.used_today}</span>
                  </div>
                  <button
                    className="mt-3 w-full bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;