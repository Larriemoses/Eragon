import React, { useState } from "react";
import emailjs from "@emailjs/browser";

import { usePageHead } from '../utils/headManager';

 usePageHead({
    title: "Discount Region - Top Coupon Codes, Verified Deals & Promo Codes",
    description: "Your go-to source for verified discounts and promo codes from top brands like Oraimo, Shopinverse, 1xBet, and leading prop firms. Begin your discount journey and save more every time!",
    ogImage: "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1747609358/image-removebg-preview_soybkt.png", // Use your main logo or a compelling social share image
    ogUrl: "https://www.yourdomain.com/", // IMPORTANT: Replace with your actual domain
    canonicalUrl: "https://www.yourdomain.com/", // IMPORTANT: Replace with your actual domain
  });


  
const Contact: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    emailjs
      .send(
        "service_49ootgt",        // Service ID
        "template_fitwejh",       // Template ID
        form,                     // Form data (must match template variables)
        "vrm0ULFr3hVb65yYR"       // Public Key
      )
      .then(() => {
        setSubmitted(true);
        setError(false);
        setForm({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      })
      .catch(() => {
        setError(true);
        setSubmitted(false);
      });
  };

  return (
    <div className="w-full min-h-[60%] flex justify-center px-4 py-6">
      <div className="w-[100%] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-[40%] bg-white rounded-xl shadow-md p-6 bg-gray-50">
        <h1 className="text-2xl font-bold text-center mb-2">Contact Us</h1>
        <p className="text-center mb-5 text-gray-700 text-sm">
          Have questions, feedback, or want to partner with Discount Region? Fill out the form below or email us.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="bg-gray-100 border border-gray-200 rounded-md px-4 py-2 outline-none text-sm"
            placeholder="Your Name"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="bg-gray-100 rounded-md border border-gray-200  px-4 py-2 outline-none text-sm"
            placeholder="Your Email"
            required
          />
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="bg-gray-100 border border-gray-200  rounded-md px-4 py-2 outline-none text-sm"
            placeholder="Subject"
            required
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="bg-gray-100 border border-gray-200  rounded-md px-4 py-2 outline-none min-h-[80px] resize-none text-sm"
            placeholder="Your Message"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white font-semibold rounded-md py-2 hover:bg-green-600 transition"
          >
            Send Message
          </button>
          {submitted && (
            <p className="text-green-600 text-center mt-2 text-sm">
              ✅ Thank you for contacting us! We'll get back to you shortly.
            </p>
          )}
          {error && (
            <p className="text-red-600 text-center mt-2 text-sm">
              ❌ Failed to send message. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;
