import { LogOut, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AuthenticatedHomePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const leave = () => {
    logout()
    navigate('/login', {
      replace: true,
    })
  }

  return (
    <main className="authenticated-home">
      <nav>
        <span className="wordmark">
          <span
            className="wordmark__mark"
            aria-hidden="true"
          >
            <i />
            <i />
            <i />
          </span>
          IntelliView
          <span>AI</span>
        </span>

        <button
          className="logout-button"
          type="button"
          onClick={leave}
        >
          <LogOut size={16} />
          Logout
        </button>
      </nav>

      <section>
        <span className="eyebrow">
          <Sparkles size={14} />
          Authentication complete
        </span>

        <h1>
          Welcome to IntelliView,
          <br />
          <span>{user?.firstName || 'there'}.</span>
        </h1>

        <p>
          Your personalized career dashboard is coming next.
        </p>

        <div className="coming-soon">
          <span>01</span>

          <div>
            <strong>
              Career intelligence is on its way
            </strong>

            <small>
              We’re preparing your personalized workspace.
            </small>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AuthenticatedHomePage