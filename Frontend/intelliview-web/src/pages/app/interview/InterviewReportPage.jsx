import { useEffect, useState } from 'react'
import {
  ChevronDown,
  FileText,
  Sparkles,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Link,
  useParams,
} from 'react-router-dom'
import InterviewSummary from '../../../components/interview/InterviewSummary'

const messageFor = (error) => {
  const status = error?.response?.status

  if (status === 401) {
    return 'Your session has expired. Please sign in again.'
  }

  if (status === 404) {
    return 'This interview could not be found.'
  }

  if (status === 400) {
    return 'This interview report is not available yet.'
  }

  return error?.response
    ? 'Unable to load this interview report.'
    : 'Unable to reach IntelliView. Please check your connection and try again.'
}

function QuestionAnalysis({ question }) {
  const [open, setOpen] = useState(false)

  return (
    <article className="question-analysis glass-panel">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>
          <small>
            QUESTION {question.questionOrder}
          </small>

          <strong>
            {question.questionText}
          </strong>
        </span>

        <b>{question.overallScore}%</b>

        <ChevronDown
          size={18}
          className={
            open
              ? 'question-analysis__chevron question-analysis__chevron--open'
              : 'question-analysis__chevron'
          }
        />
      </button>

      {open && (
        <div className="question-analysis__body">
          <ScoreBreakdown question={question} />

          <div>
            <h4>Your answer</h4>
            <p>{question.answerText}</p>
          </div>

          <div>
            <h4>AI feedback</h4>
            <p>{question.aiFeedback}</p>
          </div>
        </div>
      )}
    </article>
  )
}

function InterviewReportPage() {
  const { interviewId } = useParams()

  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    interviewService
      .getInterviewReport(interviewId)
      .then((response) => {
        if (active) {
          setReport(response?.data || null)
          setError('')
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(messageFor(requestError))
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
  }, [interviewId, reloadKey])

  if (loading) {
    return <LoadingScreen />


  }

  if (error || !report) {
    return (
      <div className="interview-unavailable glass-panel">
        <FileText size={25} />

        <h1>Report unavailable</h1>

        <p>
          {error ||
            'This report could not be loaded.'}
        </p>

        <div className="unavailable-actions">
          <button
            className="button button--quiet"
            type="button"
            onClick={() =>
              setReloadKey((key) => key + 1)
            }
          >
            Try again
          </button>

          <Link
            className="button"
            to="/app/interview"
          >
            Start an interview
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="interview-report">
      <motion.section
        className="report-hero glass-panel"
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
          <Sparkles size={13} />
          AI interview report
        </span>

        <h1>
          Interview <span>Complete</span>
        </h1>

        <div className="overall-score">
          <strong>
            {report.overallScore}%
          </strong>

          <span>Overall score</span>
        </div>

        <p className="report-hero__note">
          Technical, communication, and confidence
          scores are shown exactly as evaluated for
          each response below.
        </p>
      </motion.section>

      <InterviewSummary report={report} />

      <section className="question-analysis-list">
        <header>
          <span className="eyebrow">
            DETAILED FEEDBACK
          </span>

          <h2>
            Question-by-question analysis
          </h2>

          <p>
            Open each response to review your answer
            and the AI’s exact feedback.
          </p>
        </header>

        {report.questions?.map((question) => (
          <QuestionAnalysis
            question={question}
            key={question.questionId}
          />
        ))}
      </section>
    </div>
  )
}

export default InterviewReportPage