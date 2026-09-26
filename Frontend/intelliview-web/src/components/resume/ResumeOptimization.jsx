import { useState } from 'react'
import {
  ArrowUpRight,
  LoaderCircle,
  Sparkles,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { optimizeResume } from '../../services/resumeService'

function ResumeOptimization({
  resumeId,
  result,
  onResult,
  onError,
}) {
  const [loading, setLoading] = useState(false)

  const run = async () => {
    if (!resumeId) return

    setLoading(true)

    try {
      const response = await optimizeResume(resumeId)
      onResult(response?.data || null)
    } catch (error) {
      onError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.section
      className="optimization-card"
      initial={{
        opacity: 0,
        y: 14,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
    >
      <div className="optimization-card__header">
        <div>
          <span className="eyebrow">
            <Sparkles size={13} />
            AI optimization
          </span>

          <h3>
            Turn insight into your next best version.
          </h3>

          <p>
            Generate recommendations based on your resume
            and selected target role.
          </p>
        </div>

        <button
          className="button"
          type="button"
          disabled={loading || !resumeId}
          onClick={run}
        >
          {loading ? (
            <>
              <LoaderCircle
                className="spin"
                size={16}
              />
              Generating...
            </>
          ) : (
            <>
              Optimize Resume
              <ArrowUpRight size={16} />
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="optimization-result">
          <p className="optimization-assessment">
            {result.overallAssessment}
          </p>

          <div className="optimization-columns">
            <div>
              <span className="muted-label">
                KEY WEAKNESSES
              </span>

              <ul>
                {(result.keyWeaknesses || []).map(
                  (item) => (
                    <li key={item}>{item}</li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <span className="muted-label">
                PRIORITY RECOMMENDATIONS
              </span>

              <ul>
                {(
                  result.priorityRecommendations || []
                ).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {(result.sectionRecommendations || []).map(
            (section) => (
              <article
                className="section-recommendations"
                key={section.section}
              >
                <h4>{section.section}</h4>

                <ul>
                  {(section.recommendations || []).map(
                    (item) => (
                      <li key={item}>{item}</li>
                    ),
                  )}
                </ul>
              </article>
            ),
          )}
        </div>
      )}
    </motion.section>
  )
}

export default ResumeOptimization
