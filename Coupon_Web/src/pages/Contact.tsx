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
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-4">Contact Us</h1>
      <p className="text-center mb-8 text-gray-700">
        Have questions, feedback, or interested in partnering with Discount Region? Fill out the form below or reach out via email.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white rounded-lg p-8 shadow"
      >
        <label className="text-gray-700">Your Name:</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="bg-gray-100 rounded-full px-6 py-3 outline-none"
          required
        />

        <label className="text-gray-700">Your Email:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="bg-gray-100 rounded-full px-6 py-3 outline-none"
          required
        />

        <label className="text-gray-700">Subject:</label>
        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="bg-gray-100 rounded-full px-6 py-3 outline-none"
          required
        />

        <label className="text-gray-700">Message:</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          className="bg-gray-100 rounded-2xl px-6 py-3 outline-none min-h-[100px] resize-none"
          required
        />

        <button
          type="submit"
          className="bg-green-500 text-white font-semibold rounded-full py-3 mt-4 hover:bg-green-600 transition"
        >
          Send Message
        </button>
        {submitted && (
          <p className="text-green-600 text-center mt-2">Thank you for contacting us!</p>
        )}
      </form>
    </div>
  );
};

export default Contact;