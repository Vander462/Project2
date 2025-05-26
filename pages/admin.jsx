import { useState, useEffect } from 'react';
import Layout from '../components/Layouts/Layout';
import OrderList from '../components/OrderList';
import { useUser } from '../lib/auth';
import styles from '@/styles/Admin.module.css';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'main',
    image: ''
  });
  const { user } = useUser();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') return;

    const fetchData = async () => {
      try {
        if (activeTab === 'orders') {
          const response = await fetch('/api/orders', {
            credentials: 'include'
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch orders');
          }
          const data = await response.json();
          setOrders(data);
        } else {
          const response = await fetch('/api/menu', {
            credentials: 'include'
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch menu items');
          }
          const data = await response.json();
          setMenuItems(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert(error.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, user]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update order status');
      
      const updatedOrder = await response.json();
      setOrders(orders.map(order =>
        order.id === orderId ? updatedOrder : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleRemoveOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to remove this order?')) return;

    try {
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete order');
      
      setOrders(orders.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error removing order:', error);
    }
  };

  const handleAddItem = async () => {
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newItem),
      });

      if (!response.ok) throw new Error('Failed to create menu item');
      
      const createdItem = await response.json();
      setMenuItems([...menuItems, createdItem]);
      setNewItem({
        name: '',
        description: '',
        price: 0,
        category: 'main',
        image: ''
      });
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`/api/menu?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete menu item');
      
      setMenuItems(menuItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <Layout title="Admin Dashboard">
        <div className="container mt-5 pt-5 text-center">
          <h1>Unauthorized Access</h1>
          <p>You must be an admin to view this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Dashboard">
      <div className={styles.adminContainer}>
        <h1 className={styles.title}>Admin Dashboard</h1>

        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === 'orders' ? styles.active : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'menu' ? styles.active : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            Menu Management
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : activeTab === 'orders' ? (
          <OrderList
            orders={orders}
            isAdmin={true}
            onStatusUpdate={handleStatusUpdate}
            onRemoveOrder={handleRemoveOrder}
          />
        ) : (
          <div className={styles.menuManagement}>
            <div className={styles.addItemForm}>
              <h3>Add New Menu Item</h3>
              <div className={styles.formGrid}>
                <input
                  type="text"
                  placeholder="Name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newItem.price || ''}
                  onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                />
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                >
                  <option value="main">Main Course</option>
                  <option value="appetizer">Appetizer</option>
                  <option value="dessert">Dessert</option>
                  <option value="beverage">Beverage</option>
                </select>
                <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }}
/>

                <button onClick={handleAddItem}>Add Item</button>
              </div>
            </div>

            <div className={styles.menuItems}>
              <h3>Current Menu Items</h3>
              <div className={styles.menuGrid}>
                {menuItems.map(item => (
                  <div key={item.id} className={styles.menuItem}>
                    <img src={item.image || '/images/default-food.jpg'} alt={item.name} />
                    <div className={styles.menuItemInfo}>
                      <h4>{item.name}</h4>
                      <p>{item.description}</p>
                      <p className={styles.price}>Nu. {item.price.toFixed(2)}</p>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        Delete Item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
