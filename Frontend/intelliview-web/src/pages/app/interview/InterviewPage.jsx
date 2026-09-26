import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import InterviewSetup from '../../../components/interview/InterviewSetup'
import * as interviewService from '../../../services/interviewService'

const messageFor = (error, fallback) => {
  const status = error?.response?.status

  if (status === 401) {
    return 'Your session has expired. Please sign in again.'
  }

  if (status === 400) {
    return (
      error.response?.data?.message ||
      'Enter a valid target role and question count.'
    )
  }

  return error?.response
    ? fallback
    : 'Unable to reach IntelliView. Please check your connection and try again.'
}

function InterviewPage() {
  const navigate = useNavigate()

  const [values, setValues] = useState({
    targetRole: '',
    questionCount: 3,
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const startInterview = async (event) => {
    event.preventDefault()

    if (!values.targetRole.trim()) {
      setError(
        'Enter the role you want to practice for.',
      )
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response =
        await interviewService.startInterview({
          ...values,
          targetRole: values.targetRole.trim(),
        })

      const interview = response?.data

      if (
        !interview?.interviewId ||
        !Array.isArray(interview.questions) ||
        !interview.questions.length
      ) {
        throw new Error(
          'The interview did not include any questions.',
        )
      }

      sessionStorage.setItem(
        `intelliview_interview_${interview.interviewId}`,
        JSON.stringify(interview),
      )

      navigate(
        `/app/interview/${interview.interviewId}`,
      )
    } catch (requestError) {
      setError(
        requestError.message ===
          'The interview did not include any questions.'
          ? requestError.message
          : messageFor(
              requestError,
              'Unable to start your interview.',
            ),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="interview-page">
      <motion.div
        className="interview-page__intro"
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
          INTERVIEW PRACTICE
        </span>

        <h1>
          Meet your next{' '}
          <span>best answer.</span>
        </h1>

        <p>
          A focused AI interview experience built around
          the role you want next.
        </p>
      </motion.div>

      {error && (
        <p
          className="interview-alert"
          role="alert"
        >
          {error}
        </p>
      )}

      <InterviewSetup
        values={values}
        onChange={setValues}
        onSubmit={startInterview}
        submitting={submitting}
      />
    </div>
  )
}

export default InterviewPage