import React, { useContext, useState } from 'react'
import WaahYaarContext from '../context/WaahYaarContext'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/login.css';

const Login = () => {
    const { login } = useContext(WaahYaarContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const { email, password } = formData

    const submitHandler = async (e) => {
        e.preventDefault();
        let result = await login(email, password)

        if (!result.success) {
            toast.error(result.message, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        }
        else {
            setFormData({
                email: '',
                password: ''
            })
            navigate('/admin');
        }
    }

    return (
        <>
            <div className='box'>
                <div className="loginContainer">
                    <h1>LOGIN</h1>
                    <p>Welcome! Please Enter Credentials To Access Your Account</p>
                    <form className="loginForm" onSubmit={submitHandler}>
                        <div className="first my-3">
                            <input
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                placeholder='Email Address'
                                required />

                            <input
                                name='password'
                                value={formData.password}
                                onChange={handleChange}
                                type="password"
                                placeholder='Password'
                                required />
                        </div>
                        <div className='my-4'>
                            <button className='btn'>Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login;
