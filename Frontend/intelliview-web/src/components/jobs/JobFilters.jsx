import {
  Search,
  SlidersHorizontal,
} from 'lucide-react'

function JobFilters({
  jobs,
  values,
  onChange,
}) {
  const locations = [
    ...new Set(
      jobs
        .map((job) => job.location)
        .filter(Boolean)
    ),
  ]

  const types = [
    ...new Set(
      jobs
        .map((job) => job.employmentType)
        .filter(Boolean)
    ),
  ]

  const statuses = [
    ...new Set(
      jobs
        .map((job) => job.status)
        .filter(Boolean)
    ),
  ]

  const update = (event) => {
    onChange({
      ...values,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <section
      className="job-filters"
      aria-label="Filter saved jobs"
    >
      <div className="filter-search">
        <Search size={16} />

        <input
          name="search"
          value={values.search}
          onChange={update}
          placeholder="Search title, company, or keywords"
          aria-label="Search saved jobs"
        />
      </div>

      <div className="filter-select">
        <SlidersHorizontal size={15} />

        <select
          name="location"
          value={values.location}
          onChange={update}
          aria-label="Filter by location"
        >
          <option value="">All locations</option>

          {locations.map((value) => (
            <option key={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-select">
        <select
          name="employmentType"
          value={values.employmentType}
          onChange={update}
          aria-label="Filter by employment type"
        >
          <option value="">All types</option>

          {types.map((value) => (
            <option key={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-select">
        <select
          name="status"
          value={values.status}
          onChange={update}
          aria-label="Filter by job status"
        >
          <option value="">All statuses</option>

          {statuses.map((value) => (
            <option key={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </section>
  )
}

export default JobFilters
