import { useCallback, useEffect, useState } from 'react'
import WelcomeHeader from '../../components/dashboard/WelcomeHeader'
import StatsGrid from '../../components/dashboard/StatsGrid'
import ResumeScoreCard from '../../components/dashboard/ResumeScoreCard'
import JobMatchCard from "../../components/dashboard/JobMatchCard";
import InterviewCard from '../../components/dashboard/InterviewCard'
import RecentActivity from '../../components/dashboard/RecentActivity'
import LoadingScreen from '../../components/common/LoadingScreen'
import {
  getResumeAnalysis,
  getResumes,
} from '../../services/resumeService'
import { getJobMatches } from '../../services/jobMatchingService'
import { getInterviews } from '../../services/interviewService'

function errorMessage(error, subject) {
  const status = error?.response?.status

  if (status === 401) {
    return 'Your session has expired. Please sign in again.'
  }

  if (status === 403) {
    return `You do not have permission to access ${subject}.`
  }

  if (status === 404) {
    return `${subject.charAt(0).toUpperCase()}${subject.slice(1)} could not be found.`
  }

  return error?.response
    ? `Unable to load ${subject}.`
    : 'Unable to reach IntelliView. Please check your connection and try again.'
}

function timestampValue(value) {
  const timestamp = new Date(value || 0).getTime()

  return Number.isNaN(timestamp) ? 0 : timestamp
}

function newest(items, timestampField) {
  return (
    [...items].sort(
      (first, second) =>
        timestampValue(second?.[timestampField]) -
        timestampValue(first?.[timestampField]),
    )[0] || null
  )
}

function latestActiveResume(resumes) {
  return newest(
    resumes.filter(
      (resume) => resume?.status === 'ACTIVE',
    ),
    'createdAt',
  )
}

function dashboardActivities(
  resumes,
  jobMatches,
  interviews,
) {
  const resumeActivities = resumes
    .filter((resume) => timestampValue(resume?.createdAt))
    .map((resume) => ({
      type: 'resume',
      title: resume.aiProcessed
        ? 'Resume analyzed'
        : 'Resume uploaded',
      description: resume.originalFileName,
      timestamp: resume.createdAt,
      to: '/app/resume',
    }))

  const matchActivities = jobMatches
    .filter((match) => timestampValue(match?.createdAt))
    .map((match) => ({
      type: 'match',
      title: `Matched with ${match.jobTitle}`,
      description: match.companyName,
      timestamp: match.createdAt,
      to: '/app/jobs',
    }))

  const interviewActivities = interviews
    .filter(
      (interview) =>
        interview?.status === 'COMPLETED' &&
        timestampValue(interview.completedAt),
    )
    .map((interview) => ({
      type: 'interview',
      title: `Completed ${interview.targetRole} interview`,
      description: Number.isFinite(interview.overallScore)
        ? `Overall score: ${interview.overallScore}`
        : 'Interview completed',
      timestamp: interview.completedAt,
      to: `/app/interview/${interview.id}/report`,
    }))

  return [
    ...resumeActivities,
    ...matchActivities,
    ...interviewActivities,
  ]
    .sort(
      (first, second) =>
        timestampValue(second.timestamp) -
        timestampValue(first.timestamp),
    )
    .slice(0, 5)
}

function DashboardPage() {
  const [dashboard, setDashboard] = useState({
    resumes: [],
    activeAnalysis: null,
    jobMatches: [],
    interviews: [],
  })

  const [errors, setErrors] = useState({
    resumes: '',
    ats: '',
    jobMatches: '',
    interviews: '',
  })

  const [loading, setLoading] = useState(true)

  const loadDashboard = useCallback(() => {
    let active = true

    Promise.allSettled([
      getResumes(),
      getJobMatches(),
      getInterviews(),
    ])
      .then(async (results) => {
        if (!active) return

        const [
          resumesResult,
          matchesResult,
          interviewsResult,
        ] = results

        const resumes =
          resumesResult.status === 'fulfilled'
            ? resumesResult.value || []
            : []

        const activeResume =
          latestActiveResume(resumes)

        const resumesError =
          resumesResult.status === 'rejected'
            ? errorMessage(
                resumesResult.reason,
                'resume information',
              )
            : ''

        let activeAnalysis = null
        let atsError = ''

        if (activeResume) {
          try {
            activeAnalysis = await getResumeAnalysis(
              activeResume.id,
            )

            if (
              !Number.isFinite(
                activeAnalysis?.overallScore,
              )
            ) {
              atsError =
                'The latest ATS analysis did not include a score.'
            }
          } catch (requestError) {
            atsError = errorMessage(
              requestError,
              'the latest ATS analysis',
            )
          }
        }

        if (!active) return

        setDashboard({
          resumes,
          activeAnalysis,
          jobMatches:
            matchesResult.status === 'fulfilled'
              ? matchesResult.value?.data || []
              : [],
          interviews:
            interviewsResult.status === 'fulfilled'
              ? interviewsResult.value?.data || []
              : [],
        })

        setErrors({
          resumes: resumesError,
          ats: atsError,
          jobMatches:
            matchesResult.status === 'rejected'
              ? errorMessage(
                  matchesResult.reason,
                  'job matches',
                )
              : '',
          interviews:
            interviewsResult.status === 'rejected'
              ? errorMessage(
                  interviewsResult.reason,
                  'interview history',
                )
              : '',
        })
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(
    () => loadDashboard(),
    [loadDashboard],
  )

  if (loading) {
    return <LoadingScreen />
  }

  const resume = latestActiveResume(
    dashboard.resumes,
  )

  const latestMatch = newest(
    dashboard.jobMatches,
    'createdAt',
  )

  const completedInterviews =
    dashboard.interviews.filter(
      (interview) =>
        interview?.status === 'COMPLETED',
    )

  const latestInterview = newest(
    completedInterviews,
    'completedAt',
  )

  const activities = dashboardActivities(
    dashboard.resumes,
    dashboard.jobMatches,
    dashboard.interviews,
  )

  return (
    <div className="dashboard-page">
      <WelcomeHeader />

      {Object.values(errors).some(Boolean) && (
        <div
          className="page-alert page-alert--with-action"
          role="alert"
        >
          <span>
            Some workspace data could not be refreshed.
            Your available information is still shown
            below.
          </span>

          <button
            type="button"
            onClick={loadDashboard}
          >
            Try again
          </button>
        </div>
      )}

      <StatsGrid
        resume={resume}
        atsScore={dashboard.activeAnalysis?.overallScore}
        jobMatchCount={dashboard.jobMatches.length}
        completedInterviewCount={
          completedInterviews.length
        }
        latestInterview={latestInterview}
        errors={errors}
      />

      <section className="dashboard-main-grid">
        <ResumeScoreCard
          resume={resume}
          analysisScore={
            dashboard.activeAnalysis?.overallScore
          }
          error={
            errors.resumes || errors.ats
          }
        />

        <JobMatchCard
          jobMatch={latestMatch}
          error={errors.jobMatches}
        />

        <InterviewCard
          interview={latestInterview}
          error={errors.interviews}
        />
      </section>

      <RecentActivity
        activities={activities}
      />
    </div>
  )
}

export default DashboardPage