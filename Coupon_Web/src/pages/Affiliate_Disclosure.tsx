import React from "react";
import { usePageHead } from '../utils/headManager';

 usePageHead({
    title: "Discount Region - Top Coupon Codes, Verified Deals & Promo Codes",
    description: "Your go-to source for verified discounts and promo codes from top brands like Oraimo, Shopinverse, 1xBet, and leading prop firms. Begin your discount journey and save more every time!",
    ogImage: "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1747609358/image-removebg-preview_soybkt.png", // Use your main logo or a compelling social share image
    ogUrl: "https://www.yourdomain.com/", // IMPORTANT: Replace with your actual domain
    canonicalUrl: "https://www.yourdomain.com/", // IMPORTANT: Replace with your actual domain
  });

const Privacy: React.FC = () => (
  <div className="w-[90%] md:w-[35%] mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold text-center mb-1">Affiliate Disclosure</h1>
    <div className="space-y-10 text-justify py-5 text-gray-800">
     
      <p>
        At Discount Region, some of the links on our site are affiliate links. This means that if you make a purchase through one of these links, we may earn a small commission. This comes at no extra cost to you. The commissions we receive help support and maintain the website, allowing us to continue providing you with great deals and useful information.      </p>
      <p>
        We want to be transparent with you our recommendations are based on our genuine belief in the products and services we feature. We only promote what we truly believe will benefit our audience. Your support through these links helps us keep improving and delivering the best possible deals.
      </p>
     </div>
    </div>

);

export default Privacy;