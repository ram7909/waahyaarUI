import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WaahYaarContext from "../context/WaahYaarContext";
import "../assets/order.css";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Order = () => {
  const { slug } = useParams();
  const { postBuyNow, apiUrl, getProductBySlug } = useContext(WaahYaarContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  useEffect(() => {

    const getProduct = async () => {
      const result = await getProductBySlug(slug);
      if (result.success) {
        setProduct(result.product);
      }
    };

    getProduct();
  }, []);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    quantity: 1,
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================= BUY NOW =================
  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    for (let field in validators) {
      const value = formData[field];
      const result = validators[field](value);

      if (result !== true) {
        toast.error(result, {
          position: "bottom-right",
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });

        setLoading(false);
        return;
      }
    }

    const payload = {
      productId: product._id,
      quantity: formData.quantity,
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email,
      address: {
        fullName: formData.name,
        phone: formData.mobile,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      }
    };

    const result = await postBuyNow(payload);
    setLoading(false);

    if (!result.success) {
      alert(result.message);
      return;
    }

    openRazorpay(result.razorpayOrder, result.order);
  };

  // ================= RAZORPAY =================
  const openRazorpay = (razorpayOrder, order) => {

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: razorpayOrder.amount,
      currency: "INR",
      name: "WaahYaar",
      description: "Order Payment",
      order_id: razorpayOrder.id,

      handler: async function (response) {
        await fetch(`${apiUrl}/order/payment-verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response)
        });

        toast.success("Order placed! Track via user icon on navbar using your mobile number.", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "dark",
          transition: Bounce,
        });

        navigate("/");
      },

      prefill: {
        name: formData.name,
        contact: formData.mobile,
        email: formData.email
      },

      theme: {
        color: "#000000"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const increaseQty = () => {
    setFormData(prev => {
      if (prev.quantity >= maxStock) {
        toast.error(`Only ${maxStock} item(s) available in stock`, {
          position: "bottom-right",
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
        return prev;
      }

      return {
        ...prev,
        quantity: prev.quantity + 1
      };
    });
  };


  const decreaseQty = () => {
    setFormData(prev => ({
      ...prev,
      quantity: prev.quantity > 1 ? prev.quantity - 1 : 1
    }));
  };

  const validators = {
    name: value =>
      /^[A-Za-z\s]{3,}$/.test(value) || "Enter a valid full name",

    mobile: value =>
      /^[6-9]\d{9}$/.test(value) || "Enter valid 10-digit Indian mobile number",

    email: value =>
      !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Invalid email address",

    pincode: value =>
      /^\d{6}$/.test(value) || "Enter valid 6-digit pincode",

    city: value =>
      /^[A-Za-z\s]{2,}$/.test(value) || "Enter valid city name",

    state: value =>
      /^[A-Za-z\s]{2,}$/.test(value) || "Enter valid state name",

    address: value =>
      value.length >= 10 || "Address must be at least 10 characters"
  };


  if (!product) return null;

  const unitPrice = product.discountPercent > 0 ? product.salePrice : product.price;

  const maxStock = product?.stock || 0;
  const totalPrice = unitPrice * formData.quantity;


  return (
    <>
      <div className="checkout-container">
        <div className="checkout-left">
          <h2>Delivery Details</h2>

          <form onSubmit={handleCheckout} className="orderForm">

            <div className="formGroup">
              <label>Full Name</label>
              <input name="name" placeholder="Full Name" onChange={handleChange} type="text" required />
            </div>

            <div className="formGroup">
              <label>Mobile Number</label>
              <input name="mobile" placeholder="Mobile Number" onChange={handleChange} type="number" required />
            </div>

            <div className="formGroup">
              <label>Email Address</label>
              <input name="email" placeholder="Email (optional)" onChange={handleChange} type="email" />
            </div>

            <div className="formGroup">
              <label>Address</label>
              <textarea name="address" placeholder="Address" onChange={handleChange} required />
            </div>

            <div className="formGroup">
              <label>City</label>
              <input name="city" placeholder="City" onChange={handleChange} type="text" required />
            </div>

            <div className="formGroup">
              <label>State</label>
              <input name="state" placeholder="State" onChange={handleChange} type="text" required />
            </div>

            <div className="formGroup">
              <label>Pincode</label>
              <input name="pincode" placeholder="Pincode" onChange={handleChange} type="number" required />
            </div>

            <div className="qtyBox">
              <label>Quantity</label>
              <div className="qtyControl">
                <button type="button" className="btn btnQty" onClick={decreaseQty}>−</button>

                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  readOnly
                />

                <button type="button" className="btn btnQty" onClick={increaseQty} disabled={!product || formData.quantity >= maxStock}>+</button>
              </div>
            </div>
          </form>
        </div>
        <div className="checkout-right">
          <h2>Order Summary</h2>

          <div className="product-details">
            <div className="product-image">
              <img src={product.images[0].url} alt={product.title} />
            </div>

            <div className="product-title">{product.title}</div>

            <div className="price-row">
              <span>Product Price</span>
              <span>₹{unitPrice.toFixed(2)}</span>
            </div>

            <div className="price-row">
              <span>Quantity</span>
              <span>{formData.quantity}</span>
            </div>

            <div className="price-row total">
              <span>Total Price</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>

            <button
              className="btn btnCheckout"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Processing..." : "Checkout & Pay"}
            </button>

          </div>
        </div>
      </div>
    </>
  );
};

export default Order;