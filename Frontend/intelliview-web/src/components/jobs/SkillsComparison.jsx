import { Check, CircleAlert } from 'lucide-react'

function SkillsComparison({ result }) {
  const matched = result.matchedSkills || []
  const missing = result.missingSkills || []

  return (
    <section className="skills-comparison">
      <div>
        <h4>
          <Check size={16} />
          Matched skills
        </h4>

        {matched.length ? (
          <p>
            {matched.map((skill) => (
              <span
                className="skill-tag"
                key={skill}
              >
                {skill}
              </span>
            ))}
          </p>
        ) : (
          <small>
            No matched skills were returned.
          </small>
        )}
      </div>

      <div>
        <h4>
          <CircleAlert size={16} />
          Missing skills
        </h4>

        {missing.length ? (
          <p>
            {missing.map((skill) => (
              <span
                className="skill-tag skill-tag--missing"
                key={skill}
              >
                {skill}
              </span>
            ))}
          </p>
        ) : (
          <small>
            No missing skills were returned.
          </small>
        )}
      </div>
    </section>
  )
}

export default SkillsComparison
