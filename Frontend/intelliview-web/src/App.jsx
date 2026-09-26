import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/app/DashboardPage";
import ResumePage from "./pages/app/ResumePage";
import JobsPage from "./pages/app/JobsPage";
import JobDetailsPage from "./pages/app/JobDetailsPage";
import InterviewSessionPage from "./pages/app/interview/InterviewSessionPage";
import InterviewReportPage from "./pages/app/interview/InterviewReportPage";
import ProfilePage from "./pages/app/ProfilePage";
import ReportsPage from "./pages/app/ReportsPage";
import AppLayout from "./components/layout/AppLayout";
import LoadingScreen from "./components/common/LoadingScreen";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import InterviewPage from "./pages/app/Interview/InterviewPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/resume"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ResumePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/jobs"
        element={
          <ProtectedRoute>
            <AppLayout>
              <JobsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/jobs/:jobId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <JobDetailsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/interview"
        element={
          <ProtectedRoute>
            <AppLayout>
              <InterviewPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/interview/:interviewId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <InterviewSessionPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/interview/:interviewId/report"
        element={
          <ProtectedRoute>
            <AppLayout>
              <InterviewReportPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/reports"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ReportsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
