import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home/Home'
import ScrollButton from './components/ScrollButton'
import Product from './pages/Product/Product'
import ProductDetail from './pages/ProductDetail/ProductDetail'

const App = () => {
   return (
    <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/product' element={<Product />} />
          <Route path='/product/:id' element={<ProductDetail />} />
        </Routes>
        <Footer />
        <ScrollButton />
    </Router>
  )
}

export default App