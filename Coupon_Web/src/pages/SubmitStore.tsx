import React, { useState } from "react";

const SubmitStore: React.FC = () => {
  const [storeName, setStoreName] = useState("");
  const [website, setWebsite] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const API_TOKEN = "5e94ab243b5cbc00546b6e026b51ba421550c5f4"; // your token

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    try {
      const res = await fetch("https://upgraded-rotary-phone-jggv9pw6p56hxgq-8000.app.github.dev/api/submitstore/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${API_TOKEN}`,
        },
        body: JSON.stringify({
          store_name: storeName,
          website,
          discount_code: discountCode,
          description,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit. Please try again.");
      }

      setSubmitted(true);
      setStoreName("");
      setWebsite("");
      setDiscountCode("");
      setDescription("");
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white pt-8">
      <h1 className="text-3xl font-bold text-center mb-2">Submit a New Store</h1>
      <p className="text-center text-gray-700 mb-6 max-w-xl">
        Do you know a great prop firm, trading service, or affiliate brand that isn’t listed yet? Or have a new deal/code for an existing one? Suggest it here!
      </p>
      <form
        onSubmit={handleSubmit}
        className="bg-white  rounded-md p-6 w-full max-w-md flex flex-col gap-3"
      >
        {submitted && (
          <div className="text-green-600 text-center mb-2 font-semibold">
            Thank you for your submission!
          </div>
        )}
        {error && (
          <div className="text-red-600 text-center mb-2 font-semibold">
            {error}
          </div>
        )}
        <label className="font-medium">Store Name:</label>
        <input
          type="text"
          className="p-2 bg-gray-100 rounded mb-2"
          value={storeName}
          onChange={e => setStoreName(e.target.value)}
          required
          placeholder="e.g. Discount Region"
        />

        <label className="font-medium">Store Website URL:</label>
        <input
          type="url"
          className="p-2 bg-gray-100  rounded mb-2"
          placeholder="https://www.examples.com"
          value={website}
          onChange={e => setWebsite(e.target.value)}
          required
        />

        <label className="font-medium">Discount Code:</label>
        <input
          type="text"
          className="p-2 bg-gray-100  rounded mb-2"
          value={discountCode}
          onChange={e => setDiscountCode(e.target.value)}
          placeholder="e.g. 50% off"
        />

        <label className="font-medium">Description:</label>
        <textarea
          className="p-2 bg-gray-100  rounded mb-2 min-h-[70px]"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          placeholder="e.g. 50% off on all products"
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-full font-semibold hover:bg-green-600 mt-2"
        >
          Submit Store
        </button>
      </form>
    </div>
  );
};

export default SubmitStore;