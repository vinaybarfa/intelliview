import { useMemo, useState } from 'react'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import InterviewHeader from '../../../components/interview/InterviewHeader'
import QuestionProgress from '../../../components/interview/QuestionProgress'
import QuestionCard from '../../../components/interview/QuestionCard'
import AnswerBox from '../../../components/interview/AnswerBox'
import InterviewControls from '../../../components/interview/InterviewControls'
import CameraPreview from '../../../components/interview/CameraPreview'
import MediaControls from '../../../components/interview/MediaControls'
import useInterviewMedia from '../../../hooks/useInterviewMedia'
import useSpeechRecognition from '../../../hooks/useSpeechRecognition'
import useTextToSpeech from '../../../hooks/useTextToSpeech'
import QuestionVoiceControls from '../../../components/interview/QuestionVoiceControls'
import * as interviewService from '../../../services/interviewService'

const messageFor = (error, fallback) => {
  const status = error?.response?.status

  if (status === 401) {
    return 'Your session has expired. Please sign in again.'
  }

  if (status === 404) {
    return 'This interview or question could not be found.'
  }

  if (status === 400) {
    return (
      error.response?.data?.message ||
      'Your answer could not be submitted.'
    )
  }

  return error?.response
    ? fallback
    : 'Unable to reach IntelliView. Please check your connection and try again.'
}

const readInterview = (interviewId) => {
  try {
    const saved = JSON.parse(
      sessionStorage.getItem(
        `intelliview_interview_${interviewId}`,
      ),
    )

    return saved?.interviewId &&
      Array.isArray(saved.questions)
      ? saved
      : null
  } catch {
    return null
  }
}

function InterviewSessionPage() {
  const { interviewId } = useParams()
  const navigate = useNavigate()

  const [interview, setInterview] = useState(() =>
    readInterview(interviewId),
  )

  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = readInterview(interviewId)

    return saved
      ? Math.min(
          saved.answeredQuestions || 0,
          Math.max(0, saved.questions.length - 1),
        )
      : 0
  })

  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [error, setError] = useState('')

  const question = useMemo(
    () => interview?.questions?.[currentIndex],
    [interview, currentIndex],
  )

  const media = useInterviewMedia(
    Boolean(interview && question),
  )

  const speech = useSpeechRecognition()
  const voice = useTextToSpeech()

  const persist = (next) => {
    setInterview(next)

    sessionStorage.setItem(
      `intelliview_interview_${interviewId}`,
      JSON.stringify(next),
    )
  }

  const submit = async () => {
    voice.stop()

    if (!speech.transcript.trim() || !question) {
      setError(
        'Please provide an answer before continuing.',
      )
      return
    }

    if (speech.isListening) {
      setError(
        'Stop speaking before submitting your answer.',
      )
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response =
        await interviewService.submitAnswer(
          interviewId,
          question.questionId,
          speech.transcript.trim(),
        )

      const action = response?.data

      persist({
        ...interview,
        answeredQuestions:
          action?.answeredQuestions ??
          interview.answeredQuestions + 1,
      })

      speech.stopListening()
      setSubmitted(true)
    } catch (requestError) {
      setError(
        messageFor(
          requestError,
          'Unable to submit your answer.',
        ),
      )
    } finally {
      setSubmitting(false)
    }
  }

  const next = () => {
    voice.stop()
    speech.clearTranscript()
    setCurrentIndex((index) => index + 1)
    setSubmitted(false)
    setError('')
  }

  const finish = async () => {
    voice.stop()
    speech.stopListening()
    setCompleting(true)
    setError('')

    try {
      await interviewService.completeInterview(
        interviewId,
      )

      sessionStorage.removeItem(
        `intelliview_interview_${interviewId}`,
      )

      navigate(
        `/app/interview/${interviewId}/report`,
        {
          replace: true,
        },
      )
    } catch (requestError) {
      setError(
        messageFor(
          requestError,
          'Unable to complete the interview.',
        ),
      )
    } finally {
      setCompleting(false)
    }
  }

  if (!interview || !question) {
    return (
      <div className="interview-unavailable glass-panel">
        <AlertTriangle size={25} />

        <h1>Interview session unavailable</h1>

        <p>
          This browser does not have the start response for
          this in-progress interview. Start a new interview
          to continue with its securely returned questions.
        </p>

        <Link
          className="button"
          to="/app/interview"
        >
          <ArrowLeft size={16} />
          Start an interview
        </Link>
      </div>
    )
  }

  return (
    <div className="interview-session">
      <InterviewHeader
        targetRole={interview.targetRole}
      />

      <main className="interview-session__main">
        <QuestionProgress
          current={currentIndex + 1}
          total={interview.totalQuestions}
          answered={interview.answeredQuestions}
        />

        <div className="interview-room">
          <div className="interview-room__question">
            <QuestionCard
              question={question}
              questionNumber={currentIndex + 1}
              totalQuestions={interview.totalQuestions}
            />

            <QuestionVoiceControls
              questionText={question.questionText}
              voice={voice}
            />
          </div>

          <aside className="interview-room__media">
            <CameraPreview
              stream={media.stream}
              isCameraEnabled={media.isCameraEnabled}
              permissionError={media.permissionError}
              onRequestMedia={media.requestMedia}
            />

            <MediaControls
              isCameraEnabled={media.isCameraEnabled}
              isMicrophoneEnabled={
                media.isMicrophoneEnabled
              }
              isMediaActive={media.isMediaActive}
              onToggleCamera={media.toggleCamera}
              onToggleMicrophone={
                media.toggleMicrophone
              }
            />
          </aside>
        </div>

        <AnswerBox
          value={speech.transcript}
          onChange={speech.setTranscript}
          disabled={submitted || submitting}
          speech={speech}
        />

        {error && (
          <p
            className="interview-alert"
            role="alert"
          >
            {error}
          </p>
        )}

        <InterviewControls
          submitted={submitted}
          isFinalQuestion={
            currentIndex + 1 === interview.totalQuestions
          }
          submitting={submitting}
          completing={completing}
          canSubmit={
            Boolean(speech.transcript.trim()) &&
            !speech.isListening
          }
          onSubmit={submit}
          onNext={next}
          onFinish={finish}
        />
      </main>
    </div>
  )
}

export default InterviewSessionPage