import { useRef, useState } from 'react'
import {
  FileUp,
  LoaderCircle,
  Upload,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { uploadResume } from '../../services/resumeService'

const MAX_FILE_SIZE = 10 * 1024 * 1024

const roles = [
  ['ai-engineer', 'AI Engineer'],
  ['backend-developer', 'Backend Developer'],
  ['business-analyst', 'Business Analyst'],
  ['data-analyst', 'Data Analyst'],
  ['data-scientist', 'Data Scientist'],
  ['devops-engineer', 'DevOps Engineer'],
  ['frontend-developer', 'Frontend Developer'],
  ['fullstack-developer', 'Fullstack Developer'],
  ['java-developer', 'Java Developer'],
  [
    'machine-learning-engineer',
    'Machine Learning Engineer',
  ],
  ['product-manager', 'Product Manager'],
  ['python-developer', 'Python Developer'],
  ['react-developer', 'React Developer'],
  ['software-engineer', 'Software Engineer'],
  ['ui-ux-designer', 'UI/UX Designer'],
]

function ResumeUpload({ onUploaded }) {
  const inputRef = useRef(null)

  const [file, setFile] = useState(null)
  const [targetRole, setTargetRole] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const choose = (candidate) => {
    if (!candidate) return

    if (
      candidate.type !== 'application/pdf' &&
      !candidate.name.toLowerCase().endsWith('.pdf')
    ) {
      setFile(null)
      setError('Please choose a PDF resume.')
      return
    }

    if (candidate.size > MAX_FILE_SIZE) {
      setFile(null)
      setError('Please choose a PDF smaller than 10 MB.')
      return
    }

    setError('')
    setFile(candidate)
  }

  const submit = async (event) => {
    event.preventDefault()

    if (!file) {
      return setError('Please select a PDF resume.')
    }

    if (!targetRole) {
      return setError(
        'Please select a target role or profile.',
      )
    }

    if (jobDescription.trim() && !jobTitle.trim()) {
      return setError(
        'Add the job title when providing a job description.',
      )
    }

    setUploading(true)
    setError('')

    try {
      const response = await uploadResume(
        file,
        targetRole,
        {
          jobTitle: jobTitle.trim(),
          company: company.trim(),
          jobDescription: jobDescription.trim(),
        },
      )

      await onUploaded(response?.id)

      setFile(null)
      setTargetRole('')
      setJobTitle('')
      setCompany('')
      setJobDescription('')
    } catch (requestError) {
      setError(
        requestError?.response
          ? 'We could not upload this resume. Please verify the PDF and target details, then try again.'
          : 'Unable to reach IntelliView. Please try again.',
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <motion.form
      className="resume-upload"
      onSubmit={submit}
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
    >
      <button
        type="button"
        className="upload-dropzone"
        onClick={() => inputRef.current?.click()}
      >
        <FileUp size={27} />

        <strong>
          {file
            ? file.name
            : 'Drop your PDF resume here'}
        </strong>

        <span>
          {file
            ? `${(file.size / 1024 / 1024).toFixed(1)} MB selected`
            : 'or click to browse · PDF only · up to 10 MB'}
        </span>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={(event) =>
            choose(event.target.files?.[0])
          }
        />
      </button>

      <div className="resume-target">
        <span className="muted-label">
          JOB TARGET
        </span>

        <label>
          Target role / profile

          <select
            value={targetRole}
            onChange={(event) =>
              setTargetRole(event.target.value)
            }
            disabled={uploading}
          >
            <option value="">
              Select a role
            </option>

            {roles.map(([id, label]) => (
              <option
                value={id}
                key={id}
              >
                {label}
              </option>
            ))}
          </select>
        </label>

        <div className="resume-target__fields">
          <label>
            Job title

            <input
              value={jobTitle}
              onChange={(event) =>
                setJobTitle(event.target.value)
              }
              maxLength="100"
              placeholder="UI/UX Designer"
              disabled={uploading}
            />
          </label>

          <label>
            Company <small>(optional)</small>

            <input
              value={company}
              onChange={(event) =>
                setCompany(event.target.value)
              }
              maxLength="120"
              placeholder="Company name"
              disabled={uploading}
            />
          </label>
        </div>

        <label>
          Job description / requirements{' '}
          <small>(optional)</small>

          <textarea
            value={jobDescription}
            onChange={(event) =>
              setJobDescription(event.target.value)
            }
            maxLength="12000"
            placeholder="Paste the responsibilities, requirements, tools, skills and qualifications here…"
            disabled={uploading}
          />
        </label>
      </div>

      {error && (
        <p
          className="resume-alert"
          role="alert"
        >
          {error}
        </p>
      )}

      <button
        className="button"
        type="submit"
        disabled={uploading}
      >
        {uploading ? (
          <>
            <LoaderCircle
              className="spin"
              size={16}
            />
            Uploading & analyzing...
          </>
        ) : (
          <>
            Analyze resume
            <Upload size={16} />
          </>
        )}
      </button>
    </motion.form>
  )
}

export default ResumeUpload