import { ArrowUpRight, MessageSquareText } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import EmptyState from '../common/EmptyState'

function formatCompletedAt(timestamp) {
  const date = new Date(timestamp)

  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date)
}

function InterviewCard({ interview, error }) {
  // API error
  if (error) {
    return (
      <motion.article
        className="dashboard-card interview-card dashboard-card--empty"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.52 }}
      >
        <EmptyState
          title="Unable to load interview history"
          description={error}
        />
      </motion.article>
    )
  }

  // No interview available
  if (!interview) {
    return (
      <motion.article
        className="dashboard-card interview-card dashboard-card--empty"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.52 }}
      >
        <div className="card-heading">
          <span className="card-icon">
            <MessageSquareText size={18} />
          </span>

          <div>
            <p>Latest interview</p>
            <h3>No completed interviews yet</h3>
          </div>
        </div>

        <EmptyState
          title="No completed interview yet"
          description="Complete your first mock interview to see your score."
        />

        <Link to="/app/interview" className="card-link">
          Start interview
          <ArrowUpRight size={15} />
        </Link>
      </motion.article>
    )
  }

  // Interview available
  return (
    <motion.article
      className="dashboard-card interview-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.52 }}
    >
      <div className="card-heading">
        <span className="card-icon">
          <MessageSquareText size={18} />
        </span>

        <div>
          <p>Latest interview</p>

          <h3>{interview.targetRole}</h3>

          {interview.completedAt && (
            <small>
              Completed {formatCompletedAt(interview.completedAt)}
            </small>
          )}
        </div>

        <span className="completed-status">
          {interview.status}
        </span>
      </div>

      <div className="interview-score">
        <strong>
          {Number.isFinite(interview.overallScore)
            ? interview.overallScore
            : '—'}
        </strong>

        <span>Overall score</span>
      </div>

      <Link
        to={`/app/interview/${interview.id}/report`}
        className="card-link"
      >
        View Report
        <ArrowUpRight size={15} />
      </Link>
    </motion.article>
  )
}

export default InterviewCard
