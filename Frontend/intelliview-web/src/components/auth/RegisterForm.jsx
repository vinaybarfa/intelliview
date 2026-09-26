import { useState } from 'react'
import { Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const messageFor = (error) =>
  error?.response
    ? 'Unable to create your account. Please review your details and try again.'
    : error?.message || 'Unable to create your account. Please try again.'

const RegisterForm = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const update = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const submit = async (event) => {
    event.preventDefault()

    const firstName = form.firstName.trim()
    const lastName = form.lastName.trim()
    const email = form.email.trim()

    if (!firstName) {
      return setError('Please enter your first name.')
    }

    if (!lastName) {
      return setError('Please enter your last name.')
    }

    if (!emailPattern.test(email)) {
      return setError('Please enter a valid email address.')
    }

    if (form.password.length < 8) {
      return setError('Please use a password with at least 8 characters.')
    }

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.')
    }

    setError('')
    setSubmitting(true)

    try {
      await register({
        firstName,
        lastName,
        email,
        password: form.password,
      })

      navigate('/login', {
        replace: true,
        state: {
          success: 'Account created. Please sign in to continue.',
        },
      })
    } catch (requestError) {
      setError(messageFor(requestError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <div className="auth-row">
        <div className="auth-field">
          <label htmlFor="first-name">First name</label>

          <input
            id="first-name"
            name="firstName"
            autoComplete="given-name"
            value={form.firstName}
            onChange={update}
            disabled={submitting}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="last-name">Last name</label>

          <input
            id="last-name"
            name="lastName"
            autoComplete="family-name"
            value={form.lastName}
            onChange={update}
            disabled={submitting}
          />
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="register-email">Email</label>

        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={update}
          placeholder="you@example.com"
          disabled={submitting}
        />
      </div>

      <div className="auth-field">
        <label htmlFor="register-password">Password</label>

        <div className="password-field">
          <input
            id="register-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={form.password}
            onChange={update}
            placeholder="At least 8 characters"
            disabled={submitting}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff size={17} />
            ) : (
              <Eye size={17} />
            )}
          </button>
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="confirm-password">Confirm password</label>

        <input
          id="confirm-password"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={update}
          placeholder="Re-enter your password"
          disabled={submitting}
        />
      </div>

      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}

      <button
        className="button auth-submit"
        type="submit"
        disabled={submitting}
      >
        {submitting && <LoaderCircle size={16} className="spin" />}

        {submitting ? 'Creating account...' : 'Create Account'}
      </button>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </form>
  )
}

export default RegisterForm
