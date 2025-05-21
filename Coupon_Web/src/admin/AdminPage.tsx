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
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [subSubTitle, setSubSubTitle] = useState("");
  const navigate = useNavigate();

  // Show popup for 2 seconds
  const showPopup = (msg: string) => {
    setPopup(msg);
    setTimeout(() => setPopup(null), 2000);
  };

  // Fetch products and coupons
  useEffect(() => {
    fetch("http://localhost:8000/api/products", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then(setProducts);

    fetch("http://localhost:8000/api/productcoupon/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then(setCoupons);
  }, [token]);

  // Add coupon
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!productId || !title || !discount) {
      showPopup("All fields are required.");
      setLoading(false);
      return;
    }

    const res = await fetch("http://localhost:8000/api/productcoupon/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        product: productId,
        title,
        code, // code can be empty string or null
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
    if (!name.trim()) return;

    const formData = new FormData();
    formData.append("name", name);
    if (logo) formData.append("logo", logo);
    formData.append("logo_url", logoUrl);
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("sub_subtitle", subSubTitle);

    const res = await fetch("http://localhost:8000/api/products/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    });
    if (res.ok) {
      const product = await res.json();
      setProducts([product, ...products]);
      setName("");
      setLogo(null);
      setLogoUrl("");
      setTitle("");
      setSubtitle("");
      setSubSubTitle("");
      showPopup("Product added successfully!");
    }
  };

  // Delete coupon
  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/api/productcoupon/${id}/`, {
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
        <form onSubmit={handleAddProduct} className="mb-6 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Logo URL"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Sub-sub-title"
            value={subSubTitle}
            onChange={(e) => setSubSubTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
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
                    <td className="px-2 font-bold py-2 flex items-center gap-2">
                      {c.product?.logo || c.product?.logo_url ? (
                        <img
                          src={c.product.logo ?? c.product.logo_url ?? undefined}
                          alt={c.product.name}
                          className="w-6 h-6 object-contain rounded"
                          style={{ minWidth: 24, minHeight: 24 }}
                        />
                      ) : null}
                      {c.product?.name}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        {c.product?.logo || c.product?.logo_url ? (
                          <img
                            src={c.product.logo ?? c.product.logo_url ?? undefined}
                            alt={c.product.name}
                            className="w-6 h-6 object-contain rounded"
                            style={{ minWidth: 24, minHeight: 24 }}
                          />
                        ) : null}
                        <span className="font-bold text-blue-700">{c.title}</span>
                      </div>
                      <div>
                        <div className="font-bold">{c.product.title}</div>
                        <div className="text-sm">{c.product.subtitle}</div>
                        <div className="text-xs text-gray-500">{c.product.sub_subtitle}</div>
                      </div>
                    </td>
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