import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const SubmitStore: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '', // This will hold the Discount Code now
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
      setSuccess('Code/Deal submitted successfully! We\'ll review it soon.');
      setForm({ name: '', email: '', website: '', description: '' });
    })
    .catch((err) => {
      console.error("EmailJS Error:", err); // Log the actual error for debugging
      setError('Failed to submit code/deal. Please try again. (Check console for details)');
    });
  };

  return (
    // Outer container: Fills the screen and centers content (Flexbox)
    <div className="flex items-start justify-center p-4 bg-gray-50 mt-12">
      {/* Inner container: Controls max width and provides card-like styling */}
      {/* Changed max-w-xl to max-w-lg for slightly reduced desktop width */}
      <div className="w-full max-w-lg p-6 bg-white shadow-xl rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Submit a Code/Deal</h2>
        <p className='text-sm text-center text-gray-600 mb-6'>
          Found a great deal for this brand? Share it with the community! All submissions are manually reviewed before publishing.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5"> {/* Increased vertical spacing between form elements */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Store Name"
            className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <input
            name="email" // Renamed from type="email" in the comment to align with your field's purpose
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Discount Code"
            className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            required
            placeholder="Website URL (e.g., https://example.com)"
            className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Short Description of the Deal (e.g., '20% off all shoes' or 'Free shipping on orders over $50')"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 resize-y"
          ></textarea>
          <div className="flex justify-center pt-2"> {/* Centers the button horizontally */}
            <button
              type="submit"
              className="bg-green-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 text-lg"
            >
              Submit Code/Deal
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