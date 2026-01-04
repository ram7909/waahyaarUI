import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";
import WaahyaarContext from "../../context/WaahyaarContext";

const ProductDetail = () => {
    const { id } = useParams();
    const { url } = useContext(WaahyaarContext);
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await axios.get(
                `${url}/product/${id}`
            );
            setProduct(res.data);
        };

        fetchProduct();
    }, [id]);

    if (!product) return null;

    return (
        <div className="product-detail">
            {/* Image Slider */}
            <div className="image-section">
                <img
                    src={product.images[activeImage].url}
                    alt={product.name}
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
                <h1>{product.name}</h1>
                <p className="desc">{product.description}</p>

                <div className="price">
                    ₹{product.finalPrice.toFixed(2)}
                    {product.discountPercent > 0 && (
                        <span className="original">₹{product.price}</span>
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


                <button className="buy-btn">Buy Now</button>
            </div>
        </div>
    );
};

export default ProductDetail;
