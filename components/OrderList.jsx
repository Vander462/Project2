import { useState } from 'react';
import styles from '@/styles/OrderList.module.css';

export default function OrderList({ orders, isAdmin, onStatusUpdate, onRemoveOrder }) {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className={styles.orderList}>
      {orders.length === 0 ? (
        <div className={styles.noOrders}>
          <p>No orders found.</p>
        </div>
      ) : (
        <div className={styles.ordersContainer}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.orderInfo}>
                  <h3>Order #{order.id}</h3>
                  <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
                  <p className={styles.status}>Status: {order.status}</p>
                </div>
                <div className={styles.orderActions}>
                  <button
                    className={styles.detailsButton}
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    {expandedOrder === order.id ? 'Hide Details' : 'Show Details'}
                  </button>
                  {isAdmin && (
                    <>
                      <select
                        className={styles.statusSelect}
                        value={order.status}
                        onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PREPARING">Preparing</option>
                        <option value="DELIVERING">Delivering</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                      <button
                        className={styles.removeButton}
                        onClick={() => onRemoveOrder(order.id)}
                      >
                        Remove Order
                      </button>
                    </>
                  )}
                </div>
              </div>
              {expandedOrder === order.id && (
                <div className={styles.orderDetails}>
                  <h4>Order Details</h4>
                  <div className={styles.itemsList}>
                    {order.items.map((item, index) => (
                      <div key={index} className={styles.orderItem}>
                        <span>{item.name}</span>
                        <span>x{item.quantity}</span>
                        <span>Nu. {item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.orderTotal}>
                    <strong>Total:</strong> Nu. {order.total.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 