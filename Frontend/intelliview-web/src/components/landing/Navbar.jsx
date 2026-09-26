import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const links = [
  ['Product', '#product'],
  ['How It Works', '#how-it-works'],
  ['Features', '#features'],
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 18)

    update()

    window.addEventListener('scroll', update, {
      passive: true,
    })

    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header
      className={`navbar ${
        scrolled ? 'navbar--scrolled' : ''
      }`}
    >
      <nav
        className="navbar__inner"
        aria-label="Main navigation"
      >
        <Link
          className="wordmark"
          to="/"
          aria-label="IntelliView home"
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
        </Link>

        <div
          className={`navbar__links ${
            open ? 'navbar__links--open' : ''
          }`}
        >
          {links.map(([label, href]) => (
            <a
              href={href}
              key={label}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="navbar__actions">
          <Link
            className="text-link"
            to="/login"
          >
            Sign In
          </Link>

          <Link
            className="button button--small"
            to="/register"
          >
            Get Started
          </Link>
        </div>

        <button
          className="menu-button"
          type="button"
          aria-label={
            open ? 'Close menu' : 'Open menu'
          }
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <X size={20} />
          ) : (
            <Menu size={21} />
          )}
        </button>
      </nav>
    </header>
  )
}

export default Navbar