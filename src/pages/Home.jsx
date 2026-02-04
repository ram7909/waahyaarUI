import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import WaahYaarContext from "../context/WaahYaarContext";
import "../assets/home.css";

const Home = () => {
  const { heros, categories, loadBestSeller, newProducts } =
    useContext(WaahYaarContext);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [bestSeller, setBestSeller] = useState([]);
  const navigate = useNavigate();

  // ===== HERO SLIDER =====
  useEffect(() => {
    if (!heros?.heroes?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex(
        (prev) => (prev + 1) % heros.heroes.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [heros]);

  // ===== BEST SELLER FETCH =====
  useEffect(() => {
    const fetchBestSeller = async () => {
      const result = await loadBestSeller();
      if (result?.success) {
        setBestSeller(result.products);
      }
    };
    fetchBestSeller();
  }, [loadBestSeller]);

  if (!heros?.heroes?.length) return null;

  // ===== PRODUCT PREVIEW HELPER =====
  const getProductPreview = (product) => {

    // SIMPLE PRODUCT
    if (product.productType === "simple") {
      return {
        price: product.price,
        salePrice: product.salePrice,
        discountPercent: product.discountPercent,
        image: product.images?.[0]?.url
      };
    }

    // VARIANT PRODUCT
    const firstVariant = product.variants?.[0];
    const firstColor = firstVariant?.colors?.[0];

    return {
      price: firstColor?.price,
      salePrice: firstColor?.salePrice,
      discountPercent: firstColor?.discountPercent,
      image: product?.images?.[0]?.url
    };
  };

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="hero-container" id="home">
        <Link to="/product">
          {heros.heroes.map((hero, index) => (
            <img
              key={hero._id}
              src={hero.imageUrl}
              alt={`Hero ${index}`}
              className={`hero-image ${
                index === currentIndex ? "active" : ""
              }`}
            />
          ))}
        </Link>
      </section>

      {/* ===== CATEGORY SECTION ===== */}
      <section className="category-section">
        <h2 className="section-title">Shop by Category</h2>

        <div className="category-scroll">
          {categories?.map((cat) => (
            <Link
              to={`/category/${cat._id}`}
              className="category-card"
              key={cat._id}
            >
              <div className="category-image">
                <img src={cat.image} alt={cat.name} />
              </div>
              <p>{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== BEST SELLER SECTION ===== */}
      <section className="best-seller-section">
        <h2 className="section-title">Best Sellers</h2>

        <div className="best-seller-grid">
          {bestSeller.map((item) => {
            const preview = getProductPreview(item);

            return (
              <div
                className="best-seller-product-card"
                key={item._id}
                onClick={() =>
                  navigate(`/product/${item.slug}`)
                }
              >
                <img src={preview.image} alt={item.title} />
                <h3>{item.title}</h3>

                <div className="price">
                  ₹{preview.salePrice?.toFixed(2)}
                  {preview.discountPercent > 0 && (
                    <span className="original-price">
                      ₹{preview.price?.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== NEW ARRIVALS SECTION ===== */}
      <section className="best-seller-section new-arrived-section">
        <h2 className="section-title">New Arrivals</h2>

        <div className="best-seller-grid">
          {newProducts?.products?.map((item) => {
            const preview = getProductPreview(item);

            return (
              <div
                className="best-seller-product-card"
                key={item._id}
                onClick={() =>
                  navigate(`/product/${item.slug}`)
                }
              >
                <img src={preview.image} alt={item.title} />
                <h3>{item.title}</h3>

                <div className="price">
                  ₹{preview.salePrice?.toFixed(2)}
                  {preview.discountPercent > 0 && (
                    <span className="original-price">
                      ₹{preview.price?.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="about-section" id="about">
        <div className="about-container">
          <div className="about-content">
            <h2>About WaahYaar</h2>
            <p>
              WaahYaar is a trendy mobile accessories brand made
              especially for girls who love style, quality and
              cute designs 💕
            </p>
            <p>
              From premium phone cases to stylish chargers and
              earbuds, we bring accessories that match your vibe
              and protect your phone.
            </p>
          </div>

          <div className="about-image">
            <img
              src="https://res.cloudinary.com/dzqwfm6ra/image/upload/v1768743838/hero/vfbp61ocwhidocaxyebl.jpg"
              alt="About WaahYaar"
            />
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section className="contact-section" id="contact">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Contact Us</h2>
            <p>
              Have questions or need help?
              We’d love to hear from you 💌
            </p>

            <div className="contact-details">
              <p>📍 India</p>
              <p>📧 support@waahyaar.com</p>
              <a href="tel:+918878071804">
                📞 +91 88780 71804
              </a>
            </div>
          </div>

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
