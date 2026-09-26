import { motion } from 'framer-motion'
import {
  BriefcaseBusiness,
  ClipboardCheck,
  FileText,
  ScanSearch,
  Sparkles,
} from 'lucide-react'

const stages = [
  [
    FileText,
    'Resume',
    'Upload your resume and let IntelliView understand your profile.',
  ],
  [
    ScanSearch,
    'ATS Analysis',
    'See how your resume performs against modern ATS requirements.',
  ],
  [
    BriefcaseBusiness,
    'Job Matching',
    'Discover how well your profile matches specific opportunities.',
  ],
  [
    Sparkles,
    'AI Interview',
    'Practice realistic interviews with AI-generated questions.',
  ],
  [
    ClipboardCheck,
    'Performance Report',
    'Understand your strengths and where you can improve.',
  ],
]

function IntelligenceFlow() {
  return (
    <section
      className="section flow-section"
      id="how-it-works"
    >
      <div className="page-width">
        <div className="section-heading">
          <span className="eyebrow">The IntelliView flow</span>

          <h2>
            From application to <span>advantage.</span>
          </h2>

          <p>
            A clearer path from the resume you have to the opportunity you want.
          </p>
        </div>

        <div className="flow-list">
          {stages.map(
            ([Icon, title, description], index) => (
              <motion.article
                className="flow-stage"
                key={title}
                initial={{
                  opacity: 0,
                  y: 24,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
              >
                <div className="flow-stage__top">
                  <span className="flow-number">
                    0{index + 1}
                  </span>

                  <span className="flow-icon">
                    <Icon size={19} />
                  </span>
                </div>

                <h3>{title}</h3>

                <p>{description}</p>

                {index < stages.length - 1 && (
                  <span
                    className="flow-line"
                    aria-hidden="true"
                  />
                )}
              </motion.article>
            ),
          )}
        </div>
      </div>
    </section>
  )
}

export default IntelligenceFlow
