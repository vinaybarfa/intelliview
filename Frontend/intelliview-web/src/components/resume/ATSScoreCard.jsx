import {
  CheckCircle2,
  LoaderCircle,
  Target,
} from 'lucide-react'

function ATSScoreCard({
  resume,
  analysis,
  loading,
  error,
}) {
  const displayScore = Number.isFinite(
    analysis?.overallScore,
  )
    ? analysis.overallScore
    : null

  return (
    <section className="resume-score-card">
      <div className="section-card-heading">
        <div>
          <p>ATS analysis</p>
          <h3>Resume performance</h3>
        </div>

        <Target size={19} />
      </div>

      {loading ? (
        <div className="resume-card-loading">
          <LoaderCircle
            className="spin"
            size={20}
          />
          Analyzing resume…
        </div>
      ) : error ? (
        <div
          className="resume-card-loading"
          role="alert"
        >
          {error}
        </div>
      ) : (
        <>
          <div className="resume-score-card__body">
            <div
              className="resume-score-ring"
              style={{
                '--score': `${displayScore ?? 0}%`,
              }}
            >
              <div>
                <strong>
                  {displayScore ?? '—'}
                </strong>

                <span>/100</span>
              </div>
            </div>

            <div>
              <span className="muted-label">
                OVERALL ATS SCORE
              </span>

              <p>
                {analysis?.summary ||
                  'Analysis is not available for this resume yet.'}
              </p>

              <span
                className={`ai-status ${
                  resume.aiProcessed
                    ? 'ai-status--ready'
                    : ''
                }`}
              >
                <CheckCircle2 size={13} />

                {resume.aiProcessed
                  ? 'AI processing complete'
                  : 'Analysis pending'}
              </span>
            </div>
          </div>

          {analysis?.categoryScores && (
            <div className="ats-categories">
              {Object.entries(
                analysis.categoryScores,
              ).map(
                ([category, categoryScore]) => (
                  <span key={category}>
                    <b>{category}</b>
                    {categoryScore}% ·{' '}
                    {analysis.categoryStatus?.[
                      category
                    ] || 'NOT ASSESSED'}
                  </span>
                ),
              )}
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default ATSScoreCard