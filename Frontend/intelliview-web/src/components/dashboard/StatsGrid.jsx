import {
  BriefcaseBusiness,
  FileText,
  MessageSquareText,
  Trophy,
} from 'lucide-react'
import { motion } from 'framer-motion'

function StatsGrid({
  resume,
  atsScore,
  jobMatchCount,
  completedInterviewCount,
  latestInterview,
  errors = {},
}) {
  // Safely convert ATS score
  const parsedAtsScore = Number(atsScore)

  const displayedAtsScore =
    Number.isFinite(parsedAtsScore) &&
    parsedAtsScore >= 0 &&
    parsedAtsScore <= 100
      ? `${parsedAtsScore}%`
      : '—'

  // Safely convert interview score
  const parsedInterviewScore = Number(
    latestInterview?.overallScore
  )

  const interviewScore =
    Number.isFinite(parsedInterviewScore) &&
    parsedInterviewScore >= 0 &&
    parsedInterviewScore <= 100
      ? parsedInterviewScore
      : '—'

  const stats = [
    [
      FileText,
      'Resume ATS Score',
      errors.ats
        ? '—'
        : displayedAtsScore,
      errors.ats
        ? 'Analysis unavailable'
        : resume
          ? 'Latest active analysis'
          : 'Not available yet',
    ],

    [
      BriefcaseBusiness,
      'Job Matches',
      errors.jobMatches
        ? '—'
        : jobMatchCount ?? 0,
      errors.jobMatches
        ? 'Not available yet'
        : 'Saved matches',
    ],

    [
      MessageSquareText,
      'Interviews Completed',
      errors.interviews
        ? '—'
        : completedInterviewCount ?? 0,
      errors.interviews
        ? 'Not available yet'
        : 'Completed sessions',
    ],

    [
      Trophy,
      'Latest Interview Score',
      interviewScore,
      errors.interviews || !latestInterview
        ? 'Not available yet'
        : 'Latest completed interview',
    ],
  ]

  return (
    <section className="stats-grid">
      {stats.map(
        ([Icon, label, value, detail], index) => (
          <motion.article
            className="stat-card"
            key={label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.08 + index * 0.07,
            }}
          >
            <span className="stat-card__icon">
              <Icon size={18} />
            </span>

            <span className="stat-card__label">
              {label}
            </span>

            <strong>{value}</strong>

            <small>{detail}</small>
          </motion.article>
        )
      )}
    </section>
  )
}

export default StatsGrid
