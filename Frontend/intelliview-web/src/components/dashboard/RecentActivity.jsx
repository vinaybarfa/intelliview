import {
  BriefcaseBusiness,
  FileSearch,
  MessageSquareText,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import EmptyState from '../common/EmptyState'

const icons = {
  resume: FileSearch,
  match: BriefcaseBusiness,
  interview: MessageSquareText,
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function RecentActivity({ activities = [] }) {
  return (
    <motion.section
      className="dashboard-card activity-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.59 }}
    >
      <div className="section-card-heading">
        <div>
          <p>Activity</p>
          <h3>Recent activity</h3>
        </div>
      </div>

      {!activities.length ? (
        <EmptyState
          title="No recent activity yet"
          description="Your resume, job matches, and interviews will appear here as you use IntelliView."
        />
      ) : (
        <div className="activity-list">
          {activities.map((activity) => {
            const Icon = icons[activity.type] || FileSearch

            return (
              <Link
                className="activity-item"
                to={activity.to}
                key={`${activity.type}-${activity.timestamp}-${activity.title}`}
              >
                <span>
                  <Icon size={16} />
                </span>

                <div>
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                </div>

                <time dateTime={activity.timestamp}>
                  {formatTimestamp(activity.timestamp)}
                </time>
              </Link>
            )
          })}
        </div>
      )}
    </motion.section>
  )
}

export default RecentActivity