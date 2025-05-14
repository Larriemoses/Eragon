import { useState, useEffect } from 'react';
import '../App.css';

type Coupon = {
  id: number;
  title: string;
  code: string;
  discount: number;
  expiry_date: string;
};


export default function Coupon_Section() {

     const [coupons, setCoupons] = useState<Coupon[]>([]);
      const [error, setError] = useState<string | null>(null);
    
      const fetchCoupons = () => {
        const token = '5e94ab243b5cbc00546b6e026b51ba421550c5f4'; // API token
    
        fetch('http://127.0.0.1:8000/api/coupons/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => setCoupons(data))
          .catch((error) => setError(error.message));
      };
    
      useEffect(() => {
        fetchCoupons(); // Fetch data when the component mounts
      }, []);
    
      if (error) {
        return <div>Error fetching coupons: {error}</div>;
      }
  return (
    <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold text-center mb-4">Available Coupons</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {coupons.map((coupon) => (
        <div key={coupon.id} className="border p-4 rounded shadow">
          <h2 className="text-xl font-bold">{coupon.title}</h2>
          <p>Code: {coupon.code}</p>
          <p>Discount: {coupon.discount}%</p>
          <p>Expires on: {coupon.expiry_date}</p>
        </div>
      ))}
    </div>
  </div>
  )
}
