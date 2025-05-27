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
  // --- New fields for dynamic footer content (matching backend model) ---
  // When fetched, these will be string[] from JSONField
  footer_section_effortless_savings_title?: string | null;
  footer_section_effortless_savings_description?: string | null;
  footer_section_how_to_use_title?: string | null;
  footer_section_how_to_use_steps?: string[]; // Defined as string[], which is correct for array-like data
  footer_section_how_to_use_note?: string | null;
  footer_section_tips_title?: string | null;
  footer_section_tips_list?: string[]; // Defined as string[], which is correct for array-like data
  footer_section_contact_title?: string | null;
  footer_section_contact_description?: string | null;
  footer_contact_phone?: string | null;
  footer_contact_email?: string | null;
  footer_contact_whatsapp?: string | null;
  // --- NEW: Social Media Links ---
  social_facebook_url?: string | null;
  social_twitter_url?: string | null;
  social_instagram_url?: string | null;
  // --- End of new fields ---
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
  const [popup, setPopup] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [subSubTitle, setSubSubTitle] = useState("");
  const [editingCoupon, setEditingCoupon] = useState<ProductCoupon | null>(null);
  // Add a state for which product is being edited/created in the product form
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const navigate = useNavigate();

  // --- New state variables for footer content (all plain strings now) ---
  const [footerEffortlessSavingsTitle, setFooterEffortlessSavingsTitle] = useState("");
  const [footerEffortlessSavingsDescription, setFooterEffortlessSavingsDescription] = useState("");
  const [footerHowToUseTitle, setFooterHowToUseTitle] = useState("");
  const [footerHowToUseSteps, setFooterHowToUseSteps] = useState(""); // Plain text (newline separated)
  const [footerHowToUseNote, setFooterHowToUseNote] = useState("");
  const [footerTipsTitle, setFooterTipsTitle] = useState("");
  const [footerTipsList, setFooterTipsList] = useState(""); // Plain text (newline separated)
  const [footerContactTitle, setFooterContactTitle] = useState("");
  const [footerContactDescription, setFooterContactDescription] = useState("");
  const [footerContactPhone, setFooterContactPhone] = useState("");
  const [footerContactEmail, setFooterContactEmail] = useState("");
  const [footerContactWhatsapp, setFooterContactWhatsapp] = useState("");
  // --- End of new state variables ---

  // --- NEW: State variables for Social Media Links ---
  const [socialFacebookUrl, setSocialFacebookUrl] = useState("");
  const [socialTwitterUrl, setSocialTwitterUrl] = useState("");
  const [socialInstagramUrl, setSocialInstagramUrl] = useState("");
  // --- End of NEW state variables ---

  // Show popup for 2 seconds
  const showPopup = (msg: string) => {
    setPopup(msg);
    setTimeout(() => setPopup(null), 2000);
  };

  // Helper to clear product form fields
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
    // --- NEW: Clear social media fields ---
    setSocialFacebookUrl("");
    setSocialTwitterUrl("");
    setSocialInstagramUrl("");
    // --- End of NEW ---
    setEditingProduct(null); // Clear editing state
  };

  // Fetch products and coupons
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Fetch products first
        const productsRes = await fetch("https://eragon-backend1.onrender.com/api/products", {
          headers: { Authorization: `Token ${token}` },
        });
        const fetchedProducts: Product[] = await productsRes.json();
        setProducts(fetchedProducts);

        // Then fetch coupons
        const couponsRes = await fetch("https://eragon-backend1.onrender.com/api/productcoupon/", {
          headers: { Authorization: `Token ${token}` },
        });
        const fetchedCoupons: any[] = await couponsRes.json(); // Use any[] temporarily for the raw response

        // Enrich coupons with product details
        const enrichedCoupons: ProductCoupon[] = fetchedCoupons.map(coupon => {
          const productDetail = fetchedProducts.find(p => p.id === coupon.product) || {
            id: coupon.product, // Keep the ID even if product not found
            name: "Unknown Product", // Default name if product not found
            logo: null,
            logo_url: null,
            title: "",
            subtitle: "",
            sub_subtitle: "",
            // Provide default values for new footer fields to avoid undefined errors
            footer_section_effortless_savings_title: null,
            footer_section_effortless_savings_description: null,
            footer_section_how_to_use_title: null,
            // FIX: Ensure these defaults are arrays.
            footer_section_how_to_use_steps: [],
            footer_section_how_to_use_note: null,
            footer_section_tips_title: null,
            // FIX: Ensure these defaults are arrays.
            footer_section_tips_list: [],
            footer_section_contact_title: null,
            footer_section_contact_description: null,
            footer_contact_phone: null,
            footer_contact_email: null,
            footer_contact_whatsapp: null,
            // --- NEW: Default values for social media fields ---
            social_facebook_url: null,
            social_twitter_url: null,
            social_instagram_url: null,
            // --- End of NEW ---
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

  // Add coupon
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!productId || !title || !discount) {
      showPopup("All fields are required.");
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
        code, // code can be empty string or null
        discount,
      }),
    });
    if (res.ok) {
      const newCoupon = await res.json();
      // Ensure newCoupon.product is a full Product object
      const productObj = products.find((p) => p.id === newCoupon.product) || {
        id: newCoupon.product,
        name: "Unknown Product",
        logo: null,
        logo_url: null,
        title: "",
        subtitle: "",
        sub_subtitle: "",
        // Default values for footer fields
        footer_section_effortless_savings_title: null,
        footer_section_effortless_savings_description: null,
        footer_section_how_to_use_title: null,
        // FIX: Ensure these defaults are arrays.
        footer_section_how_to_use_steps: [],
        footer_section_how_to_use_note: null,
        footer_section_tips_title: null,
        // FIX: Ensure these defaults are arrays.
        footer_section_tips_list: [],
        footer_section_contact_title: null,
        footer_section_contact_description: null,
        footer_contact_phone: null,
        footer_contact_email: null,
        footer_contact_whatsapp: null,
        // --- NEW: Default values for social media fields ---
        social_facebook_url: null,
        social_twitter_url: null,
        social_instagram_url: null,
        // --- End of NEW ---
      };
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

  // Add/Update product handler
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

    // --- CRITICAL FIX: Sending newline-separated strings for JSONField ---
    if (footerEffortlessSavingsTitle) formData.append("footer_section_effortless_savings_title", footerEffortlessSavingsTitle);
    if (footerEffortlessSavingsDescription) formData.append("footer_section_effortless_savings_description", footerEffortlessSavingsDescription);
    if (footerHowToUseTitle) formData.append("footer_section_how_to_use_title", footerHowToUseTitle);
    // Send plain string for JSONField, backend StringToListField will parse
    if (footerHowToUseSteps) formData.append("footer_section_how_to_use_steps", footerHowToUseSteps);
    if (footerHowToUseNote) formData.append("footer_section_how_to_use_note", footerHowToUseNote);
    if (footerTipsTitle) formData.append("footer_section_tips_title", footerTipsTitle);
    // Send plain string for JSONField, backend StringToListField will parse
    if (footerTipsList) formData.append("footer_section_tips_list", footerTipsList);
    if (footerContactTitle) formData.append("footer_section_contact_title", footerContactTitle);
    if (footerContactDescription) formData.append("footer_section_contact_description", footerContactDescription);
    if (footerContactPhone) formData.append("footer_contact_phone", footerContactPhone);
    if (footerContactEmail) formData.append("footer_contact_email", footerContactEmail);
    if (footerContactWhatsapp) formData.append("footer_contact_whatsapp", footerContactWhatsapp);
    // --- End of new fields for Product Footer content ---

    // --- NEW: Append social media URLs to formData ---
    if (socialFacebookUrl) formData.append("social_facebook_url", socialFacebookUrl);
    if (socialTwitterUrl) formData.append("social_twitter_url", socialTwitterUrl);
    if (socialInstagramUrl) formData.append("social_instagram_url", socialInstagramUrl);
    // --- End of NEW ---

    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct ? `https://eragon-backend1.onrender.com/api/products/${editingProduct.id}/` : "https://eragon-backend1.onrender.com/api/products/";

    const res = await fetch(url, {
      method: method,
      headers: {
        Authorization: `Token ${token}`,
        // Note: For FormData, browser automatically sets Content-Type: multipart/form-data with boundary
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
      clearProductForm(); // Clear all fields after successful operation
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

  // Handler to set form fields for product editing
  const handleEditProduct = (productToEdit: Product) => {
    setEditingProduct(productToEdit);
    setName(productToEdit.name);
    // Logo file cannot be pre-filled, but URL can be
    setLogoUrl(productToEdit.logo_url || productToEdit.logo || '');
    setTitle(productToEdit.title || '');
    setSubtitle(productToEdit.subtitle || '');
    setSubSubTitle(productToEdit.sub_subtitle || '');

    // --- FIX START ---
    // Ensure these are always treated as arrays before joining.
    // This addresses the "map is not a function" error for existing data.
    const howToUseSteps = Array.isArray(productToEdit.footer_section_how_to_use_steps)
        ? productToEdit.footer_section_how_to_use_steps
        : []; // Default to empty array if not an array

    const tipsList = Array.isArray(productToEdit.footer_section_tips_list)
        ? productToEdit.footer_section_tips_list
        : []; // Default to empty array if not an array

    setFooterEffortlessSavingsTitle(productToEdit.footer_section_effortless_savings_title || '');
    setFooterEffortlessSavingsDescription(productToEdit.footer_section_effortless_savings_description || '');
    setFooterHowToUseTitle(productToEdit.footer_section_how_to_use_title || '');
    setFooterHowToUseSteps(howToUseSteps.join('\n')); // Now safe to call .join
    setFooterHowToUseNote(productToEdit.footer_section_how_to_use_note || '');
    setFooterTipsTitle(productToEdit.footer_section_tips_title || '');
    setFooterTipsList(tipsList.join('\n')); // Now safe to call .join
    // --- FIX END ---

    setFooterContactTitle(productToEdit.footer_section_contact_title || '');
    setFooterContactDescription(productToEdit.footer_section_contact_description || '');
    setFooterContactPhone(productToEdit.footer_contact_phone || '');
    setFooterContactEmail(productToEdit.footer_contact_email || '');
    setFooterContactWhatsapp(productToEdit.footer_contact_whatsapp || '');

    // --- NEW: Populate social media fields for editing ---
    setSocialFacebookUrl(productToEdit.social_facebook_url || '');
    setSocialTwitterUrl(productToEdit.social_twitter_url || '');
    setSocialInstagramUrl(productToEdit.social_instagram_url || '');
    // --- End of NEW ---
  };

  // Delete product handler
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
        setCoupons(coupons.filter(c => c.product.id !== id)); // Also remove associated coupons
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


  // Edit coupon handler (opens the modal/form)
  const handleEdit = (coupon: ProductCoupon) => {
    setEditingCoupon(coupon);
    setProductId(coupon.product.id); // Use the ID from the enriched product object
    setTitle(coupon.title);
    setCode(coupon.code);
    setDiscount(coupon.discount);
  };

  // Update coupon handler (submits the changes)
  const handleUpdateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!editingCoupon || !productId || !title || !discount) {
      showPopup("All fields are required for update.");
      setLoading(false);
      return;
    }

    const res = await fetch(`https://eragon-backend1.onrender.com/api/productcoupon/${editingCoupon.id}/`, {
      method: "PUT", // Use PUT for full updates, PATCH for partial
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        product: productId, // Send the product ID back to the backend
        title,
        code,
        discount,
      }),
    });

    if (res.ok) {
      const updatedCoupon = await res.json();
      // Enrich the updated coupon with full product details
      const productObj = products.find((p) => p.id === updatedCoupon.product) || {
        id: updatedCoupon.product,
        name: "Unknown Product",
        logo: null,
        logo_url: null,
        title: "",
        subtitle: "",
        sub_subtitle: "",
        // Default values for footer fields
        footer_section_effortless_savings_title: null,
        footer_section_effortless_savings_description: null,
        footer_section_how_to_use_title: null,
        // FIX: Ensure these defaults are arrays.
        footer_section_how_to_use_steps: [],
        footer_section_how_to_use_note: null,
        footer_section_tips_title: null,
        // FIX: Ensure these defaults are arrays.
        footer_section_tips_list: [],
        footer_section_contact_title: null,
        footer_section_contact_description: null,
        footer_contact_phone: null,
        footer_contact_email: null,
        footer_contact_whatsapp: null,
        // --- NEW: Default values for social media fields ---
        social_facebook_url: null,
        social_twitter_url: null,
        social_instagram_url: null,
        // --- End of NEW ---
      };

      setCoupons(
        coupons.map((c) =>
          c.id === updatedCoupon.id ? { ...updatedCoupon, product: productObj } : c
        )
      )
      setEditingCoupon(null); // Close the edit form/modal
      setTitle("");
      setCode("");
      setDiscount("");
      setProductId("");
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

  // Delete coupon
  const handleDelete = async (id: number) => {
    await fetch(`https://eragon-backend1.onrender.com/api/productcoupon/${id}/`, {
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
      // Consider using navigate instead of window.location.reload() for a smoother SPA experience
      // If your admin login route requires a full reload to reset auth state, it's fine.
      // window.location.reload();
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
        Admin Management Dashboard
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

        {/* Add/Edit Product Form */}
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
          {logoUrl && !logo && ( // Show existing logo URL if no new file is selected
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

          {/* --- New fields for Product Footer content (all plain text inputs) --- */}
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
          {/* --- End of new fields for Product Footer content --- */}

          {/* --- NEW: Social Media Links Section --- */}
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
          {/* --- End of NEW Social Media Links Section --- */}

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

        {/* Existing Products List */}
        <h2 className="text-xl font-semibold mb-2 mt-6">Existing Products</h2>
        <div className="overflow-x-auto mb-6">
            <table className="min-w-full bg-white border">
                <thead>
                    <tr className="bg-blue-500 text-white">
                        <th className="px-2 py-2 text-left">ID</th>
                        <th className="px-2 py-2 text-left">Name</th>
                        <th className="px-2 py-2 text-left">Logo</th>
                        <th className="px-2 py-2 text-left">Title</th>
                        <th className="px-2 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center py-4">No products added yet.</td>
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

        {/* Add Coupon Form */}
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

        {/* Edit Coupon Modal/Form */}
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
                    onClick={() => setEditingCoupon(null)} // Cancel editing
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
                      {/* Now c.product is guaranteed to be a Product object */}
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
                      <div className="font-bold text-blue-700">{c.title}</div>
                      {/* You can remove these lines if you don't want to display product details in the coupon table */}
                      {/* <div>
                        <div className="font-bold">{c.product.title}</div>
                        <div className="text-sm">{c.product.subtitle}</div>
                        <div className="text-xs text-gray-500">{c.product.sub_subtitle}</div>
                      </div> */}
                    </td>
                    <td className="px-2 py-2">{c.code}</td>
                    <td className="px-2 py-2">{c.discount}</td>
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