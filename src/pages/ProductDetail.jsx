import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../assets/productDetail.css";
import WaahyaarContext from "../context/WaahYaarContext";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getProductBySlug, loadProducts } = useContext(WaahyaarContext);

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);


  useEffect(() => {
    const fetchProduct = async () => {
      const res = await getProductBySlug(slug);
      if (res.success) {
        const prod = res.product;
        setProduct(prod);

        if (prod.productType === "variant") {
          setSelectedVariant(prod.variants[0]);
          setSelectedColor(prod.variants[0].colors[0]);
        }

        const allProductsRes = await loadProducts();
        if (allProductsRes?.success) {
          const filtered = allProductsRes.products.filter(
            (p) =>
              p.category === prod.category && p._id !== prod._id
          );

          setRelatedProducts(filtered.slice(0, 4));
        }
      }
    };

    fetchProduct();
  }, [slug]);

  if (!product) return null;

  /* Images */
  const images =
    product.productType === "variant" && selectedColor?.images?.length
      ? selectedColor.images
      : product.images;

  /* Price & stock */
  const price =
    product.productType === "simple"
      ? product.salePrice
      : selectedColor?.salePrice;

  const originalPrice =
    product.productType === "simple"
      ? product.price
      : selectedColor?.price;

  const discount =
    product.productType === "simple"
      ? product.discountPercent
      : selectedColor?.discountPercent;

  const stock =
    product.productType === "simple"
      ? product.stock
      : selectedColor?.stock;

  const getPreview = (product) => {
    if (product.productType === "simple") {
      return {
        price: product.price,
        salePrice: product.salePrice,
        image: product.images?.[0]?.url
      };
    }

    const v = product.variants?.[0];
    const c = v?.colors?.[0];

    return {
      price: c?.price,
      salePrice: c?.salePrice,
      image: product.images?.[0]?.url
    };
  };


  return (
    <>
      <div className="product-detail">
        {/* IMAGE */}
        <div className="image-section">
          <div className="image-wrapper">
            <button
              className="nav-btn left"
              onClick={() =>
                setActiveImage(activeImage === 0 ? images.length - 1 : activeImage - 1)
              }
            >
              ‹
            </button>

            <img
              src={images[activeImage]?.url}
              alt={product.title}
              className="main-image"
            />

            <button
              className="nav-btn right"
              onClick={() =>
                setActiveImage(activeImage === images.length - 1 ? 0 : activeImage + 1)
              }
            >
              ›
            </button>
          </div>

          <div className="thumbnail-row">
            {images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                className={`thumbnail ${activeImage === i ? "active" : ""}`}
                onClick={() => setActiveImage(i)}
              />
            ))}
          </div>
        </div>

        {/* INFO */}
        <div className="info-section">
          <h1>{product.title}</h1>
          <p className="desc">{product.description}</p>

          {/* VARIANTS */}
          {product.productType === "variant" && (
            <>
              {/* MODEL */}
              <div className="variant-group">
                <p className="variant-label">Choose Model</p>
                <div className="model-buttons">
                  {product.variants.map((v) => (
                    <button
                      key={v._id}
                      className={`variant-btn ${selectedVariant?._id === v._id ? "active" : ""
                        }`}
                      onClick={() => {
                        setSelectedVariant(v);
                        setSelectedColor(v.colors[0]);
                        setActiveImage(0);
                      }}
                    >
                      {v.deviceModel}
                    </button>
                  ))}
                </div>
              </div>

              {/* COLORS */}
              <div className="variant-group">
                <p className="variant-label">Choose Color</p>
                <div className="color-picker">
                  {selectedVariant.colors.map((c) => (
                    <span
                      key={c._id}
                      className={`color-dot ${selectedColor?._id === c._id ? "selected" : ""
                        }`}
                      style={{ backgroundColor: c.colorCode || "#ccc" }}
                      title={c.colorName}
                      onClick={() => {
                        setSelectedColor(c);
                        setActiveImage(0);
                      }}
                    />
                  ))}
                </div>

                <div className="selected-info">
                  Selected:
                  <span>{selectedVariant.deviceModel}</span> ·
                  <span>{selectedColor.colorName}</span>
                </div>
              </div>
            </>
          )}

          {/* PRICE */}
          <div className="price">
            ₹{price?.toFixed(2)}
            {discount > 0 && (
              <span className="original">₹{originalPrice?.toFixed(2)}</span>
            )}
          </div>

          {/* STOCK */}
          {stock === 0 ? (
            <p className="stock out">Out of Stock</p>
          ) : stock <= 10 ? (
            <p className="stock low">Only {stock} pieces left</p>
          ) : (
            <p className="stock in">In Stock</p>
          )}

          <button
            className="buy-btn"
            disabled={stock === 0}
            onClick={() =>
              navigate(`/order/${slug}`, {
                state: { variant: selectedVariant, color: selectedColor }
              })
            }
          >
            Buy Now
          </button>

          {/* FEATURES */}
          {product.features?.length > 0 && (
            <div className="modern-section">
              <h3>Key Features</h3>
              <div className="feature-pills">
                {product.features.map((f, i) => (
                  <span key={i} className="feature-pill">{f}</span>
                ))}
              </div>
            </div>
          )}

          {/* SPECIFICATIONS */}
          {product.specifications &&
            Object.values(product.specifications).some(v => v) && (
              <div className="modern-section">
                <h3>Specifications</h3>
                <div className="spec-cards">
                  {Object.entries(product.specifications).map(([k, v]) =>
                    v ? (
                      <div key={k} className="spec-card">
                        <span className="spec-label">{k}</span>
                        <span className="spec-value">{v}</span>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-product">
          <h4>You Might Also Like</h4>

          <div className="related-grid">
            {relatedProducts.map((item) => {
              const preview = getPreview(item);

              return (
                <div
                  key={item._id}
                  className="related-card"
                  onClick={() => navigate(`/product/${item.slug}`)}
                >
                  <img src={preview.image} alt={item.title} />
                  <h5>{item.title}</h5>

                  <p className="related-price">
                    ₹{preview.salePrice?.toFixed(2)}
                    {preview.price > preview.salePrice && (
                      <span>₹{preview.price?.toFixed(2)}</span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </>
  );
};

export default ProductDetail;
