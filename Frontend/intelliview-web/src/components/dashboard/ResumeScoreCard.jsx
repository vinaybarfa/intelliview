import { ArrowUpRight, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import EmptyState from '../common/EmptyState'

function ResumeScoreCard({ resume, analysisScore, error }) {
  // API error
  if (error) {
    return (
      <motion.article
        className="dashboard-card resume-card dashboard-card--empty"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.38 }}
      >
        <EmptyState
          title="Unable to load resume information"
          description={error}
        />
      </motion.article>
    )
  }

  // No resume
  if (!resume) {
    return (
      <motion.article
        className="dashboard-card resume-card dashboard-card--empty"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.38 }}
      >
        <EmptyState
          title="No active resume"
          description="Upload your resume to unlock ATS intelligence."
        />

        <Link className="dashboard-button" to="/app/resume">
          Upload Resume
          <ArrowUpRight size={16} />
        </Link>
      </motion.article>
    )
  }

  // Convert API score safely to a number
  const parsedScore = Number(analysisScore)

  const score =
    Number.isFinite(parsedScore) &&
    parsedScore >= 0 &&
    parsedScore <= 100
      ? parsedScore
      : null

  return (
    <motion.article
      className="dashboard-card resume-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.38 }}
    >
      <div className="card-heading">
        <span className="card-icon">
          <FileText size={18} />
        </span>

        <div>
          <p>Resume</p>
          <h3>{resume.originalFileName}</h3>
        </div>
      </div>

      <div className="resume-card__body">
        <div>
          <span className="muted-label">ATS SCORE</span>

          <p className="resume-message">
            <span className="muted-label">AI PROCESSING</span>
            {resume.aiProcessed ? 'Complete' : 'Not complete yet'}
          </p>

          <Link
            to="/app/resume"
            className="dashboard-button"
          >
            Optimize Resume
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div
          className="score-ring"
          style={{
            '--score': `${score ?? 0}%`,
          }}
        >
          <div>
            <strong>{score ?? '—'}</strong>
            <span>/100</span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default ResumeScoreCard
