const interpretation = (score) => {
  if (score >= 80) return 'Excellent Match'
  if (score >= 65) return 'Strong Match'
  if (score >= 45) return 'Moderate Match'

  return 'Needs Improvement'
}

const metrics = [
  ['Skills Match', 'skillsMatchScore'],
  ['Keyword Match', 'keywordMatchScore'],
  ['Experience Match', 'experienceMatchScore'],
  ['Education Match', 'educationMatchScore'],
]

function MatchScoreCard({ result }) {
  const score = result.matchScore ?? 0

  return (
    <section className="match-score-card">
      <div
        className="match-score-ring"
        style={{
          '--score': `${score}%`,
        }}
      >
        <div>
          <strong>{score}%</strong>
          <span>match score</span>
        </div>
      </div>

      <div className="match-score-copy">
        <span className="muted-label">
          {interpretation(score)}
        </span>

        <h4>{result.jobTitle}</h4>

        <p>{result.companyName}</p>
      </div>

      <div className="match-metrics">
        {metrics.map(([label, field]) => (
          <div key={field}>
            <span>{label}</span>

            <b>
              {result[field] ?? 0}%
            </b>

            <i>
              <i
                style={{
                  width: `${result[field] ?? 0}%`,
                }}
              />
            </i>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MatchScoreCard
