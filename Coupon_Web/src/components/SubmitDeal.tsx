import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

const SubmitStore: React.FC = () => {
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

    emailjs.send(
      'service_49ootgt', // Service ID
      'template_nu4grvn', // Template ID
      form,
      'vrm0ULFr3hVb65yYR' // Public Key
    )
    .then(() => {
      setSuccess('Store submitted successfully!');
      setForm({ name: '', email: '', website: '', description: '' });
      setError(null);
    })
    .catch(() => {
      setError('Failed to submit store. Please try again.');
      setSuccess(null);
    });
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-center mb-4">Submit a Code/Deal</h2>
      <p className='text-sm text-center mb-4'>Found a great deal for this brand? Share it with the community! All submissions are manually reviewed before publishing</p>
      <form onSubmit={handleSubmit} className="space-y-4 items-center justify-center">
        {/* <h4 className="text-sm font-bold -mb-0">Store name</h4> */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Store Name"
          className="w-full px-4 py-2 border-gray-200 border bg-gray-100 rounded"
        />
        {/* <h4 className="text-sm font-bold -mb-0 ">Discount Code</h4> */}
        <input
          name="email"
        //   type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Discount Code"
          className="w-full bg-gray-100 border-gray-200 border   px-4 py-2 rounded"
        />
        {/* <h4 className="text-sm font-bold -mb-0 ">Website URL</h4> */}
        <input
          name="website"
          value={form.website}
          onChange={handleChange}
          required
          placeholder="Website URL"
          className="w-full  border-gray-100 bg-gray-200 border px-4 py-2 rounded"
        />
        {/* <h4 className="text-sm font-bold -mb-0">Description</h4> */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows={4}
          className="w-full bg-gray-100 border-gray-200 px-4 border  py-2 rounded"
        ></textarea>
        <button
          type="submit"
          className="bg-green-500 text-white text-center px-6 py-2 rounded hover:bg-green-600"
        >
          Submit Store
        </button>
        {success && <p className="text-green-600 mt-2">{success}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default SubmitStore;
