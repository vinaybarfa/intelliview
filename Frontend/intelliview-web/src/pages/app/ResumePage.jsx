import { useEffect, useState } from 'react'
import { FileSearch } from 'lucide-react'
import { motion } from 'framer-motion'
import * as resumeService from '../../services/resumeService'
import LoadingScreen from '../../components/common/LoadingScreen'
import EmptyState from '../../components/common/EmptyState'
import ResumeUpload from '../../components/resume/ResumeUpload'
import ResumeCard from '../../components/resume/ResumeCard'
import ATSScoreCard from '../../components/resume/ATSScoreCard'
import ResumeOptimization from '../../components/resume/ResumeOptimization'
import ResumeDetails from '../../components/resume/ResumeDetails'

const friendlyError = (error, fallback) => {
  const status = error?.response?.status

  if (status === 401) {
    return 'Your session has expired. Please sign in again.'
  }

  if (status === 403) {
    return 'You do not have permission to access this resume.'
  }

  if (status === 404) {
    return 'That resume could not be found.'
  }

  if (status === 400) {
    return 'Please check your resume file and target role, then try again.'
  }

  return error?.response
    ? fallback
    : 'Unable to reach IntelliView. Please check your connection and try again.'
}

function ResumePage() {
  const [resumes, setResumes] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [optimization, setOptimization] = useState(null)
  const [loading, setLoading] = useState(true)
  const [analysisLoading, setAnalysisLoading] =
    useState(false)
  const [analysisError, setAnalysisError] = useState('')
  const [analysisRetryKey, setAnalysisRetryKey] =
    useState(0)
  const [error, setError] = useState('')

  const selectedResume =
    resumes.find(
      (resume) => resume.id === selectedId,
    ) || null

  const loadResumes = async (preferredId) => {
    setLoading(true)
    setError('')

    try {
      const list =
        (await resumeService.getResumes()) || []

      setResumes(list)
      setSelectedId(
        preferredId || list[0]?.id || null,
      )
    } catch (requestError) {
      setError(
        friendlyError(
          requestError,
          'Unable to load your resumes.',
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResumes()
  }, [])

  useEffect(() => {
    if (!selectedResume) {
      setAnalysis(null)
      setOptimization(null)
      setAnalysisError('')
      return
    }

    let active = true

    const loadAnalysis = async () => {
      setAnalysisLoading(true)
      setAnalysis(null)
      setAnalysisError('')
      setOptimization(null)

      try {
        const report =
          await resumeService.getResumeAnalysis(
            selectedResume.id,
          )

        if (active) {
          setAnalysis(report ?? null)
        }
      } catch (requestError) {
        if (active) {
          const message = friendlyError(
            requestError,
            'Unable to load the ATS analysis.',
          )

          setAnalysisError(message)
          setError(message)
        }
      } finally {
        if (active) {
          setAnalysisLoading(false)
        }
      }
    }

    loadAnalysis()

    return () => {
      active = false
    }
  }, [selectedId, analysisRetryKey])

  const uploaded = async (resumeId) => {
    await loadResumes(resumeId)
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="resume-page">
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
          <FileSearch size={14} />
          Resume intelligence
        </span>

        <h2>
          Build a resume that{' '}
          <span>moves you forward.</span>
        </h2>

        <p>
          Understand how your resume performs, then use
          AI-guided recommendations to make every
          application stronger.
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
            onClick={() => {
              if (selectedResume) {
                setAnalysisRetryKey(
                  (key) => key + 1,
                )
              } else {
                loadResumes(selectedId)
              }
            }}
          >
            Try again
          </button>
        </div>
      )}

      {!resumes.length ? (
        <section className="resume-empty">
          <EmptyState
            title="Your resume workspace is ready"
            description="Upload a PDF to unlock ATS analysis and targeted AI recommendations."
          />

          <ResumeUpload
            onUploaded={uploaded}
          />
        </section>
      ) : (
        <>
          <div className="resume-toolbar">
            <div className="resume-tabs">
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  selected={
                    resume.id === selectedId
                  }
                  onSelect={() => {
                    setError('')
                    setSelectedId(resume.id)
                  }}
                />
              ))}
            </div>
          </div>

          {selectedResume && (
            <div className="resume-overview">
              <ATSScoreCard
                resume={selectedResume}
                analysis={analysis}
                loading={analysisLoading}
                error={analysisError}
              />

              <ResumeDetails
                resume={selectedResume}
                analysis={analysis}
                loading={analysisLoading}
              />
            </div>
          )}

          <ResumeOptimization
            resumeId={selectedId}
            result={optimization}
            onResult={setOptimization}
            onError={(requestError) =>
              setError(
                friendlyError(
                  requestError,
                  'Unable to generate optimization recommendations.',
                ),
              )
            }
          />

          <ResumeUpload
            onUploaded={uploaded}
          />
        </>
      )}
    </div>
  )
}

export default ResumePage