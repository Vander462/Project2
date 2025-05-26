import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '@/styles/Navbar.module.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo}>
        <Link href="/">Vander</Link>
      </div>
      
      <button 
        className={`${styles.menuButton} ${isMenuOpen ? styles.open : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
        <li onClick={() => scrollToSection('about')}>About</li>
        <li onClick={() => scrollToSection('specialties')}>Menu</li>
        <li onClick={() => scrollToSection('team')}>Team</li>
        <li onClick={() => scrollToSection('contact')}>Contact</li>
        <li className={styles.reserveButton}>Reserve Table</li>
      </ul>
    </nav>
  );
} 