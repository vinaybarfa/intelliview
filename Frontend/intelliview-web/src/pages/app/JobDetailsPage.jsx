import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  Timer,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getJob } from '../../services/jobService'
import LoadingScreen from '../../components/common/LoadingScreen'
import JobMatchPanel from '../../components/jobs/JobMatchPanel'

const errorMessage = (error) => {
  const status = error?.response?.status

  if (status === 404) {
    return 'This job could not be found.'
  }

  if (status === 403) {
    return 'You do not have permission to view this job.'
  }

  return error?.response
    ? 'Unable to load this job.'
    : 'Unable to reach IntelliView. Please check your connection and try again.'
}

function JobDetailsPage() {
  const { jobId } = useParams()

  const [job, setJob] = useState(null)
  const [matching, setMatching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    getJob(jobId)
      .then((response) => {
        if (active) {
          setJob(response?.data || null)
          setError('')
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(errorMessage(requestError))
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [jobId, reloadKey])

  if (loading) {
    return <LoadingScreen />
  }

  if (error || !job) {
    return (
      <div className="jobs-page">
        <Link
          className="back-link"
          to="/app/jobs"
        >
          <ArrowLeft size={15} />
          Back to jobs
        </Link>

        <div
          className="page-alert page-alert--with-action"
          role="alert"
        >
          <span>
            {error || 'This job could not be found.'}
          </span>

          <button
            type="button"
            onClick={() =>
              setReloadKey((key) => key + 1)
            }
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="job-details-page">
      <Link
        className="back-link"
        to="/app/jobs"
      >
        <ArrowLeft size={15} />
        Back to jobs
      </Link>

      <section className="job-details-hero">
        <span className="job-logo">
          <BriefcaseBusiness size={24} />
        </span>

        <div>
          <span className="job-status">
            {job.status || 'ACTIVE'}
          </span>

          <h2>{job.title}</h2>

          <p>{job.companyName}</p>

          <div className="job-meta">
            <span>
              <MapPin size={14} />
              {job.location ||
                'Location not specified'}
            </span>

            <span>
              <Timer size={14} />
              {job.employmentType ||
                'Employment type not specified'}
            </span>
          </div>
        </div>

        <button
          className="button"
          type="button"
          onClick={() => setMatching(!matching)}
        >
          Match My Resume
        </button>
      </section>

      <div className="job-details-grid">
        <article className="job-description-card">
          <span className="muted-label">
            ABOUT THIS OPPORTUNITY
          </span>

          <h3>Role description</h3>

          <p>{job.description}</p>
        </article>

        {matching && <JobMatchPanel job={job} />}
      </div>
    </div>
  )
}

export default JobDetailsPage