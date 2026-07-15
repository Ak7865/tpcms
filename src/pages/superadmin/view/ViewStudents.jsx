import { useEffect, useState } from 'react';
import DashboardShell from '../../../components/DashboardShell';
import { Card, Badge } from '../../../components/ui';
import { Search, Filter, ChevronDown, Loader2 } from 'lucide-react';
import { api } from '../../../services/api';
import { useNavigate } from "react-router-dom";



const departments = [
  'All',
  'Civil Engineering',
  'Computer Science & Engineering',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
];

export default function ViewStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const result = await api.get('/students/');
        const formatted = (result.data || []).map((user, index) => ({
          id: user.user_id || index,
          roll: user.roll_no || 'N/A',
          name: user.user_table?.name || 'Unknown',
          dept: user.department_table?.department_name || 'Not Assigned',
          semester: user.semester_id || '—',
          age:user.age,
          cgpa: user.cgpa ?? null,
          email: user.user_table?.email || user.email || '',
          status: user.is_active === false ? 'Inactive' : 'Active',
        }));
        setStudents(formatted);
      } catch (e) {
        console.error('Failed to fetch students:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.roll.includes(search);
    const matchDept = dept === 'All' || s.dept === dept;
    return matchSearch && matchDept;
  });

  return (
    <DashboardShell title="View Students" subtitle="All registered students">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Search by name or roll..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-orbit-surface2 border border-orbit-border text-slate-200"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
          <select
            value={dept}
            onChange={e=>setDept(e.target.value)}
            className="appearance-none pl-9 pr-8 py-2.5 rounded-lg bg-orbit-surface2 border border-orbit-border text-slate-200">
            {departments.map(d=><option key={d} value={d}>{d}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"/>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-orbit-border">
                <th className="px-5 py-3 text-left">Roll</th>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Department</th>
                <th className="px-5 py-3 text-left">Semester</th>
                <th className="px-5 py-3 text-left">CGPA</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="py-8 text-center"><Loader2 className="inline animate-spin"/> Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-8 text-center">No students found</td></tr>
              ) : filtered.map(s=>(
                <tr key={s.id} className="border-b border-orbit-border/50">
                  <td className="px-5 py-3">{s.roll}</td>
                  <td className="px-5 py-3">{s.name}</td>
                  <td className="px-5 py-3">{s.dept}</td>
                  <td className="px-5 py-3">{s.semester}</td>
                  <td className="px-5 py-3">{s.cgpa ?? '—'}</td>
                  <td className="px-5 py-3"><Badge variant={s.status==='Active'?'primary':'neutral'}>{s.status}</Badge></td>
                  <td className="px-5 py-3"><button
  onClick={() =>
    navigate(`/super-admin/dashboard?view=edit-students&id=${s.id}`)
  }
  className="text-orbit-primary-light hover:underline"
>
  Edit
</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardShell>
  );
}
