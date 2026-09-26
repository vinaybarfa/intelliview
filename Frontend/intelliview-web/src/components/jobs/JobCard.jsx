import {
    ArrowUpRight,
    BriefcaseBusiness,
    MapPin,
    Timer,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function JobCard({ job, index }) {
    return (
        <motion.article
            className="job-card"
            initial={{ opacity: 0, y: 13 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.35,
                delay: index * 0.05,
            }}
        >
            <span className="job-logo">
                <BriefcaseBusiness size={20} />
            </span>

            <div className="job-card__main">
                <div className="job-card__title">
                    <div>
                        <h3>{job.title}</h3>
                        <p>{job.companyName}</p>
                    </div>

                    <span className="job-status">
                        {job.status || 'ACTIVE'}
                    </span>
                </div>

                <div className="job-meta">
                    <span>
                        <MapPin size={13} />
                        {job.location || 'Location not specified'}
                    </span>

                    <span>
                        <Timer size={13} />
                        {job.employmentType || 'Employment type not specified'}
                    </span>
                </div>

                <p className="job-card__description">
                    {job.description}
                </p>
            </div>

            <Link
                className="job-view"
                to={`/app/jobs/${job.id}`}
            >
                View details
                <ArrowUpRight size={15} />
            </Link>
        </motion.article>
    )
}

export default JobCard
