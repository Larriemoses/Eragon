import React from "react";

const ProductFooter: React.FC = () => (
  <div className="w-full max-w-2xl mx-auto px-4 py-10 text-gray-800 mt-10">
    {/* Effortless Savings */}
    <section className="mb-8">
      <h2 className="text-xl font-bold text-center mb-2">Effortless Savings<br />Start Here</h2>
      <p className="text-center text-sm md:text-base">
        We’ve sourced the best working Oraimo discount code to help you save on your favorite gadgets and accessories. Whether you’re grabbing a new power bank, earbuds, or smart speaker, this code is all you need to shop smarter and pay less. So yes, just start saving.
      </p>
    </section>

    {/* How to Use */}
    <section className="mb-8">
      <h3 className="text-lg font-bold mb-2 text-center">How to Use Your<br />Oraimo Discount Code</h3>
      <ol className="list-decimal pl-6 space-y-1 text-sm md:text-base">
        <li>Visit the Oraimo Store</li>
        <li>Click on the link (Shop) or on the official Oraimo store.</li>
        <li>Sign in or sign up if you are new.</li>
        <li>Select Your Product(s)</li>
        <li>Browse through the wide range of Oraimo accessories, including earbuds, power banks, smartwatches, and more.</li>
        <li>Add your favorite items to the shopping cart.</li>
        <li>
          <span className="font-semibold">At Checkout,</span> ensure you’ve properly pasted the code at the checkout page by clicking the cart icon.
        </li>
        <li>Look for the field labeled “enter voucher code”.</li>
        <li>Enter the relevant discount code from Discount Region.</li>
        <li>Click “Apply” to validate the coupon.</li>
        <li>The discount should be reflected in your order total.</li>
        <li>Proceed to payment or delivery and complete your purchase.</li>
      </ol>
      <p className="text-green-600 font-semibold mt-2">
        Congratulations! You’ve successfully used an Oraimo discount code.
      </p>
      <p className="text-xs text-gray-600 mt-2">
        <span className="font-bold">NOTE:</span> There are instances where you might not need to add a code at checkout, because it is applied automatically.
      </p>
    </section>

    {/* Tips */}
    <section className="mb-8">
      <h3 className="text-lg font-bold mb-2 text-center">Tips for Getting the<br />Best Oraimo Deals</h3>
      <ul className="list-disc pl-6 space-y-1 text-sm md:text-base">
        <li>Sign up for an Oraimo account to earn up to 10 reward points instantly. Redeem these points for discounts on future orders.</li>
        <li>Use the Discount Region coupon codes to enjoy a 5% discount on any Oraimo product in your purchase and free shipping on all orders (by offering only 5% off on select items).</li>
        <li>Combine promo codes, coupon codes, and daily deals for maximum savings.</li>
        <li>Start saving today with genuine Oraimo coupons accessible at unbeatable prices!</li>
      </ul>
    </section>

    {/* Contact */}
    <section>
      <h3 className="text-lg font-bold mb-2 text-center">Need Help? Here’s How to<br />Contact Oraimo Customer Care</h3>
      <p className="text-center text-sm md:text-base mb-4">
        If you have questions or need support, you can easily reach Oraimo through any of these channels:
      </p>
      <div className="flex flex-col md:flex-row justify-center gap-6 bg-gray-100 rounded-xl p-6 text-center">
        <div className="flex-1">
          <div className="font-semibold mb-1">Phone Support</div>
          <div className="text-sm">0722 093 399, 0722 093 200</div>
        </div>
        <div className="flex-1">
          <div className="font-semibold mb-1">Email Support</div>
          <div className="text-sm">Send a message: Care.ke@oraimo.com</div>
        </div>
        <div className="flex-1">
          <div className="font-semibold mb-1">Whatsapp Support</div>
          <div className="text-sm">Chat with us now: 0722 288 818</div>
        </div>
      </div>
    </section>
  </div>
);

export default ProductFooter;