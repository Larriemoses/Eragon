import PopularStores from '../components/PopularStores';
import TopDeals from '../components/TopDeals';
import About from '../components/About';

function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      {/* Hero Section */}
      <div className="w-full flex justify-center">
        <div className="w-[95%] max-w-6xl rounded overflow-hidden shadow bg-gradient-to-br from-green-700 via-blue-900 to-black relative">
          {/* Desktop View (centered text without image) */}
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

          {/* Mobile View (full height with larger text) */}
          <div className="sm:hidden flex items-center justify-center h-[50vh] p-6 text-start">
            <div>
              <h1 className="text-white text-3xl font-bold mb-4 leading-tight">
                Top Coupon Codes,<br />
                Discount Codes<br />
                &amp; Deals
              </h1>
              <p className="text-white text-base font-medium">
                Your trusted source for the best promo codes at checkout.
              </p>
              <p className="text-white text-base font-medium mt-2">
                Verified discounts and exclusive offers from top brands.
              </p>
            </div>
          </div>
        </div>
      </div>

      <PopularStores />
      <TopDeals />
      <About />
    </div>
  );
}

export default Home;