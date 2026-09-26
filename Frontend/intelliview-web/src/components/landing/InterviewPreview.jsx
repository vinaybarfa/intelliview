import { motion } from 'framer-motion'
import { Bot, MoreHorizontal, Video } from 'lucide-react'

function Waveform() {
  return (
    <div
      className="waveform"
      aria-hidden="true"
    >
      {Array.from(
        { length: 27 },
        (_, index) => (
          <i
            key={index}
            style={{
              '--height': `${18 + ((index * 17) % 55)}%`,
              '--delay': `${index * 0.045}s`,
            }}
          />
        ),
      )}
    </div>
  )
}

function InterviewPreview() {
  return (
    <section
      className="section interview-section"
      id="product"
    >
      <div className="page-width interview-layout">
        <div className="interview-copy section-heading">
          <span className="eyebrow">
            Interview intelligence
          </span>

          <h2>
            Practice with purpose.
            <br />
            <span>Show up prepared.</span>
          </h2>

          <p>
            Rehearse the conversations that matter in an
            experience built to surface your strongest answers.
          </p>
        </div>

        <motion.div
          className="interview-window"
          initial={{
            opacity: 0,
            y: 30,
            rotateX: 5,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            rotateX: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.65,
          }}
        >
          <div className="interview-window__bar">
            <div className="window-title">
              <span className="ai-orb">
                <Bot size={14} />
              </span>
              AI INTERVIEW
            </div>

            <span>Question 02 / 05</span>

            <MoreHorizontal size={19} />
          </div>

          <div className="question">
            <span>Current question</span>

            <h3>
              “How would you design a scalable REST API?”
            </h3>
          </div>

          <div className="camera-placeholder">
            <div className="camera-placeholder__grid" />

            <Video size={32} />

            <p>Your interview space</p>

            <span>Camera preview unavailable</span>

            <div className="camera-placeholder__label">
              INTELLIVIEW AI
            </div>
          </div>

          <div className="interview-window__bottom">
            <div className="recording">
              <span />
              Recording response
            </div>

            <Waveform />

            <div className="progress">
              <b>02</b>

              <i>
                <span />
              </i>

              <b>05</b>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default InterviewPreview
