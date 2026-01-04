import React, { useEffect, useState } from 'react'
import WaahyaarContext from './WaahyaarContext'
import axios from 'axios'

const WaahyaarState = (props) => {
    //const url = "http://localhost:5000/api";
    const url = "https://waahyaarapi.onrender.com/api";
    const [home, setHome] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    
    // Home Page Detail
    const LoadBanner = async () => {

        const api = await axios.get(`${url}/home`, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        setHome(api.data);
    }

    // Category Detail
    const LoadCategories = async () => {

        const api = await axios.get(`${url}/categories`, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        setCategories(api.data);
    }

    // Load All Product
    const LoadProducts = async () =>{
        const api = await axios.get(`${url}/products`,{
            headers:{
                "Content-Type":"application/json"
            }
        })
        setProducts(api.data);
    }

    useEffect(() => {
        LoadBanner();
        LoadCategories();
        LoadProducts();
    }, []) 

    return (
        <WaahyaarContext.Provider value={{url, home, categories, products}}>
            {props.children}
        </WaahyaarContext.Provider>
    )
}

export default WaahyaarState