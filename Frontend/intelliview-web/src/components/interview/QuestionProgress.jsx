function QuestionProgress({
  current,
  total,
  answered,
}) {
  const progress = total
    ? (answered / total) * 100
    : 0

  return (
    <div className="question-progress">
      <div>
        <span>
          Question {current} of {total}
        </span>

        <small>
          {answered} answered
        </small>
      </div>

      <div
        className="question-progress__track"
        role="progressbar"
        aria-valuenow={answered}
        aria-valuemin="0"
        aria-valuemax={total}
      >
        <i
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  )
}

export default QuestionProgress
