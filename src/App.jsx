import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home/Home'
import ScrollButton from './components/ScrollButton'

const App = () => {
   return (
    <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
        <Footer />
        <ScrollButton />
    </Router>
  )
}

export default App