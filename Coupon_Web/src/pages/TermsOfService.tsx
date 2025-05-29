import React from "react";
import { usePageHead } from '../utils/headManager';

 usePageHead({
    title: "Discount Region - Top Coupon Codes, Verified Deals & Promo Codes",
    description: "Your go-to source for verified discounts and promo codes from top brands like Oraimo, Shopinverse, 1xBet, and leading prop firms. Begin your discount journey and save more every time!",
    ogImage: "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1747609358/image-removebg-preview_soybkt.png", // Use your main logo or a compelling social share image
    ogUrl: "https://www.yourdomain.com/", // IMPORTANT: Replace with your actual domain
    canonicalUrl: "https://www.yourdomain.com/", // IMPORTANT: Replace with your actual domain
  });

const TermsOfService: React.FC = () => (
   <div className="w-[90%] md:w-[35%] mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold text-center mb-1">Terms of Use</h1>
    <div className="space-y-10 text-justify py-5 text-gray-800">
      <p>
        At Discount Region, our goal is to bring you the best discounts and deals available. We may earn a commission if you click on one of our affiliate links and make a purchase. This commission is paid by the brand at no additional cost to you. The commissions we earn help us maintain and improve our website, allowing us to continue offering useful information and amazing deals. </p>
      <p>
       Rest assured, the income we receive has no impact on the integrity of our content, reviews, or recommendations. We pride ourselves on being transparent and honest. We only promote products and services that we truly believe in.      </p>
      <p>
       Additionally, the discount codes and deals we share are always valid, so you can take advantage of the savings whenever you shop. Discount Region collaborates with top reputable brands like Oraimo, Shop Inverse, FundedNext, Maven Trading, FTMO, and others. When you make a purchase through one of our affiliate links, we may earn a commission at no extra cost to you.      </p>
      <p className="font-semibold mt-4">
        Thank you for supporting <span className="font-bold">Discount Region!</span>
      </p>
    </div>
  </div>
);

export default TermsOfService;