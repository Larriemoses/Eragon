// Home.tsx
import PopularStores from '../components/PopularStores';
import TopDeals from '../components/TopDeals';
import About from '../components/About';

// Define the background image URL
const MOBILE_HERO_BG_URL = "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1748452006/Kimberly_Martin_Designs_b1nvsg.jpg";

function Home() {
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
            className="sm:hidden flex items-center justify-center h-[63vh] py-6 px-6 pr-18 relative" // Added 'relative' for z-index control if needed later
            style={{ // Using inline style for background image, opacity, and blend mode
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
                opacity: 0.90, // 78% opacity
                mixBlendMode: 'multiply', // 'multiply' blend mode
              }}
            ></div>

            {/* Content (text) positioned on top of the overlay */}
            <div className="w-full max-w-xs text-left relative z-10 p-4 pl-0"> {/* Added z-10 to ensure text is above overlay, adjusted padding */}
              <h1 className="text-white text-4xl font-bold mb-4 leading-tight">
                Top Coupon Codes,<br />
                Discount Codes<br />
                &amp; Deals
              </h1>
              <p className="text-white text-sm font-normal"> {/* Removed specific pr-12 as content looks good without it */}
                Your trusted source for the best promo codes at checkout.
              </p>
              <p className="text-white text-sm font-normal mt-2"> {/* Removed specific pr-12 */}
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