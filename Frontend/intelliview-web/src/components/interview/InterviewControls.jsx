import { ArrowRight, Check, Send } from 'lucide-react'

function InterviewControls({
  submitted,
  isFinalQuestion,
  submitting,
  completing,
  canSubmit,
  onSubmit,
  onNext,
  onFinish,
}) {
  if (submitted) {
    return (
      <div className="interview-controls">
        <p>
          <Check size={15} />
          Answer submitted and evaluated.
        </p>

        {isFinalQuestion ? (
          <button
            className="button interview-primary"
            type="button"
            onClick={onFinish}
            disabled={completing}
          >
            {completing
              ? 'Finishing interview…'
              : 'Finish Interview'}
            <Check size={16} />
          </button>
        ) : (
          <button
            className="button interview-primary"
            type="button"
            onClick={onNext}
          >
            Next Question
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="interview-controls">
      <span>
        Take your time—your response is evaluated by AI after submission.
      </span>

      <button
        className="button interview-primary"
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit || submitting}
      >
        {submitting ? 'Submitting answer…' : 'Submit Answer'}
        <Send size={15} />
      </button>
    </div>
  )
}

export default InterviewControls
