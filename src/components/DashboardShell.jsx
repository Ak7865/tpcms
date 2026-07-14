import DashboardHeader from './layout/DashboardHeader';
import useIdleAutoLogout from '../hooks/useIdleAutoLogout'

export default function DashboardShell({ title, subtitle, children }) {
  useIdleAutoLogout()

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <DashboardHeader />
      <div>
        <h1 className="text-2xl font-bold text-slate-100">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
