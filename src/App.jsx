import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Results from './pages/Results'
import Navbar from './components/Navbar'
import { useAnalysisStore } from './hooks/useViralityAnalysis'

export default function App() {
  const location = useLocation()
  const { analysisData } = useAnalysisStore()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0B' }}>
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
