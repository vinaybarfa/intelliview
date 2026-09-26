import { BriefcaseBusiness, Sparkles } from 'lucide-react'

const roles = [
  'Software Engineer',
  'Java Developer',
  'Backend Developer',
  'Full Stack Developer',
]

const questionCounts = [3, 5, 10]

function InterviewSetup({
  values,
  onChange,
  onSubmit,
  submitting,
}) {
  return (
    <section className="interview-setup glass-panel">
      <div className="interview-setup__icon">
        <Sparkles size={20} />
      </div>

      <span className="eyebrow">
        <BriefcaseBusiness size={13} />
        AI practice session
      </span>

      <h2>AI Mock Interview</h2>

      <p>
        Practice with AI. Discover your strengths. Improve your
        interview performance.
      </p>

      <form onSubmit={onSubmit} noValidate>
        <label>
          Target role

          <input
            value={values.targetRole}
            onChange={(event) =>
              onChange({
                ...values,
                targetRole: event.target.value,
              })
            }
            placeholder="e.g. Software Engineer"
            maxLength="100"
            autoFocus
          />
        </label>

        <div className="role-suggestions">
          {roles.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() =>
                onChange({
                  ...values,
                  targetRole: role,
                })
              }
            >
              {role}
            </button>
          ))}
        </div>

        <fieldset>
          <legend>Question count</legend>

          <div className="question-counts">
            {questionCounts.map((count) => (
              <label
                key={count}
                className={
                  values.questionCount === count
                    ? 'question-count question-count--active'
                    : 'question-count'
                }
              >
                <input
                  type="radio"
                  name="questionCount"
                  value={count}
                  checked={values.questionCount === count}
                  onChange={() =>
                    onChange({
                      ...values,
                      questionCount: count,
                    })
                  }
                />

                {count}

                <small>questions</small>
              </label>
            ))}
          </div>
        </fieldset>

        <button
          className="button interview-primary"
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? 'Creating your interview…'
            : 'Start Interview'}
        </button>
      </form>
    </section>
  )
}

export default InterviewSetup
