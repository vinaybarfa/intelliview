import { useEffect, useMemo, useState } from 'react'
import { BriefcaseBusiness } from 'lucide-react'
import { motion } from 'framer-motion'
import { getJobs } from '../../services/jobService'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import JobFilters from '../../components/jobs/JobFilters'
import JobCard from '../../components/jobs/JobCard'

const errorMessage = (error) => {
  const status = error?.response?.status

  if (status === 401) {
    return 'Your session has expired. Please sign in again.'
  }

  if (status === 403) {
    return 'You do not have permission to view these jobs.'
  }

  return error?.response
    ? 'Unable to load your jobs right now.'
    : 'Unable to reach IntelliView. Please check your connection and try again.'
}

function JobsPage() {
  const [jobs, setJobs] = useState([])

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    employmentType: '',
    status: '',
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadJobs = () => {
    getJobs()
      .then((response) => {
        setJobs(response?.data || [])
        setError('')
      })
      .catch((requestError) => {
        setError(errorMessage(requestError))
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const filteredJobs = useMemo(
    () =>
      jobs.filter((job) => {
        const search = filters.search
          .trim()
          .toLowerCase()

        return (
          (!search ||
            [
              job.title,
              job.companyName,
              job.description,
            ].some((value) =>
              value
                ?.toLowerCase()
                .includes(search),
            )) &&
          (!filters.location ||
            job.location === filters.location) &&
          (!filters.employmentType ||
            job.employmentType ===
              filters.employmentType) &&
          (!filters.status ||
            job.status === filters.status)
        )
      }),
    [jobs, filters],
  )

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="jobs-page">
      <motion.header
        className="page-header"
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <span className="eyebrow">
          <BriefcaseBusiness size={14} />
          Opportunity intelligence
        </span>

        <h2>
          Find the role that{' '}
          <span>fits your next move.</span>
        </h2>

        <p>
          Review your saved opportunities and see exactly
          where your resume aligns.
        </p>
      </motion.header>

      {error && (
        <div
          className="page-alert page-alert--with-action"
          role="alert"
        >
          <span>{error}</span>

          <button
            type="button"
            onClick={loadJobs}
          >
            Try again
          </button>
        </div>
      )}

      <JobFilters
        jobs={jobs}
        values={filters}
        onChange={setFilters}
      />

      {!jobs.length ? (
        <EmptyState
          title="No jobs saved yet"
          description="Your saved job opportunities will appear here when they are available."
        />
      ) : (
        <>
          <p className="results-count">
            {filteredJobs.length}{' '}
            {filteredJobs.length === 1
              ? 'opportunity'
              : 'opportunities'}{' '}
            found
          </p>

          <section className="jobs-list">
            {filteredJobs.length ? (
              filteredJobs.map((job, index) => (
                <JobCard
                  job={job}
                  index={index}
                  key={job.id}
                />
              ))
            ) : (
              <EmptyState
                title="No matching opportunities"
                description="Try adjusting your search or filters."
              />
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default JobsPage