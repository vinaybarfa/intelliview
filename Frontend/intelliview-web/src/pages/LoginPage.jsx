import { Link, Navigate, useLocation } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import LoginForm from '../components/auth/LoginForm'
import { useAuth } from '../context/AuthContext'

function AuthFrame({
  children,
  eyebrow,
  title,
  description,
}) {
  return (
    <main className="auth-page">
      <div className="auth-page__glow auth-page__glow--one" />
      <div className="auth-page__glow auth-page__glow--two" />

      <section className="auth-intro">
        <Link
          className="wordmark"
          to="/"
        >
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
        </Link>

        <div className="auth-intro__copy">
          <span className="eyebrow">
            <Sparkles size={14} />
            Career intelligence, made personal
          </span>

          <h1>
            Bring clarity to
            <br />
            <span>what comes next.</span>
          </h1>

          <p>
            Your next opportunity starts with a deeper
            understanding of your strengths.
          </p>
        </div>

        <div
          className="auth-orbit"
          aria-hidden="true"
        >
          <i />
          <i />
          <b />
        </div>

        <p className="auth-quote">
          “The difference between applying and advancing
          is insight.”
        </p>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <span className="eyebrow">
            {eyebrow}
          </span>

          <h2>{title}</h2>

          <p className="auth-card__description">
            {description}
          </p>

          {children}
        </div>
      </section>
    </main>
  )
}

function LoginPage() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (!loading && isAuthenticated) {
    return <Navigate to="/app" replace />
  }

  return (
    <AuthFrame
      eyebrow="Welcome back"
      title="Welcome back"
      description="Continue your career journey with IntelliView."
    >
      {location.state?.success && (
        <p
          className="auth-success"
          role="status"
        >
          {location.state.success}
        </p>
      )}

      <LoginForm />
    </AuthFrame>
  )
}

export { AuthFrame }
export default LoginPage