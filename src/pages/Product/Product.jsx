import React, { useContext } from "react";
import WaahyaarContext from "../../context/WaahyaarContext";
import "./Product.css";
import { useNavigate } from "react-router-dom";

const Product = () => {
    const { products } = useContext(WaahyaarContext);
    const navigate = useNavigate();

    if (!products || products.length === 0) return null;

    return (
        <>
            <div className="product-section">
                <div className="product-grid">
                    {products.map((item) => (
                        <div className="product-card" key={item._id} onClick={() => navigate(`/product/${item._id}`)}>
                            <div className="product-image">
                                <img src={item.images[0].url} alt={item.name} />
                            </div>

                            <div className="product-info">
                                <h3>{item.name}</h3>

                                <div className="price">
                                    ₹{item.finalPrice.toFixed(2)}
                                    {item.discountPercent > 0 && (
                                        <span className="original-price">
                                            ₹{item.price}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Product;
