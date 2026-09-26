import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function FinalCTA() {
  return (
    <section
      className="final-cta"
      id="get-started"
    >
      <div className="final-cta__glow" />

      <motion.div
        className="page-width final-cta__content"
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.55,
        }}
      >
        <span className="eyebrow">
          Your next chapter starts here
        </span>

        <h2>
          Ready to see what
          <br />
          <span>you’re capable of?</span>
        </h2>

        <p>
          Turn your resume into a strategy, your applications into
          opportunities, and your interviews into confidence.
        </p>

        <Link
          className="button"
          to="/register"
        >
          Start Your Journey
          <ArrowRight size={17} />
        </Link>
      </motion.div>
    </section>
  )
}

export default FinalCTA
