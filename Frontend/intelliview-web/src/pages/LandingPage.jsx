import { useEffect } from 'react'
import Lenis from 'lenis'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import IntelligenceFlow from '../components/landing/IntelligenceFlow'
import WhyIntelliView from '../components/landing/WhyIntelliView'
import InterviewPreview from '../components/landing/InterviewPreview'
import FinalCTA from '../components/landing/FinalCTA'
import Footer from '../components/landing/Footer'

function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    let frame
    const animate = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  return (
    <main>
      <Navbar />
      <Hero />
      <IntelligenceFlow />
      <WhyIntelliView />
      <InterviewPreview />
      <FinalCTA />
      <Footer />
    </main>
  )
}

export default LandingPage