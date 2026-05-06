import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Results from './pages/Results'
import Navbar from './components/Navbar'

export default function App() {
  const location = useLocation()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#08080A' }}>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
