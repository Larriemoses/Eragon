import React from 'react'
import Product from '../components/Products'

// Use your actual gradient/abstract image here
const HERO_SHAPE =
  "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1747768334/abstractshape_u12iih.png";

function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      {/* Hero Section */}
      <div className="w-full flex justify-center mt-6">
        <div className="w-[95%] max-w-6xl rounded overflow-hidden  shadow bg-gradient-to-br from-green-700 via-blue-900  to-black relative flex items-center h-[220px] md:h-[260px]">
          {/* Left: Text */}
          <div className="flex-1 z-10 pl-8 py-8">
            <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
              Top Coupon Codes,<br />
              Discount Codes &amp; Deals
            </h1>
            <p className="text-white text-sm md:text-base font-medium max-w-lg">
              Your trusted source for the best promo codes at checkout. Discount Region brings you verified discounts and exclusive offers from top brands and prop firms.
            </p>
          </div>
          {/* Right: Abstract Image */}
          <div className="flex-1 flex justify-end items-end h-full">
            <img
              src={HERO_SHAPE}
              alt="Abstract"
              className="h-full w-auto object-contain"
              draggable={false}
              style={{ maxHeight: "100%", maxWidth: "100%" }}
            />
          </div>
        </div>
      </div>
      {/* Product Section */}
      <Product />
    </div>
  )
}

export default Home
