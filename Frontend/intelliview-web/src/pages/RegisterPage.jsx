import { Navigate } from 'react-router-dom'
import RegisterForm from '../components/auth/RegisterForm'
import { useAuth } from '../context/AuthContext'
import { AuthFrame } from './LoginPage'

function RegisterPage() {
  const { isAuthenticated, loading } = useAuth()

  if (!loading && isAuthenticated) {
    return <Navigate to="/app" replace />
  }

  return (
    <AuthFrame
      eyebrow="Create your account"
      title="Create your IntelliView account"
      description="Build your profile. Improve your resume. Prepare for your next opportunity."
    >
      <RegisterForm />
    </AuthFrame>
  )
}

export default RegisterPage