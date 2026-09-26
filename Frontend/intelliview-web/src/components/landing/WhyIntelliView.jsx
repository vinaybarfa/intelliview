import { motion } from 'framer-motion'
import {
  BrainCircuit,
  Gauge,
  Route,
  ScanText,
} from 'lucide-react'

const features = [
  [
    ScanText,
    'Smarter Resume Analysis',
    'Understand what recruiters and ATS systems see.',
  ],
  [
    BrainCircuit,
    'AI-Powered Optimization',
    'Get actionable suggestions to strengthen your resume.',
  ],
  [
    Route,
    'Intelligent Job Matching',
    'Measure your fit against specific opportunities.',
  ],
  [
    Gauge,
    'Realistic AI Interviews',
    'Practice answering questions and receive detailed feedback.',
  ],
]

function WhyIntelliView() {
  return (
    <section
      className="section features-section"
      id="features"
    >
      <div className="page-width features-layout">
        <div className="section-heading">
          <span className="eyebrow">
            Built for momentum
          </span>

          <h2>
            Everything you need to{' '}
            <span>move forward.</span>
          </h2>

          <p>
            Intelligence that makes every career decision more informed.
          </p>
        </div>

        <div className="features-list">
          {features.map(
            ([Icon, title, text], index) => (
              <motion.article
                className="feature"
                key={title}
                initial={{
                  opacity: 0,
                  x: 18,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                }}
              >
                <div className="feature__icon">
                  <Icon size={22} />
                </div>

                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </motion.article>
            ),
          )}
        </div>
      </div>
    </section>
  )
}

export default WhyIntelliView