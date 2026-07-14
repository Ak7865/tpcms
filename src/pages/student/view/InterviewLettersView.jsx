import { MessageSquare } from "lucide-react";
export default function LettersView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Interview Letters</h1>
        <p className="text-sm text-slate-500 mt-1">View your interview call letters and schedule details.</p>
      </div>
      <div className="bg-orbit-surface rounded-xl border border-orbit-border p-10 text-center">
        <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-sm text-slate-500">No interview letters available.</p>
      </div>
    </div>
  )
}
