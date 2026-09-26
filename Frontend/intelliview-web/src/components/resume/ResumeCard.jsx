import { FileText } from 'lucide-react'

const formatSize = (bytes) =>
  bytes
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : 'PDF'

function ResumeCard({
  resume,
  selected,
  onSelect,
}) {
  return (
    <button
      className={`resume-card-tab ${
        selected ? 'resume-card-tab--active' : ''
      }`}
      type="button"
      onClick={onSelect}
    >
      <span>
        <FileText size={17} />
      </span>

      <div>
        <strong>{resume.originalFileName}</strong>

        <small>
          {resume.targetRole} · {formatSize(resume.fileSize)}
        </small>
      </div>
    </button>
  )
}

export default ResumeCard