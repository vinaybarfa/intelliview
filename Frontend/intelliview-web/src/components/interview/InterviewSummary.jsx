import {
  CalendarDays,
  CircleCheck,
  ListChecks,
} from 'lucide-react'

function InterviewSummary({ report }) {
  return (
    <section className="interview-summary glass-panel">
      <div>
        <span className="eyebrow">
          <CircleCheck size={13} />
          Completed interview
        </span>

        <h2>{report.targetRole}</h2>

        <p>
          <CalendarDays size={14} />
          Started {new Date(report.startedAt).toLocaleString()}
        </p>

        <p>
          <CalendarDays size={14} />
          Completed {new Date(report.completedAt).toLocaleString()}
        </p>
      </div>

      <div className="interview-summary__stats">
        <span>
          <ListChecks size={15} />
          {report.answeredQuestions} / {report.totalQuestions} answered
        </span>

        <span>{report.status}</span>
      </div>
    </section>
  )
}

export default InterviewSummary
