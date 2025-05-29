// Home.tsx
import PopularStores from '../components/PopularStores';
import TopDeals from '../components/TopDeals';
import About from '../components/About';


import { usePageHead } from '../utils/headManager';



  
// Define the background image URL
const MOBILE_HERO_BG_URL = "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1748452006/Kimberly_Martin_Designs_b1nvsg.jpg";

function Home() {


 usePageHead({
    title: "Discount Region - Top Coupon Codes, Verified Deals & Promo Codes",
    description: "Your go-to source for verified discounts and promo codes from top brands like Oraimo, Shopinverse, 1xBet, and leading prop firms. Begin your discount journey and save more every time!",
    ogImage: "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1747609358/image-removebg-preview_soybkt.png", // Use your main logo or a compelling social share image
    ogUrl: "https://www.yourdomain.com/", // IMPORTANT: Replace with your actual domain
    canonicalUrl: "https://www.yourdomain.com/", // IMPORTANT: Replace with your actual domain
  });

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      {/* Hero Section */}
      <div className="w-full flex justify-center">
        <div className="w-[95%] max-w-6xl rounded overflow-hidden shadow bg-gradient-to-br from-green-700 via-blue-900 to-black relative">
          {/* Desktop View (centered text without image) - unchanged */}
          <div className="hidden sm:flex items-center justify-center h-[260px] p-4 text-center">
            <div className="max-w-2xl">
              <h1 className="text-white text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                Top Coupon Codes, Discount Codes &amp; Deals
              </h1>
              <p className="text-white text-lg font-medium">
                Your trusted source for the best promo codes at checkout. Discount Region brings you verified discounts and exclusive offers from top brands and prop firms.
              </p>
            </div>
          </div>

          {/* Mobile View (taller, left-aligned, centered vertically) - MODIFIED */}
          <div
            className="sm:hidden flex items-center justify-center h-[63vh] py-6 px-4 relative"
            style={{
              backgroundImage: `url(${MOBILE_HERO_BG_URL})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Overlay for opacity and blend mode */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-green-700 via-blue-900 to-black"
              style={{
                opacity: 0.90,
                mixBlendMode: 'multiply',
              }}
            ></div>

            {/* Content (text) positioned on top of the overlay - MODIFIED */}
            {/*
              To achieve:
              1. Block of text is centered horizontally on the screen.
              2. Text *within* the block remains left-aligned.
              We keep the outer flex `justify-center` on the mobile hero container
              and use `mx-auto` on the text content div, and ensure it has a max-width.
            */}
            <div className="w-full max-w-xs text-left relative z-10 px-3 pr-7 mx-auto"> {/* Changed text-center back to text-left, added mx-auto */}
              <h1 className="text-white text-4xl sm:text-3xl font-bold t">
                Top Coupon Codes, <br/>Discount Codes <br/> &amp; Deals
              </h1>
              <p className="text-white text-sm font-normal">
                Your trusted source for the best promo codes at checkout.
              </p>
              <p className="text-white text-sm font-normal mt-2">
                Discount Region brings you verified discounts and exclusive offers from top brands and prop firms.
              </p>
            </div>
          </div>
        </div>
      </div>

      <PopularStores />
      <div id="top-deals" className="w-full flex justify-center mt-8">
        <TopDeals />
      </div>
      <About />
    </div>
  );
}

export default Home;