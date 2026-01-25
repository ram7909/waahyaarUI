import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../assets/productDetail.css";
import WaahyaarContext from '../context/WaahYaarContext';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getProductBySlug } = useContext(WaahyaarContext);

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {

    const getProduct = async () => {
      const result = await getProductBySlug(slug);
      if (result.success) {
        setProduct(result.product);
      }
    };

    getProduct();
  }, []);

  if (!product) return null;

  return (
    <>
      <div className="product-detail">
        {/* Image Slider */}
        <div className="image-section">
          <img
            src={product.images[activeImage].url}
            alt={product.title}
            className="main-image"
          />

          <div className="thumbnail-row">
            {product.images.map((img, index) => (
              <img
                key={img._id}
                src={img.url}
                alt=""
                className={`thumbnail ${activeImage === index ? "active" : ""
                  }`}
                onClick={() => setActiveImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="info-section">
          <h1>{product.title}</h1>
          <p className="desc">{product.description}</p>

          <div className="price">
            ₹{product.price.toFixed(2)}
            {product.discountPercent > 0 && (
              <span className="original">₹{product.salePrice}</span>
            )}
          </div>

          {/* Stock Status */}
          {product.stock === 0 ? (
            <p className="stock out">Out of Stock</p>
          ) : product.stock <= 10 ? (
            <p className="stock low">
              Only {product.stock} pieces left
            </p>
          ) : (
            <p className="stock in">In Stock</p>
          )}


          <button onClick={() => navigate(`/order/${slug}`)} className="buy-btn">Buy Now</button>
        </div>
      </div>
    </>
  );
};

export default ProductDetail