
import './App.css'
import Navbar from './Components/Navbar'
import FloatingButton from './Components/FloatingButton'
import Home from './Pages/Home'
import Footer from './Components/Footer'
import CampaignPopup from './Components/CampaignPopup'
import Loader from './Components/Loader'
import React from 'react'

function App() {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(t)
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <Navbar />
      <FloatingButton />
      <Home />
      <Footer />
      <CampaignPopup />
    </>
  )
}

export default App
