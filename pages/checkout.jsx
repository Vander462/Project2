// pages/checkout.jsx
import React from 'react';
import PlaceOrderButton from '../components/PlaceOrderButton';

const CheckoutPage = () => {
  const cartItems = [
    { menuItemId: 1, quantity: 2 },
    { menuItemId: 3, quantity: 1 }
  ];

  const userId = 1; // Replace with real user session ID
  const address = "123 Main St";
  const phone = "9876543210";

  return (
    <div className="container">
      <h1>Checkout</h1>
      {/* Show cart summary */}
      <PlaceOrderButton
        userId={userId}
        cartItems={cartItems}
        address={address}
        phone={phone}
      />
    </div>
  );
};

export default CheckoutPage;
