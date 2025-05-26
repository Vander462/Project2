import Layout from '../components/Layouts/Layout';
import Head from 'next/head';
import styles from '@/styles/Contact.module.css';

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact Us</title>
      </Head>
      <div className={styles.contactContainer}>
        <h1 className={styles.contactTitle}>Contact Us</h1>

        <div className={styles.contactCard}>
          <div className={styles.contactInfo}>
            <h3>Our Location</h3>
            <p>Chukha, Phuntsholing Town, FC 56789</p>
            <p><strong>Phone:</strong> 17990854</p>
            <p><strong>Email:</strong> Vander@restaurant.com</p>

            <div className={styles.socialSection}>
              <h3>Follow Us</h3>
              <div className={styles.socialLinks}>
                <a href="https://www.facebook.com" className={styles.socialLink}>
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://www.instagram.com" className={styles.socialLink}>
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://twitter.com" className={styles.socialLink}>
                  <i className="fab fa-twitter"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
