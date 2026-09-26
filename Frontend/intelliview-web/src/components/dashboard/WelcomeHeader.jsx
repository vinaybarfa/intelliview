import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

function WelcomeHeader() {
  const { user } = useAuth()

  return (
    <motion.section
      className="dashboard-welcome"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div>
        <span className="dashboard-status">
          <i />
          AI Career Analysis Ready
        </span>

        <h2>
          Good morning, {user?.firstName || 'there'}.
        </h2>

        <p>
          Your career intelligence, all in one place.
        </p>
      </div>

      <div
        className="welcome-orb"
        aria-hidden="true"
      >
        <i />
        <i />

        <b>
          <Sparkles size={20} />
        </b>
      </div>
    </motion.section>
  )
}

export default WelcomeHeader
