import styles from '@/styles/Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.logo}>vander-restaurant</h3>
        </div>

        <div className={styles.footerSection}>
          <h4>Contact Info</h4>
          <p>17990854</p>
          <p>vander462@gmail.com</p>
          <p>500 Terry Francine Street,</p>
          <p>6th Floor, San Francisco,</p>
          <p>CA 94158</p>
        </div>

        <div className={styles.footerSection}>
          <h4>Quick Links</h4>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/accessibility">Accessibility Statement</Link>
          <Link href="/terms">Terms & Conditions</Link>
          <Link href="/refund">Refund Policy</Link>
          <Link href="/shipping">Shipping Policy</Link>
        </div>

        <div className={styles.footerSection}>
          <h4>Follow Us</h4>
          <div className={styles.socialLinks}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>© 2024 vander-restaurant. Powered and secured by Us</p>
      </div>
    </footer>
  );
} 