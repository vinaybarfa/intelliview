import { Bell, Menu, Moon, Sun } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const pageDetails = (pathname) => {
  if (pathname.includes('/profile')) {
    return [
      'Profile',
      'Manage your personal information',
    ]
  }

  if (pathname.includes('/reports')) {
    return [
      'Professional Reports',
      'Your career intelligence center',
    ]
  }

  if (pathname.includes('/resume')) {
    return [
      'Resume',
      'Your ATS and optimization workspace',
    ]
  }

  if (pathname.includes('/jobs')) {
    return [
      'Job Matching',
      'Explore your saved opportunities',
    ]
  }

  if (pathname.includes('/interview')) {
    return [
      'Mock Interview',
      'Practice with AI feedback',
    ]
  }

  return [
    'Dashboard',
    'Your career intelligence overview',
  ]
}

function Topbar({ onMenuClick }) {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()

  const initial =
    user?.firstName?.charAt(0)?.toUpperCase() || 'I'

  const [title, subtitle] = pageDetails(pathname)
  const isDark = theme === 'dark'

  return (
    <header className="topbar">
      <div className="topbar__title">
        <button
          className="topbar__menu"
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={21} />
        </button>

        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="topbar__account">
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${
            isDark ? 'light' : 'dark'
          } mode`}
          title={`Switch to ${
            isDark ? 'light' : 'dark'
          } mode`}
        >
          <span aria-hidden="true">
            {isDark ? (
              <Moon size={16} />
            ) : (
              <Sun size={16} />
            )}
          </span>

          <em>{isDark ? 'Dark' : 'Light'}</em>
        </button>

        <button
          className="topbar__notification"
          type="button"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <i />
        </button>

        <div className="topbar__avatar">
          {initial}
        </div>

        <span>
          {user?.firstName || 'Account'}
        </span>
      </div>
    </header>
  )
}

export default Topbar