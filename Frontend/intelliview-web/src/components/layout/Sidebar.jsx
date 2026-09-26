import {
  BarChart3,
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  LogOut,
  UserRound,
  X,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  [LayoutDashboard, 'Dashboard', '/app'],
  [FileText, 'Resume', '/app/resume'],
  [BriefcaseBusiness, 'Job Matching', '/app/jobs'],
  [BarChart3, 'Mock Interview', '/app/interview'],
  [BarChart3, 'Reports', '/app/reports'],
]

function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const signOut = () => {
    logout()
    navigate('/login', {
      replace: true,
    })
  }

  return (
    <>
      <button
        className={`drawer-backdrop ${
          isOpen ? 'drawer-backdrop--visible' : ''
        }`}
        type="button"
        aria-label="Close menu"
        onClick={onClose}
      />

      <aside
        className={`sidebar ${
          isOpen ? 'sidebar--open' : ''
        }`}
      >
        <div className="sidebar__header">
          <NavLink
            className="wordmark"
            to="/app"
            onClick={onClose}
          >
            <span
              className="wordmark__mark"
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
            </span>
            IntelliView<span>AI</span>
          </NavLink>

          <button
            className="sidebar__close"
            type="button"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X size={19} />
          </button>
        </div>

        <p className="sidebar__label">
          Workspace
        </p>

        <nav
          className="sidebar__nav"
          aria-label="Application navigation"
        >
          {navItems.map(
            ([Icon, label, path]) => (
              <NavLink
                className={({ isActive }) =>
                  `sidebar__link ${
                    isActive
                      ? 'sidebar__link--active'
                      : ''
                  }`
                }
                to={path}
                key={label}
                onClick={onClose}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="sidebar__bottom">
          <NavLink
            className={({ isActive }) =>
              `sidebar__link ${
                isActive
                  ? 'sidebar__link--active'
                  : ''
              }`
            }
            to="/app/profile"
            onClick={onClose}
          >
            <UserRound size={18} />
            Profile
          </NavLink>

          <button
            className="sidebar__link sidebar__logout"
            type="button"
            onClick={signOut}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar