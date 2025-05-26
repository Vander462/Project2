import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from './MenuPage.module.css';
import Footer from '@/components/Footer';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Bhutanese Specials', 'Vegetarian', 'Non-Vegetarian', 'Desserts'];

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => setMenuItems(data))
      .catch(err => console.error('Error fetching menu:', err));
  }, []);

  const handleDishClick = (dish) => {
    setSelectedDish(dish);
  };

  const closeModal = () => {
    setSelectedDish(null);
  };

  const filteredItems = menuItems.filter(item => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Bhutanese Specials') {
      return item.name === 'Phaksha Paa' || item.name === 'Ema Datshi';
    }
    return item.category === selectedCategory;
  });

  return (
    <>
      <div className={styles.menuContainer}>
        <div className="container mt-5">
          <h1 className="text-center mb-4">Our Authentic Menu</h1>
          <p className={styles.menuDescription}>
            Experience the authentic flavors of Bhutanese and Asian cuisine, carefully prepared by our expert chefs.
          </p>

          <div className={styles.categoryButtons}>
            {categories.map(category => (
              <button
                key={category}
                className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className={styles.menuGrid}>
            {filteredItems.map(item => (
              <div key={item.id} className={styles.menuCard} onClick={() => handleDishClick(item)}>
                <div className={styles.imageWrapper}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.menuImage}
                  />
                  {(item.name === 'Phaksha Paa' || item.name === 'Ema Datshi') && (
                    <div className={styles.specialBadge}>
                      Chef's Special
                    </div>
                  )}
                  <div className={styles.imageOverlay}>
                    <span>Click to View Details</span>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <h5 className={styles.dishName}>{item.name}</h5>
                  <div className={styles.cardFooter}>
                    <div className={styles.priceContainer}>
                      <span className={styles.price}>Nu. {item.price}</span>
                      <div className={styles.spicyLevel}>
                        {item.name === 'Ema Datshi' && '🌶️🌶️🌶️'}
                        {item.name === 'Phaksha Paa' && '🌶️🌶️'}
                      </div>
                    </div>
                    <Link href={`/order?itemId=${item.id}`} className={styles.orderButton}>
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedDish && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>&times;</button>
            <div className={styles.modalGrid}>
              <div className={styles.modalImage}>
                <img src={selectedDish.image} alt={selectedDish.name} />
              </div>
              <div className={styles.modalInfo}>
                <h2>{selectedDish.name}</h2>
                <p className={styles.modalDescription}>
                  {selectedDish.description || "A delightful dish prepared with the finest ingredients"}
                </p>
                <div className={styles.dishDetails}>
                  <div className={styles.detailItem}>
                    <span>Price:</span>
                    <strong>Nu. {selectedDish.price}</strong>
                  </div>
                  <div className={styles.detailItem}>
                    <span>Category:</span>
                    <strong>{selectedDish.category}</strong>
                  </div>
                  {(selectedDish.name === 'Ema Datshi' || selectedDish.name === 'Phaksha Paa') && (
                    <div className={styles.detailItem}>
                      <span>Spice Level:</span>
                      <strong>{selectedDish.name === 'Ema Datshi' ? 'Very Spicy 🌶️🌶️🌶️' : 'Medium Spicy 🌶️🌶️'}</strong>
                    </div>
                  )}
                </div>
                <Link href={`/order?itemId=${selectedDish.id}`} className={styles.orderButtonLarge}>
                  Order Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
