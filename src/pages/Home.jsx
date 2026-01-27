import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import WaahYaarContext from '../context/WaahYaarContext';
import '../assets/home.css';

const Home = () => {
  const { heros, categories, loadBestSeller, newProducts } = useContext(WaahYaarContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bestSeller, setBestSeller] = useState([]);
  const navigate = useNavigate();

  // HERO SLIDER EFFECT
  useEffect(() => {
    if (!heros?.heroes?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % heros.heroes.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [heros]);

  // BEST SELLER FETCH
  useEffect(() => {
    const fetchBestSeller = async () => {
      const result = await loadBestSeller();

      if (result.success) {
        setBestSeller(result.products);
      }
    };

    fetchBestSeller();
  }, [loadBestSeller]);

  const sixNewProducts = newProducts?.products?.slice(0, 9) || [];

  if (!heros?.heroes?.length) return null;

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-container" id="home">
        <Link to="/product">
          {heros.heroes.map((hero, index) => (
            <img
              key={hero._id}
              src={hero.imageUrl}
              alt={`Hero ${index}`}
              className={`hero-image ${index === currentIndex ? "active" : ""}`}
            />
          ))}
        </Link>
      </section>

      {/* CATEGORY SECTION */}
      <section className="category-section">
        <h2 className="section-title">Shop by Category</h2>

        <div className="category-scroll">
          {categories?.map((cat) => (
            <Link to={`/category/${cat._id}`} className="category-card" key={cat._id}>
              <div className="category-image">
                <img src={cat.image} alt={cat.name} />
              </div>
              <p>{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* BEST SELLER SECTION */}
      <section id="best-seller" className="best-seller-section">
        <h2 className="section-title">Best Sellers</h2>

        <div className="best-seller-grid">
          {bestSeller.map((item) => (
            <div
              className="best-seller-product-card"
              key={item._id}
              onClick={() => navigate(`/product/${item.slug}`)}
            >
              <img src={item.images[0].url} alt={item.title} />
              <h3>{item.title}</h3>
              <div className="price">
                ₹{item.price.toFixed(2)}
                {item.discountPercent > 0 && (
                  <span className="original-price">
                    ₹{item.salePrice}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* NEWLY ARRIVED SECTION */}
      <section className="best-seller-section new-arrived-section">
        <h2 className="section-title">New Arrivals</h2>

        <div className="best-seller-grid">
          {sixNewProducts.map((item) => (
            <div
              className="best-seller-product-card"
              key={item._id}
              onClick={() => navigate(`/product/${item.slug}`)}
            >
              <img src={item.images[0].url} alt={item.title} />
              <h3>{item.title}</h3>
              <div className="price">
                ₹{item.price.toFixed(2)}
                {item.discountPercent > 0 && (
                  <span className="original-price">
                    ₹{item.salePrice}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section className="about-section" id="about">
        <div className="about-container">

          {/* Text */}
          <div className="about-content">
            <h2>About WaahYaar</h2>
            <p>
              WaahYaar is a trendy mobile accessories brand made especially for
              girls who love style, quality and cute designs 💕
            </p>
            <p>
              From premium phone cases to stylish chargers and earbuds,
              we bring accessories that match your vibe and protect your phone.
            </p>
          </div>

          {/* Image */}
          <div className="about-image">
            <img
              src="https://res.cloudinary.com/dzqwfm6ra/image/upload/v1768743838/hero/vfbp61ocwhidocaxyebl.jpg"
              alt="About WaahYaar"
            />
          </div>

        </div>
      </section>

      {/* CONTACT US SECTION */}
      <section className="contact-section" id="contact">
        <div className="contact-container">

          {/* Contact Info */}
          <div className="contact-info">
            <h2>Contact Us</h2>
            <p>
              Have questions or need help?
              We’d love to hear from you 💌
            </p>

            <div className="contact-details">
              <p>📍 India</p>
              <p>📧 support@waahyaar.com</p>
              <a href="tel:+918878071804">📞 +91 88780 71804</a>
            </div>
          </div>

          {/* Contact Form */}
          <form className="contact-form">
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <textarea placeholder="Your Message"></textarea>
            <button type="submit">Send Message</button>
          </form>

        </div>
      </section>
    </>
  );
};

export default Home;