import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import HeroScene from './HeroScene'

function Hero() {
  const reduceMotion = useReducedMotion()

  const rise = (delay = 0) => ({
    initial: {
      opacity: 0,
      y: reduceMotion ? 0 : 18,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    transition: {
      duration: 0.65,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  })

  return (
    <section
      className="hero-section"
      id="top"
    >
      <div className="hero-section__light hero-section__light--one" />
      <div className="hero-section__light hero-section__light--two" />

      <div className="hero-section__content page-width">
        <div className="hero-copy">
          <motion.div
            className="eyebrow"
            {...rise(0.13)}
          >
            <Sparkles size={14} />
            Career intelligence, made personal
          </motion.div>

          <motion.h1 {...rise(0.22)}>
            Your Resume.
            <br />
            Your Skills.
            <br />
            <span>Your Next Opportunity.</span>
          </motion.h1>

          <motion.p {...rise(0.34)}>
            IntelliView uses AI to analyze your resume, match you with
            opportunities, and prepare you for the interview that comes next.
          </motion.p>

          <motion.div
            className="hero-copy__actions"
            {...rise(0.45)}
          >
            <Link
              className="button"
              to="/register"
            >
              Start Your Journey
              <ArrowRight size={17} />
            </Link>

            <a
              className="button button--quiet"
              href="#product"
            >
              Explore IntelliView
            </a>
          </motion.div>
        </div>

        <motion.div
          className="hero-scene-wrap"
          initial={{
            opacity: 0,
            scale: reduceMotion ? 1 : 0.94,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.9,
            delay: 0.4,
            ease: 'easeOut',
          }}
        >
          <HeroScene />

          <div className="scene-caption scene-caption--top">
            <span className="status-dot" />
            Intelligence core active
          </div>

          <div className="scene-caption scene-caption--bottom">
            PROFILE <strong>ANALYSIS</strong>
            <span> 98.4%</span>
          </div>
        </motion.div>
      </div>

      <div
        className="hero-scroll"
        aria-hidden="true"
      >
        <span />
        Scroll to discover
      </div>
    </section>
  )
}

export default Hero
