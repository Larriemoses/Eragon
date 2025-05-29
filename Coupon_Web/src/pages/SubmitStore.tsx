import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { usePageHead } from '../utils/headManager'; // Keep the import here


const SubmitStore: React.FC = () => {

   // <--- CORRECT PLACEMENT OF usePageHead HOOK ---
   // It MUST be the very first thing called inside the functional component's body.
   usePageHead({
    title: "Submit Your Store | Discount Region - Share Your Deals", // Adjusted title for submit page
    description: "Submit your store and share your coupon codes and verified deals with the Discount Region community. Get your brand featured!", // Adjusted description for submit page
    ogImage: "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1747609358/image-removebg-preview_soybkt.png", // Use your main logo or a compelling social share image
    ogUrl: "https://www.yourdomain.com/submit-store", // IMPORTANT: Replace with your actual domain
    canonicalUrl: "https://www.yourdomain.com/submit-store", // IMPORTANT: Replace with your actual domain
  });
  // <--- END CORRECT PLACEMENT ---


  const [form, setForm] = useState({
    name: '',
    email: '',
    website: '',
    description: '',
  });

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null); // Clear previous messages
    setError(null);   // Clear previous messages

    emailjs.send(
      'service_49ootgt', // Service ID
      'template_nu4grvn', // Template ID
      form,
      'vrm0ULFr3hVb65yYR' // Public Key
    )
    .then(() => {
      setSuccess('Store submitted successfully!');
      setForm({ name: '', email: '', website: '', description: '' });
    })
    .catch((err) => {
      console.error("EmailJS Error:", err); // Log the actual error for debugging
      setError('Failed to submit store. Please try again. (Check console for details)');
    });
  };

  return (
    // Outer container to fill the screen and center content
    <div className=" flex items-start justify-center py-4 px-4 bg-gray-50">
      {/* Inner container for the form, with max-width and centered */}
      <div className="w-full max-w-xl p-6 bg-white shadow-xl rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Submit Your Store</h2>
        <form onSubmit={handleSubmit} className="space-y-5"> {/* Increased spacing */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Store Name"
            className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Contact Email"
            className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            required
            placeholder="Website URL"
            className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Short Description"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-y"
          ></textarea>
          <div className="flex justify-center"> {/* Center the button */}
            <button
              type="submit"
              className="bg-green-500 text-white px-8 py-3 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 text-lg"
            >
              Submit Store
            </button>
          </div>
          {success && (
            <p className="text-green-600 text-center font-medium mt-4">{success}</p>
          )}
          {error && (
            <p className="text-red-600 text-center font-medium mt-4">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SubmitStore;