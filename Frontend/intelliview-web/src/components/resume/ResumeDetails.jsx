import {
  CalendarDays,
  FileBadge,
  LoaderCircle,
  Sparkles,
} from 'lucide-react'

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
      }).format(new Date(value))
    : 'Not available'

const signalGroups = (analysis) => [
  ['Strengths', analysis?.strengths],
  [
    'Priority improvements',
    analysis?.priorityImprovements || analysis?.improvements,
  ],
  ['Matched skills', analysis?.matchedSkills],
  ['Missing skills', analysis?.missingSkills],
  ['Matched education', analysis?.matchedEducation],
  ['Missing education', analysis?.missingEducation],
  ['Matched experience', analysis?.matchedExperience],
  ['Missing experience', analysis?.missingExperience],
  ['Matched projects', analysis?.matchedProjects],
  ['Missing projects', analysis?.missingProjects],
  ['Matched certifications', analysis?.matchedCertifications],
  ['Missing certifications', analysis?.missingCertifications],
]

function ResumeDetails({
  resume,
  analysis,
  loading,
}) {
  return (
    <section className="resume-details">
      <div className="section-card-heading">
        <div>
          <p>Resume details</p>
          <h3>Profile signals</h3>
        </div>

        <FileBadge size={19} />
      </div>

      <div className="resume-meta">
        <span>
          <FileBadge size={15} />
          <b>File type</b>
          {resume.fileType || 'PDF document'}
        </span>

        <span>
          <CalendarDays size={15} />
          <b>Uploaded</b>
          {formatDate(resume.createdAt)}
        </span>

        <span>
          <Sparkles size={15} />
          <b>Status</b>
          {resume.status || 'ACTIVE'}
        </span>
      </div>

      {loading ? (
        <div className="resume-card-loading">
          <LoaderCircle
            className="spin"
            size={18}
          />
          Loading details
        </div>
      ) : (
        <div className="resume-signals">
          {signalGroups(analysis).map(
            ([label, items]) => (
              <div key={label}>
                <span className="muted-label">
                  {label}
                </span>

                {items?.length ? (
                  <ul>
                    {items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>None identified.</p>
                )}
              </div>
            ),
          )}
        </div>
      )}
    </section>
  )
}

export default ResumeDetails