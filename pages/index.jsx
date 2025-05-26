import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layouts/Layout';
import Footer from '@/components/Footer';
import { useUser } from '@/lib/auth';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const [isVisible, setIsVisible] = useState({});
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      router.push('/admin');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, [user, router]);

  // If user is admin, they will be redirected to admin page
  if (user?.role === 'ADMIN') {
    return null;
  }

  return (
    <Layout>
      <div className={styles.mainContainer}>
        <div className={`${styles.hero} ${isVisible['hero'] ? styles.visible : ''}`} id="hero" data-animate>
          <h1>Welcome to Vander</h1>
          <p>At Vander, we believe that dining is not just about food; it's an experience to be savored.</p>
          <h2>Join Us</h2>
          <p>Whether you're celebrating a special occasion or simply enjoying a night out, Vander is the perfect destination.</p>
        </div>

        <div 
          className={`${styles.section} ${isVisible['about'] ? styles.visible : ''}`} 
          id="about" 
          data-animate
        >
          <h2>Our History</h2>
          <p>
            Vander Restaurant began as a small eatery... dreamed of a place where every dish tells a story. Over the years, it has grown into a beloved destination for food enthusiasts.
          </p>
        </div>

        <div 
          className={`${styles.section} ${isVisible['values'] ? styles.visible : ''}`} 
          id="values" 
          data-animate
        >
          <h2>Our Values</h2>
          <p>
            At the core of Vander's philosophy is a commitment to sustainability, quality, and community. We strive to create not just meals, but meaningful experiences.
          </p>
        </div>

        <div 
          className={`${styles.section} ${isVisible['specialties'] ? styles.visible : ''}`} 
          id="specialties" 
          data-animate
        >
          <h2>Our Specialties</h2>
          <div className={styles.specialtiesGrid}>
            <div className={styles.specialtyCard}>
              <div className={styles.specialtyImageWrapper}>
                <img src="/images/non1.jpg" alt="Mutton Rogan Josh" />
                <div className={styles.specialtyOverlay}>
                  <span>Signature Dish</span>
                </div>
              </div>
              <div className={styles.specialtyContent}>
                <h3>Mutton Rogan Josh</h3>
                <p>Our signature dish that captures the essence of our rich culinary heritage.</p>
                <div className={styles.specialtyInfo}>
                  <span>Nu. 350</span>
                  <span className={styles.specialtyBadge}>Chef's Special</span>
                </div>
              </div>
            </div>

            <div className={styles.specialtyCard}>
              <div className={styles.specialtyImageWrapper}>
                <img src="/images/ema.jpeg" alt="Ema Datshi" />
                <div className={styles.specialtyOverlay}>
                  <span>Popular</span>
                </div>
              </div>
              <div className={styles.specialtyContent}>
                <h3>Ema Datshi</h3>
                <p>Traditional Bhutanese chili cheese stew, a perfect blend of spice and comfort.</p>
                <div className={styles.specialtyInfo}>
                  <span>Nu. 250</span>
                  <span className={styles.specialtyBadge}>Vegetarian</span>
                </div>
              </div>
            </div>

            <div className={styles.specialtyCard}>
              <div className={styles.specialtyImageWrapper}>
                <img src="/images/phakpa.jpeg" alt="Phaksha Paa" />
                <div className={styles.specialtyOverlay}>
                  <span>Must Try</span>
                </div>
              </div>
              <div className={styles.specialtyContent}>
                <h3>Phaksha Paa</h3>
                <p>Tender pork with red chilies and mountain vegetables, a hearty delicacy.</p>
                <div className={styles.specialtyInfo}>
                  <span>Nu. 300</span>
                  <span className={styles.specialtyBadge}>Spicy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div 
          className={`${styles.teamSection} ${isVisible['team'] ? styles.visible : ''}`} 
          id="team" 
          data-animate
        >
          <h2>Meet the Team</h2>
          <div className={styles.teamGrid}>
            <div className={styles.teamCard}>
              <img src="/images/vander.jpg" alt="Chef Tshering" className={styles.teamImage} />
              <h3>Chef Thukten Vander Tshering</h3>
              <p>Founder and Head Chef</p>
              <div className={styles.teamSocial}>
                <a href="#" aria-label="LinkedIn">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            <div className={styles.teamCard}>
              <img src="/images/rangdel.jpg" alt="Sous Chef Choney" className={styles.teamImage} />
              <h3>Sous Chef Choney Rangdel</h3>
              <p>Master of Flavors</p>
              <div className={styles.teamSocial}>
                <a href="#" aria-label="LinkedIn">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
            <div className={styles.teamCard}>
              <img src="/images/ngawang.jpg" alt="Pastry Chef Ngawang" className={styles.teamImage} />
              <h3>Pastry Chef Ngawang Pema</h3>
              <p>Dessert Artisan</p>
              <div className={styles.teamSocial}>
                <a href="#" aria-label="LinkedIn">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div 
          className={`${styles.familySection} ${isVisible['family'] ? styles.visible : ''}`} 
          id="family" 
          data-animate
        >
          <div className={styles.familyContent}>
            <h2>Our Family</h2>
            <p>Together, we create memories and share the joy of authentic cuisine with our guests.</p>
            <div className={styles.familyImageWrapper}>
              <img src="/images/group.jpg" alt="Team at a fair" className={styles.familyImage} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
}
