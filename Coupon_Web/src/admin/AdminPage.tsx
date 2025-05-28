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
  footer_section_effortless_savings_title?: string | null;
  footer_section_effortless_savings_description?: string | null;
  footer_section_how_to_use_title?: string | null;
  footer_section_how_to_use_steps?: string | null;
  footer_section_how_to_use_note?: string | null;
  footer_section_tips_title?: string | null;
  footer_section_tips_list?: string | null;
  footer_section_contact_title?: string | null;
  footer_section_contact_description?: string | null;
  footer_contact_phone?: string | null;
  footer_contact_email?: string | null;
  footer_contact_whatsapp?: string | null;
  social_facebook_url?: string | null;
  social_twitter_url?: string | null;
  social_instagram_url?: string | null;
  main_affiliate_url?: string | null; // <--- ADDED: New field for Product interface
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
  shop_now_url?: string | null;
}

const AdminPage: React.FC<AdminPageProps> = ({ token }) => {
  const [coupons, setCoupons] = useState<ProductCoupon[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [shopNowUrl, setShopNowUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [subSubTitle, setSubSubTitle] = useState("");
  const [editingCoupon, setEditingCoupon] = useState<ProductCoupon | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const navigate = useNavigate();

  const [footerEffortlessSavingsTitle, setFooterEffortlessSavingsTitle] = useState("");
  const [footerEffortlessSavingsDescription, setFooterEffortlessSavingsDescription] = useState("");
  const [footerHowToUseTitle, setFooterHowToUseTitle] = useState("");
  const [footerHowToUseSteps, setFooterHowToUseSteps] = useState("");
  const [footerHowToUseNote, setFooterHowToUseNote] = useState("");
  const [footerTipsTitle, setFooterTipsTitle] = useState("");
  const [footerTipsList, setFooterTipsList] = useState("");
  const [footerContactTitle, setFooterContactTitle] = useState("");
  const [footerContactDescription, setFooterContactDescription] = useState("");
  const [footerContactPhone, setFooterContactPhone] = useState("");
  const [footerContactEmail, setFooterContactEmail] = useState("");
  const [footerContactWhatsapp, setFooterContactWhatsapp] = useState("");

  const [socialFacebookUrl, setSocialFacebookUrl] = useState("");
  const [socialTwitterUrl, setSocialTwitterUrl] = useState("");
  const [socialInstagramUrl, setSocialInstagramUrl] = useState("");
  const [mainAffiliateUrl, setMainAffiliateUrl] = useState(""); // <--- ADDED: New state for main affiliate URL

  const showPopup = (msg: string) => {
    setPopup(msg);
    setTimeout(() => setPopup(null), 2000);
  };

  const clearProductForm = () => {
    setName("");
    setLogo(null);
    setLogoUrl("");
    setTitle("");
    setSubtitle("");
    setSubSubTitle("");
    setFooterEffortlessSavingsTitle("");
    setFooterEffortlessSavingsDescription("");
    setFooterHowToUseTitle("");
    setFooterHowToUseSteps("");
    setFooterHowToUseNote("");
    setFooterTipsTitle("");
    setFooterTipsList("");
    setFooterContactTitle("");
    setFooterContactDescription("");
    setFooterContactPhone("");
    setFooterContactEmail("");
    setFooterContactWhatsapp("");
    setSocialFacebookUrl("");
    setSocialTwitterUrl("");
    setSocialInstagramUrl("");
    setMainAffiliateUrl(""); // <--- ADDED: Clear mainAffiliateUrl
    setEditingProduct(null);
  };

  // Helper function for full logo URL (unified logic)
  const getFullLogoUrl = (logoPath?: string | null) => {
    const BACKEND_URL = "https://eragon-backend1.onrender.com";
    if (logoPath) {
      if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
        return logoPath;
      }
      if (logoPath.startsWith('/')) {
        return `${BACKEND_URL}${logoPath}`;
      }
      return `${BACKEND_URL}/${logoPath}`;
    }
    return undefined;
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const productsRes = await fetch("https://eragon-backend1.onrender.com/api/products/", {
          headers: { Authorization: `Token ${token}` },
        });
        // Ensure that fetchedProducts is an array of Product type
        const fetchedProducts: Product[] = (await productsRes.json()) as Product[];
        setProducts(fetchedProducts);

        const couponsRes = await fetch("https://eragon-backend1.onrender.com/api/productcoupon/", {
          headers: { Authorization: `Token ${token}` },
        });
        const fetchedCoupons: any[] = await couponsRes.json();

        const enrichedCoupons: ProductCoupon[] = fetchedCoupons.map(coupon => {
          const productDetail = fetchedProducts.find(p => p.id === coupon.product) || {
            id: coupon.product,
            name: "Unknown Product",
            logo: null,
            logo_url: null,
            title: "",
            subtitle: "",
            sub_subtitle: "",
            footer_section_effortless_savings_title: null,
            footer_section_effortless_savings_description: null,
            footer_section_how_to_use_title: null,
            footer_section_how_to_use_steps: null,
            footer_section_how_to_use_note: null,
            footer_section_tips_title: null,
            footer_section_tips_list: null,
            footer_section_contact_title: null,
            footer_section_contact_description: null,
            footer_contact_phone: null,
            footer_contact_email: null,
            footer_contact_whatsapp: null,
            social_facebook_url: null,
            social_twitter_url: null,
            social_instagram_url: null,
            main_affiliate_url: null, // <--- ADDED: Default for new field
          };
          return { ...coupon, product: productDetail };
        });
        setCoupons(enrichedCoupons);

      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        showPopup("Failed to load data. Please try again.");
      }
    };

    fetchAdminData();
  }, [token]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!productId || !title || !discount) {
      showPopup("Product, Title, and Discount are required for coupons.");
      setLoading(false);
      return;
    }

    const res = await fetch("https://eragon-backend1.onrender.com/api/productcoupon/", {
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
        shop_now_url: shopNowUrl,
      }),
    });
    if (res.ok) {
      const newCoupon = await res.json();
      const productObj = products.find((p) => p.id === newCoupon.product) || {
        id: newCoupon.product,
        name: "Unknown Product",
        logo: null,
        logo_url: null,
        title: "",
        subtitle: "",
        sub_subtitle: "",
        footer_section_effortless_savings_title: null,
        footer_section_effortless_savings_description: null,
        footer_section_how_to_use_title: null,
        footer_section_how_to_use_steps: null,
        footer_section_how_to_use_note: null,
        footer_section_tips_title: null,
        footer_section_tips_list: null,
        footer_section_contact_title: null,
        footer_section_contact_description: null,
        footer_contact_phone: null,
        footer_contact_email: null,
        footer_contact_whatsapp: null,
        social_facebook_url: null,
        social_twitter_url: null,
        social_instagram_url: null,
        main_affiliate_url: null, // <--- ADDED: Default for new field
      };
      setCoupons([
        { ...newCoupon, product: productObj },
        ...coupons,
      ]);
      setTitle("");
      setCode("");
      setDiscount("");
      setProductId("");
      setShopNowUrl("");
      showPopup("Coupon added successfully!");
    } else {
      const errorData = await res.json();
      showPopup(
        typeof errorData === "string"
          ? errorData
          : Object.values(errorData).flat().join(" ")
      );
    }
    setLoading(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name.trim()) {
      showPopup("Product Name is required.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (logo) formData.append("logo", logo);
    if (logoUrl) formData.append("logo_url", logoUrl);
    if (title) formData.append("title", title);
    if (subtitle) formData.append("subtitle", subtitle);
    if (subSubTitle) formData.append("sub_subtitle", subSubTitle);

    if (footerEffortlessSavingsTitle) formData.append("footer_section_effortless_savings_title", footerEffortlessSavingsTitle);
    if (footerEffortlessSavingsDescription) formData.append("footer_section_effortless_savings_description", footerEffortlessSavingsDescription);
    if (footerHowToUseTitle) formData.append("footer_section_how_to_use_title", footerHowToUseTitle);
    if (footerHowToUseSteps) formData.append("footer_section_how_to_use_steps", footerHowToUseSteps);
    if (footerHowToUseNote) formData.append("footer_section_how_to_use_note", footerHowToUseNote);
    if (footerTipsTitle) formData.append("footer_section_tips_title", footerTipsTitle);
    if (footerTipsList) formData.append("footer_section_tips_list", footerTipsList);
    if (footerContactTitle) formData.append("footer_section_contact_title", footerContactTitle);
    if (footerContactDescription) formData.append("footer_section_contact_description", footerContactDescription);
    if (footerContactPhone) formData.append("footer_contact_phone", footerContactPhone);
    if (footerContactEmail) formData.append("footer_contact_email", footerContactEmail);
    if (footerContactWhatsapp) formData.append("footer_contact_whatsapp", footerContactWhatsapp);

    if (socialFacebookUrl) formData.append("social_facebook_url", socialFacebookUrl);
    if (socialTwitterUrl) formData.append("social_twitter_url", socialTwitterUrl);
    if (socialInstagramUrl) formData.append("social_instagram_url", socialInstagramUrl);
    // <--- ADDED: Append main_affiliate_url to formData ---
    if (mainAffiliateUrl) formData.append("main_affiliate_url", mainAffiliateUrl);
    // <--- END ADDED ---

    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct ? `https://eragon-backend1.onrender.com/api/products/${editingProduct.id}/` : "https://eragon-backend1.onrender.com/api/products/";

    const res = await fetch(url, {
      method: method,
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      const product = await res.json();
      if (editingProduct) {
        setProducts(products.map(p => p.id === product.id ? product : p));
        showPopup("Product updated successfully!");
      } else {
        setProducts([product, ...products]);
        showPopup("Product added successfully!");
      }
      clearProductForm();
    } else {
      const errorData = await res.json();
      console.error(`Error ${editingProduct ? "updating" : "adding"} product:`, errorData);
      showPopup(
        typeof errorData === "string"
          ? errorData
          : Object.values(errorData).flat().join(" ")
      );
    }
    setLoading(false);
  };

  const handleEditProduct = (productToEdit: Product) => {
    setEditingProduct(productToEdit);
    setName(productToEdit.name);
    setLogoUrl(productToEdit.logo_url || productToEdit.logo || '');
    setTitle(productToEdit.title || '');
    setSubtitle(productToEdit.subtitle || '');
    setSubSubTitle(productToEdit.sub_subtitle || '');

    setFooterEffortlessSavingsTitle(productToEdit.footer_section_effortless_savings_title || '');
    setFooterEffortlessSavingsDescription(productToEdit.footer_section_effortless_savings_description || '');
    setFooterHowToUseTitle(productToEdit.footer_section_how_to_use_title || '');
    setFooterHowToUseSteps(productToEdit.footer_section_how_to_use_steps || '');
    setFooterHowToUseNote(productToEdit.footer_section_how_to_use_note || '');
    setFooterTipsTitle(productToEdit.footer_section_tips_title || '');
    setFooterTipsList(productToEdit.footer_section_tips_list || '');

    setFooterContactTitle(productToEdit.footer_section_contact_title || '');
    setFooterContactDescription(productToEdit.footer_section_contact_description || '');
    setFooterContactPhone(productToEdit.footer_contact_phone || '');
    setFooterContactEmail(productToEdit.footer_contact_email || '');
    setFooterContactWhatsapp(productToEdit.footer_contact_whatsapp || '');

    setSocialFacebookUrl(productToEdit.social_facebook_url || '');
    setSocialTwitterUrl(productToEdit.social_twitter_url || '');
    setSocialInstagramUrl(productToEdit.social_instagram_url || '');
    setMainAffiliateUrl(productToEdit.main_affiliate_url || ''); // <--- ADDED: Set mainAffiliateUrl when editing
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product and all its associated coupons?")) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://eragon-backend1.onrender.com/api/products/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        setCoupons(coupons.filter(c => c.product.id !== id));
        showPopup("Product deleted successfully!");
      } else {
        const errorData = await res.json();
        showPopup(
          typeof errorData === "string"
            ? errorData
            : Object.values(errorData).flat().join(" ")
        );
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      showPopup("Failed to delete product.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (coupon: ProductCoupon) => {
    setEditingCoupon(coupon);
    setProductId(coupon.product.id);
    setTitle(coupon.title);
    setCode(coupon.code);
    setDiscount(coupon.discount);
    setShopNowUrl(coupon.shop_now_url || '');
  };

  const handleUpdateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!editingCoupon || !productId || !title || !discount) {
      showPopup("All fields are required for update.");
      setLoading(false);
      return;
    }

    const res = await fetch(`https://eragon-backend1.onrender.com/api/productcoupon/${editingCoupon.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        product: productId,
        title,
        code,
        discount,
        shop_now_url: shopNowUrl,
      }),
    });

    if (res.ok) {
      const updatedCoupon = await res.json();
      const productObj = products.find((p) => p.id === updatedCoupon.product) || {
        id: updatedCoupon.product,
        name: "Unknown Product",
        logo: null,
        logo_url: null,
        title: "",
        subtitle: "",
        sub_subtitle: "",
        footer_section_effortless_savings_title: null,
        footer_section_effortless_savings_description: null,
        footer_section_how_to_use_title: null,
        footer_section_how_to_use_steps: null,
        footer_section_how_to_use_note: null,
        footer_section_tips_title: null,
        footer_section_tips_list: null,
        footer_section_contact_title: null,
        footer_section_contact_description: null,
        footer_contact_phone: null,
        footer_contact_email: null,
        footer_contact_whatsapp: null,
        social_facebook_url: null,
        social_twitter_url: null,
        social_instagram_url: null,
        main_affiliate_url: null, // <--- ADDED: Default for new field
      };

      setCoupons(
        coupons.map((c) =>
          c.id === updatedCoupon.id ? { ...updatedCoupon, product: productObj } : c
        )
      )
      setEditingCoupon(null);
      setTitle("");
      setCode("");
      setDiscount("");
      setProductId("");
      setShopNowUrl("");
      showPopup("Coupon updated successfully!");
    } else {
      const errorData = await res.json();
      showPopup(
        typeof errorData === "string"
          ? errorData
          : Object.values(errorData).flat().join(" ")
      );
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await fetch(`https://eragon-backend1.onrender.com/api/productcoupon/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Token ${token}` },
    });
    setCoupons(coupons.filter((c) => c.id !== id));
    showPopup("Coupon deleted successfully!");
  };

  const handleLogout = () => {
      localStorage.removeItem("adminToken");
      navigate("/admin-login");
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {popup && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded shadow-lg z-50 transition-all">
          {popup}
        </div>
      )}
      <div className="bg-blue-500 text-white rounded-t px-6 py-4 text-center text-3xl font-bold">
        Admin Management Dashboard
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-b shadow mb-6">
        <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2 mb-4">
          <button
            className="bg-red-500 px-4 py-2 rounded text-white w-full sm:w-auto"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <form onSubmit={handleAddProduct} className="mb-6 flex flex-col gap-2">
          <h2 className="text-xl font-semibold mb-2">{editingProduct ? `Edit Product: ${editingProduct.name}` : "Add New Product"}</h2>
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
          {logoUrl && !logo && (
            <p className="text-sm text-gray-500">
              Current Logo URL: <a href={logoUrl} target="_blank" rel="noopener noreferrer" className="underline">{logoUrl}</a>
            </p>
          )}
          <input
            type="text"
            placeholder="Logo URL (optional, overrides file if both chosen)"
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

          {/* --- ADDED: Input for Main Affiliate URL --- */}
          <h3 className="text-lg font-semibold mt-4 mb-2">Main Affiliate Link (for logo/socials)</h3>
          <input
            type="url"
            placeholder="Main Affiliate URL (e.g., https://yourbrand.com/affiliate/)"
            value={mainAffiliateUrl}
            onChange={(e) => setMainAffiliateUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {/* --- END ADDED --- */}

          <h3 className="text-lg font-semibold mt-4 mb-2">Product Footer Content</h3>
          <input
            type="text"
            placeholder="Effortless Savings Title (e.g., Effortless Savings<br />Start Here)"
            value={footerEffortlessSavingsTitle}
            onChange={(e) => setFooterEffortlessSavingsTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Effortless Savings Description"
            value={footerEffortlessSavingsDescription}
            onChange={(e) => setFooterEffortlessSavingsDescription(e.target.value)}
            className="w-full p-2 border rounded h-24"
          />
          <input
            type="text"
            placeholder="How to Use Title (e.g., How to Use Your<br />Oraimo Discount Code)"
            value={footerHowToUseTitle}
            onChange={(e) => setFooterHowToUseTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="How to Use Steps (Enter one step per line)"
            value={footerHowToUseSteps}
            onChange={(e) => setFooterHowToUseSteps(e.target.value)}
            className="w-full p-2 border rounded h-24"
          />
          <textarea
            placeholder="How to Use Note (e.g., NOTE: There are instances...)"
            value={footerHowToUseNote}
            onChange={(e) => setFooterHowToUseNote(e.target.value)}
            className="w-full p-2 border rounded h-20"
          />
          <input
            type="text"
            placeholder="Tips Title (e.g., Tips for Getting the<br />Best Oraimo Deals)"
            value={footerTipsTitle}
            onChange={(e) => setFooterTipsTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Tips List (Enter one tip per line)"
            value={footerTipsList}
            onChange={(e) => setFooterTipsList(e.target.value)}
            className="w-full p-2 border rounded h-24"
          />
          <input
            type="text"
            placeholder="Contact Title (e.g., Need Help? Here’s How to<br />Contact Oraimo Customer Care)"
            value={footerContactTitle}
            onChange={(e) => setFooterContactTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Contact Description"
            value={footerContactDescription}
            onChange={(e) => setFooterContactDescription(e.target.value)}
            className="w-full p-2 border rounded h-20"
          />
          <input
            type="text"
            placeholder="Contact Phone"
            value={footerContactPhone}
            onChange={(e) => setFooterContactPhone(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Contact Email"
            value={footerContactEmail}
            onChange={(e) => setFooterContactEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Contact Whatsapp"
            value={footerContactWhatsapp}
            onChange={(e) => setFooterContactWhatsapp(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <h3 className="text-lg font-semibold mt-4 mb-2">Social Media Links</h3>
          <input
            type="url"
            placeholder="Facebook URL (e.g., https://facebook.com/yourpage)"
            value={socialFacebookUrl}
            onChange={(e) => setSocialFacebookUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="url"
            placeholder="Twitter URL (e.g., https://twitter.com/yourhandle)"
            value={socialTwitterUrl}
            onChange={(e) => setSocialTwitterUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="url"
            placeholder="Instagram URL (e.g., https://instagram.com/youraccount)"
            value={socialInstagramUrl}
            onChange={(e) => setSocialInstagramUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex-1"
              disabled={loading}
            >
              {loading ? (editingProduct ? "Updating Product..." : "Adding Product...") : (editingProduct ? "Update Product" : "Add Product")}
            </button>
            {editingProduct && (
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 flex-none"
                onClick={clearProductForm}
                disabled={loading}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <h2 className="text-xl font-semibold mb-2 mt-6">Existing Products</h2>
        <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border">
                <thead>
                    <tr className="bg-blue-500 text-white">
                        <th className="px-2 py-2 text-left">ID</th>
                        <th className="px-2 py-2 text-left">Name</th>
                        <th className="px-2 py-2 text-left">Logo</th>
                        <th className="px-2 py-2 text-left">Title</th>
                        <th className="px-2 py-2 text-left">Main Link</th> {/* <--- ADDED: Table header for Main Link */}
                        <th className="px-2 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center py-4">No products added yet.</td> {/* <--- Updated colspan */}
                        </tr>
                    ) : (
                        products.map(p => (
                            <tr key={p.id} className="border-t">
                                <td className="px-2 py-2">{p.id}</td>
                                <td className="px-2 py-2">{p.name}</td>
                                <td className="px-2 py-2">
                                    {p.logo || p.logo_url ? (
                                        <img
                                            src={p.logo ?? p.logo_url ?? undefined}
                                            alt={p.name}
                                            className="w-10 h-10 object-contain rounded"
                                        />
                                    ) : (
                                        "N/A"
                                    )}
                                </td>
                                <td className="px-2 py-2">{p.title}</td>
                                {/* --- ADDED: Display Main Affiliate URL in table --- */}
                                <td className="px-2 py-2">
                                    {p.main_affiliate_url ? (
                                        <a
                                            href={p.main_affiliate_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline text-sm break-all"
                                            title={p.main_affiliate_url}
                                        >
                                            Link
                                        </a>
                                    ) : (
                                        "N/A"
                                    )}
                                </td>
                                {/* --- END ADDED --- */}
                                <td className="px-2 py-2 flex gap-2">
                                    <button
                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                        onClick={() => handleEditProduct(p)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        onClick={() => handleDeleteProduct(p.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>

        <form onSubmit={handleAdd} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Add New Coupon</h2>
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
            placeholder="Enter coupon code (optional)"
          />
          {/* --- ADDED: Shop Now URL input field --- */}
          <label className="block mb-1">Shop Now URL:</label>
          <input
            type="url"
            className="w-full mb-4 p-2 border rounded"
            value={shopNowUrl}
            onChange={(e) => setShopNowUrl(e.target.value)}
            placeholder="Enter full shop now URL (e.g., https://store.com/deal)"
          />
          {/* --- END ADDED --- */}
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

        {editingCoupon && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Edit Coupon</h2>
              <form onSubmit={handleUpdateCoupon}>
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
                {/* --- ADDED: Shop Now URL input field to Edit form --- */}
                <label className="block mb-1">Shop Now URL:</label>
                <input
                  type="url"
                  className="w-full mb-4 p-2 border rounded"
                  value={shopNowUrl}
                  onChange={(e) => setShopNowUrl(e.target.value)}
                  placeholder="Enter full shop now URL (e.g., https://store.com/deal)"
                />
                {/* --- END ADDED --- */}
                <label className="block mb-1">Discount:</label>
                <input
                  className="w-full mb-4 p-2 border rounded"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="Enter discount (e.g. 10.00)"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={() => setEditingCoupon(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Coupon"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-2">All Coupons</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border hidden sm:table">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="px-2 font-bold py-2">Product</th>
                  <th className="px-2 py-2">Offer</th>
                  <th className="px-2 py-2">Code</th>
                  <th className="px-2 py-2">Discount</th>
                  <th className="px-2 py-2">Link</th>
                  <th className="px-2 py-2">Clicks</th>
                  <th className="px-2 py-2">Today</th>
                  <th className="px-2 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-2 font-bold py-2 flex items-center gap-2">
                      {/* Using getFullLogoUrl helper for product logo */}
                      {c.product?.logo || c.product?.logo_url ? (
                        <img
                          src={getFullLogoUrl(c.product.logo ?? c.product.logo_url)}
                          alt={c.product.name}
                          className="w-6 h-6 object-contain rounded"
                          style={{ minWidth: 24, minHeight: 24 }}
                          onError={(e) => { e.currentTarget.src = `https://placehold.co/24x24/cccccc/ffffff?text=${c.product.name.charAt(0)}`; e.currentTarget.onerror = null; }}
                        />
                      ) : null}
                      {c.product?.name}
                    </td>
                    <td className="px-2 py-2">
                      <div className="font-bold text-blue-700">{c.title}</div>
                    </td>
                    <td className="px-2 py-2">{c.code}</td>
                    <td className="px-2 py-2">{c.discount}</td>
                    <td className="px-2 py-2">
                      {c.shop_now_url ? (
                        <a
                          href={c.shop_now_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-sm break-all"
                          title={c.shop_now_url}
                        >
                          Link
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-2 py-2">{c.used_count}</td>
                    <td className="px-2 py-2">{c.used_today}</td>
                    <td className="px-2 py-2 flex gap-2">
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        onClick={() => handleEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDelete(c.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      No coupons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

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
                  <div className="text-sm mb-1">
                    <span className="font-semibold">Link:</span>{" "}
                    {c.shop_now_url ? (
                      <a
                        href={c.shop_now_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline break-all"
                        title={c.shop_now_url}
                      >
                        {c.shop_now_url}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs mt-2">
                    <span className="bg-gray-100 px-2 py-1 rounded">Clicks: {c.used_count}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">Today: {c.used_today}</span>
                  </div>
                  <div className="flex gap-2 mt-3 w-full">
                    <button
                      className="flex-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      onClick={() => handleEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="flex-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </button>
                  </div>
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