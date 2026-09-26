import { ArrowUpRight, BriefcaseBusiness } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import EmptyState from '../common/EmptyState'

function JobMatchCard({ jobMatch, error }) {
  // API error
  if (error) {
    return (
      <motion.article
        className="dashboard-card job-card dashboard-card--empty"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.45 }}
      >
        <EmptyState
          title="Unable to load job matches"
          description={error}
        />
      </motion.article>
    )
  }

  // No job match available
  if (!jobMatch) {
    return (
      <motion.article
        className="dashboard-card job-card dashboard-card--empty"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.45 }}
      >
        <div className="card-heading">
          <span className="card-icon">
            <BriefcaseBusiness size={18} />
          </span>

          <div>
            <p>Latest job match</p>
            <h3>No job matches yet</h3>
          </div>
        </div>

        <EmptyState
          title="No job matches yet"
          description="Run a resume match from Job Matching to see your results here."
        />

        <Link to="/app/jobs" className="card-link">
          Find jobs
          <ArrowUpRight size={15} />
        </Link>
      </motion.article>
    )
  }

  return (
    <motion.article
      className="dashboard-card job-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.45 }}
    >
      <div className="card-heading">
        <span className="card-icon">
          <BriefcaseBusiness size={18} />
        </span>

        <div>
          <p>Latest job match</p>
          <h3>{jobMatch.jobTitle}</h3>
          <small>{jobMatch.companyName}</small>
        </div>

        <div className="match-score">
          <strong>
            {jobMatch.matchScore != null
              ? `${Number(jobMatch.matchScore)}%`
              : '—'}
          </strong>

          <span>match</span>
        </div>
      </div>

      <div className="skill-groups">
        <div>
          <span className="muted-label">MATCHED SKILLS</span>

          <p>
            {jobMatch.matchedSkills?.length
              ? jobMatch.matchedSkills.map((skill) => (
                  <b className="skill-tag" key={skill}>
                    {skill}
                  </b>
                ))
              : '—'}
          </p>
        </div>

        <div>
          <span className="muted-label">MISSING</span>

          <p>
            {jobMatch.missingSkills?.length
              ? jobMatch.missingSkills.map((skill) => (
                  <b
                    className="skill-tag skill-tag--missing"
                    key={skill}
                  >
                    {skill}
                  </b>
                ))
              : '—'}
          </p>
        </div>
      </div>

      <Link to="/app/jobs" className="card-link">
        View jobs
        <ArrowUpRight size={15} />
      </Link>
    </motion.article>
  )
}

export default JobMatchCard
