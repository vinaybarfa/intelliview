const scores = [
  ['Technical', 'technicalScore'],
  ['Communication', 'communicationScore'],
  ['Confidence', 'confidenceScore'],
]

function ScoreBreakdown({ question }) {
  return (
    <div className="report-scores">
      {scores.map(([label, key]) => (
        <div key={key}>
          <span>{label}</span>

          <strong>
            {question[key] ?? '—'}
            {question[key] == null ? '' : '%'}
          </strong>

          <i>
            <i
              style={{
                width: `${question[key] || 0}%`,
              }}
            />
          </i>
        </div>
      ))}
    </div>
  )
}

export default ScoreBreakdown
