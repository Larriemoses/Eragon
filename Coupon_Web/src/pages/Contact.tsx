import React, { useState } from "react";

const Contact: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // You can add your email sending logic here
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">Contact Us</h1>
        <p className="text-center mb-4 text-gray-700 text-sm">
          Have questions, feedback, or interested in partnering with Discount Region? Fill out the form below or reach out via email.
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-3 bg-white rounded-lg p-4 sm:p-6 shadow"
        >
          <label className="text-gray-700 text-sm">Your Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="bg-gray-100 rounded-full px-4 py-2 outline-none text-sm"
            required
          />

          <label className="text-gray-700 text-sm">Your Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="bg-gray-100 rounded-full px-4 py-2 outline-none text-sm"
            required
          />

          <label className="text-gray-700 text-sm">Subject:</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="bg-gray-100 rounded-full px-4 py-2 outline-none text-sm"
            required
          />

          <label className="text-gray-700 text-sm">Message:</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="bg-gray-100 rounded-2xl px-4 py-2 outline-none min-h-[80px] resize-none text-sm"
            required
          />

          <button
            type="submit"
            className="bg-green-500 text-white font-semibold rounded-full py-2 mt-2 hover:bg-green-600 transition text-sm"
          >
            Send Message
          </button>
          {submitted && (
            <p className="text-green-600 text-center mt-2 text-sm">Thank you for contacting us!</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;