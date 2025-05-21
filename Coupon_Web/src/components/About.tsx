import React from "react";

const MOCKUP_IMG = "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1747799463/Screenshot_from_2025-05-21_04-49-14_si9kam.png";

const About: React.FC = () => (
  <div className="w-[90%] flex flex-col items-center px-4 py-12 bg-white">
    <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
      Your Discount Journey Begins Here<br />
      Welcome to Discount Region
    </h1>
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl w-full mt-6">
      {/* Left: Mockup Image */}
      <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
        <img
          src={MOCKUP_IMG}
          alt="Discount Region Mockup"
          className="max-h-72 w-auto rounded-xl shadow-md"
          draggable={false}
        />
      </div>
      {/* Right: Description */}
      <div className="w-full md:w-2/3">
        <p className="text-base md:text-lg text-gray-800 mb-4">
          Your go-to source for the best promo codes and verified discounts from top brands around the world. Whether you're shopping for gadgets, trading tools, or everyday essentials, we've got deals to help you save more every time you shop.
        </p>
        <div className="mb-2 font-semibold">How It Works</div>
        <ul className="list-disc pl-5 text-gray-700 mb-2">
          <li>
            <span className="font-medium">Browse Top Brands</span>
            <span className="block ml-2 text-sm text-gray-600">
              From tech stores like Oraimo to trading prop firms, explore deals that match your needs.
            </span>
          </li>
          <li>
            <span className="font-medium">Get a Verified Code or Link</span>
            <span className="block ml-2 text-sm text-gray-600">
              Click to copy a working discount code or use our link to the store.
            </span>
          </li>
          <li>
            <span className="font-medium">Shop or Register Directly</span>
            <span className="block ml-2 text-sm text-gray-600">
              Use the code at checkout or sign up through the link and enjoy instant savings.
            </span>
          </li>
        </ul>
      </div>
    </div>
    {/* Why Choose Section */}
    <div className="max-w-3xl w-full mt-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
        Why Should You Choose<br />Discount Region?
      </h2>
      <ul className="list-disc pl-5 text-base text-gray-800 space-y-2">
        <li>
          <span className="font-bold">Get Verified Coupons and Promo Codes:</span> Access exclusive and up-to-date codes for Oraimo, prop firms, Shopinverse, and 1xBet.
        </li>
        <li>
          <span className="font-bold">Save on Premium Products and Services:</span> Whether you're buying Oraimo accessories, prop firm subscriptions, or gadgets from Shopinverse, you'll save significantly.
        </li>
        <li>
          <span className="font-bold">Enjoy Quality with Confidence:</span> All products, from Oraimo devices to Shopinverse gadgets, come with warranties or guarantees.
        </li>
        <li>
          <span className="font-bold">Stay Updated with Fresh Offers:</span> Our discount codes are updated regularly, ensuring you keep saving on every purchase or subscription.
        </li>
      </ul>
    </div>
  </div>
);

export default About;