import { useCallback, useEffect, useState } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  KeyRound,
  Mail,
  Pencil,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react'
import LoadingScreen from '../../components/common/LoadingScreen'
import {
  getProfile,
  updateProfile,
} from '../../services/profileService'
import { changePassword } from '../../services/authService'

const messageFor = (error) => {
  if (error?.response?.status === 401) {
    return 'Your session has expired. Please sign in again.'
  }

  if (error?.response?.status === 400) {
    return (
      error.response?.data?.message ||
      'Please review the highlighted information.'
    )
  }

  return error?.response
    ? 'Unable to update your profile right now.'
    : 'Unable to reach IntelliView. Please check your connection and try again.'
}

const dateLabel = (value) =>
  value
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: 'long',
      }).format(new Date(value))
    : 'Not available'

const initials = (profile) =>
  `${profile?.firstName?.[0] || ''}${profile?.lastName?.[0] || ''}`
    .toUpperCase() || 'IV'

function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [draft, setDraft] = useState(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [passwordError, setPasswordError] = useState('')
  const [passwordNotice, setPasswordNotice] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)

  const load = useCallback(async () => {
    setError('')

    try {
      const response = await getProfile()
      setProfile(response)
      setDraft(response)
    } catch (requestError) {
      setError(messageFor(requestError))
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(load, 0)

    return () => window.clearTimeout(timer)
  }, [load])

  if (!profile && !error) {
    return <LoadingScreen />
  }

  if (!profile) {
    return (
      <section className="profile-unavailable glass-panel">
        <UserRound size={28} />

        <h1>Profile unavailable</h1>

        <p>{error}</p>

        <button
          className="button button--quiet"
          type="button"
          onClick={load}
        >
          Try again
        </button>
      </section>
    )
  }

  const completeFields = [
    profile.firstName,
    profile.lastName,
    profile.email,
    profile.role,
    profile.createdAt,
  ]

  const completion = Math.round(
    (completeFields.filter(Boolean).length /
      completeFields.length) *
      100,
  )

  const updateDraft = (event) => {
    setDraft((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const cancel = () => {
    setDraft(profile)
    setEditing(false)
    setError('')
    setNotice('')
  }

  const save = async (event) => {
    event.preventDefault()

    setSaving(true)
    setError('')
    setNotice('')

    try {
      const updated = await updateProfile({
        firstName: draft.firstName.trim(),
        lastName: draft.lastName.trim(),
      })

      setProfile(updated)
      setDraft(updated)
      setEditing(false)
      setNotice('Profile updated successfully.')
    } catch (requestError) {
      setError(messageFor(requestError))
    } finally {
      setSaving(false)
    }
  }

  const updatePasswords = (event) => {
    setPasswords((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const savePassword = async (event) => {
    event.preventDefault()

    setPasswordError('')
    setPasswordNotice('')

    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      setPasswordError(
        'Complete all password fields.',
      )
      return
    }

    if (passwords.newPassword.length < 8) {
      setPasswordError(
        'Password must be between 8 and 100 characters.',
      )
      return
    }

    if (
      passwords.newPassword !==
      passwords.confirmPassword
    ) {
      setPasswordError(
        'New password and confirmation do not match.',
      )
      return
    }

    setPasswordSaving(true)

    try {
      const response = await changePassword({
        currentPassword:
          passwords.currentPassword,
        newPassword: passwords.newPassword,
      })

      if (!response?.success) {
        throw new Error(
          response?.message ||
            'Unable to change password.',
        )
      }

      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })

      setPasswordNotice(
        'Password changed successfully.',
      )
    } catch (requestError) {
      setPasswordError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          'Unable to change password right now.',
      )
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <div className="profile-page">
      <section className="profile-hero glass-panel">
        <div className="profile-avatar">
          {initials(profile)}
        </div>

        <div>
          <span className="eyebrow">
            <UserRound size={13} />
            Your account
          </span>

          <h1>Profile</h1>

          <p>
            Manage your personal information and career
            preferences.
          </p>
        </div>

        {!editing && (
          <button
            className="button profile-edit"
            type="button"
            onClick={() => {
              setEditing(true)
              setNotice('')
            }}
          >
            <Pencil size={16} />
            Edit profile
          </button>
        )}
      </section>

      {notice && (
        <div
          className="profile-notice"
          role="status"
        >
          <CheckCircle2 size={17} />
          {notice}
        </div>
      )}

      {error && (
        <div
          className="page-alert"
          role="alert"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={save}
        className="profile-grid"
      >
        <section className="profile-card glass-panel">
          <header>
            <div>
              <span className="eyebrow">
                PERSONAL INFORMATION
              </span>

              <h2>About you</h2>
            </div>
          </header>

          <div className="profile-fields">
            <label>
              First name

              <input
                name="firstName"
                value={draft?.firstName || ''}
                onChange={updateDraft}
                disabled={!editing || saving}
                required
                maxLength="100"
              />
            </label>

            <label>
              Last name

              <input
                name="lastName"
                value={draft?.lastName || ''}
                onChange={updateDraft}
                disabled={!editing || saving}
                required
                maxLength="100"
              />
            </label>

            <label className="profile-fields__full">
              Email address

              <input
                value={profile.email || ''}
                disabled
                aria-describedby="email-identity-note"
              />
            </label>

            <p
              className="profile-fields__full profile-field-note"
              id="email-identity-note"
            >
              <Mail size={15} />
              Your email is your sign-in identity and
              cannot be changed here.
            </p>
          </div>

          {editing && (
            <div className="profile-actions">
              <button
                className="button button--quiet"
                type="button"
                onClick={cancel}
                disabled={saving}
              >
                <X size={16} />
                Cancel
              </button>

              <button
                className="button"
                type="submit"
                disabled={saving}
              >
                <Save size={16} />
                {saving
                  ? 'Saving changes…'
                  : 'Save changes'}
              </button>
            </div>
          )}
        </section>

        <aside className="profile-side">
          <section className="profile-card profile-completion glass-panel">
            <span className="eyebrow">
              PROFILE COMPLETENESS
            </span>

            <strong>{completion}%</strong>

            <div className="profile-progress">
              <i
                style={{
                  width: `${completion}%`,
                }}
              />
            </div>

            <p>
              Based on the available personal and account
              information.
            </p>
          </section>

          <section className="profile-card glass-panel">
            <span className="eyebrow">
              ACCOUNT INFORMATION
            </span>

            <dl className="account-details">
              <div>
                <dt>
                  <Mail size={16} />
                  Email
                </dt>

                <dd>{profile.email}</dd>
              </div>

              <div>
                <dt>
                  <CalendarDays size={16} />
                  Member since
                </dt>

                <dd>
                  {dateLabel(profile.createdAt)}
                </dd>
              </div>

              <div>
                <dt>
                  <ShieldCheck size={16} />
                  Account status
                </dt>

                <dd>
                  <span className="account-status">
                    Active
                  </span>
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </form>

      <section className="profile-card profile-security glass-panel">
        <header>
          <div>
            <span className="eyebrow">
              <KeyRound size={13} />
              PASSWORD &amp; SECURITY
            </span>

            <h2>Change password</h2>

            <p>
              Use a unique password with at least 8
              characters to help keep your account secure.
            </p>
          </div>
        </header>

        {passwordNotice && (
          <div
            className="profile-notice"
            role="status"
          >
            <CheckCircle2 size={17} />
            {passwordNotice}
          </div>
        )}

        {passwordError && (
          <div
            className="page-alert"
            role="alert"
          >
            {passwordError}
          </div>
        )}

        <form
          className="profile-fields profile-security__fields"
          onSubmit={savePassword}
        >
          <label>
            Current password

            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={updatePasswords}
              autoComplete="current-password"
              disabled={passwordSaving}
              required
            />
          </label>

          <label>
            New password

            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={updatePasswords}
              autoComplete="new-password"
              minLength="8"
              maxLength="100"
              disabled={passwordSaving}
              required
            />
          </label>

          <label>
            Confirm new password

            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={updatePasswords}
              autoComplete="new-password"
              minLength="8"
              maxLength="100"
              disabled={passwordSaving}
              required
            />
          </label>

          <div className="profile-actions">
            <button
              className="button"
              type="submit"
              disabled={passwordSaving}
            >
              <KeyRound size={16} />
              {passwordSaving
                ? 'Changing password…'
                : 'Change password'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default ProfilePage