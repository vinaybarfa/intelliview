import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import * as authService from '../services/authService'

const TOKEN_KEY = 'intelliview_token'
const USER_KEY = 'intelliview_user'

const AuthContext = createContext(null)

function getStoredAuth() {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const user = JSON.parse(
      localStorage.getItem(USER_KEY) || 'null',
    )

    if (
      !token ||
      !user ||
      !Number.isFinite(user.userId) ||
      !user.email ||
      !user.firstName ||
      !user.lastName
    ) {
      throw new Error(
        'Invalid saved authentication',
      )
    }

    return {
      token,
      user,
    }
  } catch {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)

    return {
      token: null,
      user: null,
    }
  }
}

function userFromResponse(data) {
  const {
    userId,
    firstName,
    lastName,
    email,
    token,
  } = data || {}

  if (
    !token ||
    !Number.isFinite(userId) ||
    !firstName ||
    !lastName ||
    !email
  ) {
    throw new Error(
      'Invalid authentication response',
    )
  }

  return {
    token,
    user: {
      userId,
      firstName,
      lastName,
      email,
    },
  }
}

export function AuthProvider({ children }) {
  const [initialAuth] = useState(getStoredAuth)
  const [user, setUser] = useState(
    initialAuth.user,
  )
  const [token, setToken] = useState(
    initialAuth.token,
  )
  const [loading] = useState(false)

  useEffect(() => {
    const clearAuth = () => {
      setToken(null)
      setUser(null)
    }

    window.addEventListener(
      'intelliview:unauthorized',
      clearAuth,
    )

    return () =>
      window.removeEventListener(
        'intelliview:unauthorized',
        clearAuth,
      )
  }, [])

  const persist = (auth) => {
    localStorage.setItem(
      TOKEN_KEY,
      auth.token,
    )

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(auth.user),
    )

    setToken(auth.token)
    setUser(auth.user)
  }

  const login = async (credentials) => {
    const response =
      await authService.login(credentials)

    if (!response?.success) {
      throw new Error(
        'Unable to sign in. Please check your email and password.',
      )
    }

    persist(userFromResponse(response.data))
  }

  const register = async (data) => {
    const response =
      await authService.register(data)

    if (!response?.success) {
      throw new Error(
        'Unable to create your account. Please try again.',
      )
    }

    return response
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)

    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider',
    )
  }

  return context
}