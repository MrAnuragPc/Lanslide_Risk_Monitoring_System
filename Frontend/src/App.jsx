import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import RiskMap from './pages/RiskMap'
import LocationDetails from './pages/LocationDetails'
import PhotoAnalysis from './pages/PhotoAnalysis'
import AnalysisResult from './pages/AnalysisResult'
import Alerts from './pages/Alerts'
import Profile from './pages/Profile'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<RiskMap />} />
        <Route path="/location/:id" element={<LocationDetails />} />
        <Route path="/analyze" element={<PhotoAnalysis />} />
        <Route path="/result" element={<AnalysisResult />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}
