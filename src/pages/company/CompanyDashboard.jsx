import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Briefcase, Users, BookOpenCheck, UserCheck,
  TrendingUp, TrendingDown, Plus, Eye,
  Calendar, FileText, AlertCircle
} from 'lucide-react'
import DashboardShell from '../../components/DashboardShell'
import { Card, CardBody } from '../../components/ui'
import CompanyProfile from './view/CompanyProfile'
import ManageJobs from './view/ManageJobs'
import PostJob from './view/PostJob'
import PostTraining from './view/PostTraining'
import ManageTraining from './view/ManageTraining'
import Recruitment from './view/Recruitment'
import ShortlistedCandidates from './view/ShortlistedCandidates'
import ScheduleInterviews from './view/ScheduleInterviews'

const viewComponents = {
  'post-job': PostJob,
  'post-training': PostTraining,
  'recruitment': Recruitment,
  'shortlisted': ShortlistedCandidates,
  'interview': ScheduleInterviews,
  'manage-jobs': ManageJobs,
  'manage-training': ManageTraining,
  'profile': CompanyProfile,
  settings: () => (
    <Card>
      <CardBody>
        <div className="flex items-center gap-2 text-slate-400">
          <AlertCircle size={18} />
          <span className="text-sm">Settings placeholder.</span>
        </div>
      </CardBody>
    </Card>
  ),
}

const statsData = [
  { id: 'active-jobs', label: 'Active Job Posts', value: '8', change: 14.3, icon: Briefcase, color: 'violet' },
  { id: 'applications', label: 'Total Applications', value: '234', change: 22.5, icon: Users, color: 'cyan' },
  { id: 'shortlisted', label: 'Shortlisted', value: '45', change: 8.7, icon: UserCheck, color: 'emerald' },
  { id: 'trainings', label: 'Trainings Posted', value: '3', change: 50.0, icon: BookOpenCheck, color: 'amber' },
]

const colorClasses = {
  violet: { bg: 'bg-violet-500/15', text: 'text-violet-400' },
  cyan: { bg: 'bg-cyan-500/15', text: 'text-cyan-400' },
  emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  amber: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
}

function Overview() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, i) => {
          const colors = colorClasses[stat.color]
          const isPositive = stat.change >= 0
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className="bg-orbit-surface rounded-xl border border-orbit-border hover:border-orbit-border2 transition-colors p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                  <stat.icon className={`w-4 h-4 ${colors.text}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-100 tracking-tight">{stat.value}</p>
            </motion.div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-orbit-surface rounded-xl border border-orbit-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200">Recent Applications</h2>
            <a href="?view=recruitment" className="text-xs text-orbit-primary-light hover:text-orbit-accent transition-colors">View All</a>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-3 px-3 py-2 text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
              <span>Student</span>
              <span>Position</span>
              <span>Branch</span>
              <span>CGPA</span>
              <span>Status</span>
            </div>
            {[
              { student: 'Ankit Verma', position: 'SDE Intern', branch: 'CSE', cgpa: '8.5', status: 'New' },
              { student: 'Priya Shah', position: 'Data Analyst', branch: 'IT', cgpa: '9.1', status: 'Reviewed' },
              { student: 'Rahul Kumar', position: 'SDE Intern', branch: 'CSE', cgpa: '7.8', status: 'Shortlisted' },
              { student: 'Sneha Gupta', position: 'Frontend Dev', branch: 'CSE', cgpa: '8.9', status: 'New' },
              { student: 'Amit Patel', position: 'Backend Dev', branch: 'IT', cgpa: '7.2', status: 'Rejected' },
            ].map((app, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-5 gap-3 px-3 py-2.5 rounded-lg hover:bg-white/3 transition-colors items-center"
              >
                <span className="text-sm text-slate-200 truncate">{app.student}</span>
                <span className="text-sm text-slate-400 truncate">{app.position}</span>
                <span className="text-sm text-slate-400">{app.branch}</span>
                <span className="text-sm text-slate-300 font-medium">{app.cgpa}</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full w-fit ${
                  app.status === 'New' ? 'bg-blue-500/15 text-blue-400' :
                  app.status === 'Reviewed' ? 'bg-violet-500/15 text-violet-400' :
                  app.status === 'Shortlisted' ? 'bg-emerald-500/15 text-emerald-400' :
                  'bg-red-500/15 text-red-400'
                }`}>
                  {app.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-orbit-surface rounded-xl border border-orbit-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200">Active Jobs</h2>
            <span className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-medium">
              3 Open
            </span>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Software Developer Intern', applications: 87, deadline: 'Jul 15, 2026', status: 'Open' },
              { title: 'Data Analyst', applications: 45, deadline: 'Jul 20, 2026', status: 'Open' },
              { title: 'Frontend Developer', applications: 62, deadline: 'Jul 10, 2026', status: 'Closing Soon' },
            ].map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-3 rounded-lg border border-orbit-border hover:border-orbit-border2 transition-colors"
              >
                <p className="text-sm font-medium text-slate-200">{job.title}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-slate-500">
                    <Users className="w-3 h-3 inline mr-1" />{job.applications} apps
                  </span>
                  <span className="text-xs text-slate-500">
                    <Calendar className="w-3 h-3 inline mr-1" />{job.deadline}
                  </span>
                </div>
                <div className="mt-2">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    job.status === 'Open' ? 'bg-emerald-500/15 text-emerald-400' :
                    job.status === 'Closing Soon' ? 'bg-amber-500/15 text-amber-400' :
                    'bg-red-500/15 text-red-400'
                  }`}>
                    {job.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-orbit-surface rounded-xl border border-orbit-border p-5">
        <h2 className="text-sm font-semibold text-slate-200 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Plus, label: 'Post New Job', view: 'post-job', color: 'text-violet-400 bg-violet-500/10' },
            { icon: Eye, label: 'View Applications', view: 'recruitment', color: 'text-cyan-400 bg-cyan-500/10' },
            { icon: Calendar, label: 'Schedule Interview', view: 'interview', color: 'text-emerald-400 bg-emerald-500/10' },
            { icon: FileText, label: 'Post Training', view: 'post-training', color: 'text-amber-400 bg-amber-500/10' },
          ].map(action => (
            <a
              key={action.label}
              href={`?view=${action.view}`}
              className="flex items-center gap-3 p-3 rounded-lg border border-orbit-border hover:border-orbit-border2 hover:bg-white/3 transition-all"
            >
              <div className={`p-2 rounded-lg ${action.color}`}>
                <action.icon className="w-4 h-4" />
              </div>
              <span className="text-sm text-slate-300 font-medium">{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  )
}

export default function CompanyDashboard() {
  const [searchParams] = useSearchParams()
  const view = searchParams.get('view')

  const ViewComponent = view ? viewComponents[view] : null

  if (ViewComponent) {
    return <DashboardShell title="Company Dashboard" subtitle="Manage job postings, review applications, and conduct recruitment."><ViewComponent /></DashboardShell>
  }

  return (
    <DashboardShell title="Company Dashboard" subtitle="Manage job postings, review applications, and conduct recruitment.">
      <Overview />
    </DashboardShell>
  )
}
