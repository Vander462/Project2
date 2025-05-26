// components/PlaceOrderButton.jsx
import React from 'react';

const PlaceOrderButton = ({ userId, cartItems, address, phone }) => {
  const handlePlaceOrder = async () => {
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          address,
          phone,
          items: cartItems
        })
      });

      if (!response.ok) throw new Error('Order failed');
      const result = await response.json();
      alert('Order placed successfully!');
      console.log(result);
    } catch (error) {
      console.error(error);
      alert('Error placing order: ' + error.message);
    }
  };

  return (
    <button onClick={handlePlaceOrder} className="btn btn-primary">
      Place Order
    </button>
  );
};

export default PlaceOrderButton;
