import { useEffect, useState } from 'react'
import {
  FileText,
  LoaderCircle,
  Sparkles,
} from 'lucide-react'
import { getResumes } from '../../services/resumeService'
import { matchJob } from '../../services/jobMatchingService'
import MatchScoreCard from './MatchScoreCard'
import SkillsComparison from './SkillsComparison'
import JobRecommendations from './JobRecommendations'

const errorMessage = (error, fallback) => {
  const status = error?.response?.status

  if (status === 401) {
    return 'Your session has expired. Please sign in again.'
  }

  if (status === 403) {
    return 'You do not have permission to access this data.'
  }

  if (status === 404) {
    return 'The requested job or resume could not be found.'
  }

  if (status === 400) {
    return 'This resume cannot be matched with the job. Please try another active resume.'
  }

  return error?.response
    ? fallback
    : 'Unable to reach IntelliView. Please check your connection and try again.'
}

function JobMatchPanel({ job }) {
  const [resumes, setResumes] = useState([])
  const [resumeId, setResumeId] = useState('')
  const [loading, setLoading] = useState(true)
  const [matching, setMatching] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    getResumes()
      .then((response) => {
        if (active) {
          const activeResumes = (response?.data || []).filter(
            (resume) => resume.status === 'ACTIVE'
          )

          setResumes(activeResumes)
          setResumeId(
            activeResumes[0]?.id?.toString() || ''
          )
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(
            errorMessage(
              requestError,
              'Unable to load your resumes.'
            )
          )
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
  }, [])

  const runMatch = async () => {
    if (!resumeId) {
      return
    }

    setMatching(true)
    setError('')

    try {
      const response = await matchJob(
        job.id,
        Number(resumeId)
      )

      setResult(response?.data || null)
    } catch (requestError) {
      setError(
        errorMessage(
          requestError,
          'Unable to match this resume right now.'
        )
      )
    } finally {
      setMatching(false)
    }
  }

  return (
    <section className="job-match-panel">
      <div className="section-card-heading">
        <div>
          <p>Resume matching</p>
          <h3>See how you align</h3>
        </div>

        <Sparkles size={18} />
      </div>

      {loading ? (
        <div className="resume-card-loading">
          <LoaderCircle
            className="spin"
            size={20}
          />
          Loading resumes
        </div>
      ) : !resumes.length ? (
        <div className="match-empty">
          <FileText size={21} />

          <strong>
            Upload an active resume first
          </strong>

          <p>
            You’ll be able to compare it with this
            opportunity from your Resume workspace.
          </p>
        </div>
      ) : (
        <>
          <div className="resume-match-select">
            <label htmlFor="match-resume">
              Choose a resume to analyze
            </label>

            <select
              id="match-resume"
              value={resumeId}
              onChange={(event) => {
                setResumeId(event.target.value)
                setResult(null)
              }}
              disabled={matching}
            >
              {resumes.map((resume) => (
                <option
                  value={resume.id}
                  key={resume.id}
                >
                  {resume.originalFileName} ·{' '}
                  {resume.targetRole}
                </option>
              ))}
            </select>

            <button
              className="button"
              type="button"
              onClick={runMatch}
              disabled={matching}
            >
              {matching ? (
                <>
                  <LoaderCircle
                    className="spin"
                    size={16}
                  />
                  Matching...
                </>
              ) : (
                'Match My Resume'
              )}
            </button>
          </div>

          {error && (
            <p
              className="resume-alert"
              role="alert"
            >
              {error}
            </p>
          )}

          {result && (
            <div className="match-result">
              <MatchScoreCard result={result} />

              <SkillsComparison result={result} />

              <JobRecommendations
                recommendations={result.recommendations}
              />
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default JobMatchPanel
