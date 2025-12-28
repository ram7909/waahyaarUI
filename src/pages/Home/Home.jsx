import React, { useContext } from 'react'
import WaahyaarContext from '../../context/WaahyaarContext'
import './Home.css'

const Home = () => {
  const { home, categories } = useContext(WaahyaarContext);

  if (!home || !home.bannerImage) return null;

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-container" id="home">
        <img src={home.bannerImage.url} alt="Hero Banner" className="hero-image" />

        <div className="hero-content">
          <h1>{home.bannerTitle}</h1>
          <p>{home.bannerSubtitle}</p>
          <button className="hero-btn">Shop Now</button>
        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section className="category-section">
        <h2 className="section-title">Shop by Category</h2>

        <div className="category-scroll">
          {categories?.map((cat) => (
            <div className="category-card" key={cat._id}>
              <div className="category-image">
                <img src={cat.image.url} alt={cat.name} />
              </div>
              <p>{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BEST SELLER SECTION */}
      <section className="best-seller-section">
        <h2 className="section-title">Best Sellers</h2>

        <div className="best-seller-grid">
          {/* Card 1 */}
          <div className="product-card">
            <img
              src="https://res.cloudinary.com/dzqwfm6ra/image/upload/v1766921988/case-and-cover_zgxzvt.png"
              alt="Product"
            />
            <h3>Pink Silicone Case</h3>
            <p className="price">₹399</p>
            <button className="cart-btn">Add to Cart</button>
          </div>

          {/* Card 2 */}
          <div className="product-card">
            <img
              src="https://res.cloudinary.com/dzqwfm6ra/image/upload/v1766921988/case-and-cover_zgxzvt.png"
              alt="Product"
            />
            <h3>Wireless Earbuds</h3>
            <p className="price">₹1,299</p>
            <button className="cart-btn">Add to Cart</button>
          </div>

          {/* Card 3 */}
          <div className="product-card">
            <img
              src="https://res.cloudinary.com/dzqwfm6ra/image/upload/v1766921988/case-and-cover_zgxzvt.png"
              alt="Product"
            />
            <h3>Fast Charger</h3>
            <p className="price">₹699</p>
            <button className="cart-btn">Add to Cart</button>
          </div>
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

            <button className="about-btn">Know More</button>
          </div>

          {/* Image */}
          <div className="about-image">
            <img
              src="https://res.cloudinary.com/dzqwfm6ra/image/upload/v1766595854/waahyaar/home/banner.jpg"
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
              <p>📞 +91 98765 43210</p>
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
  )
}

export default Home