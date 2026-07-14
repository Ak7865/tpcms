// SignInPage.jsx
// Two-phase login component skeleton.
// Phase 1: Select Role
// Phase 2: Email & Password

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight,
  GraduationCap, Shield, Building2, Users
} from 'lucide-react';
import { Button, Input } from '../../components/ui';
import api from '../../services/api';

const roles = [
  { key: 'Super Admin', label: 'Super Admin', icon: Shield, desc: 'Full system access', color: 'from-red-500 to-orange-500' },
  { key: 'T&P', label: 'T&P Coordinator', icon: Users, desc: 'Department management', color: 'from-blue-500 to-cyan-500' },
  { key: 'Company', label: 'Company', icon: Building2, desc: 'Post jobs & recruit', color: 'from-emerald-500 to-green-500' },
  { key: 'Student', label: 'Student', icon: GraduationCap, desc: 'Apply for jobs', color: 'from-violet-500 to-purple-500' },
];

const roleIdMap = {
  'Super Admin': 1,
  'T&P': 3,
  'Company': 4,
  'Student': 2,
};

const dashboardPaths = {
  'Super Admin': '/super-admin/dashboard',
  'T&P': '/t&p/dashboard',
  'Company': '/company/dashboard',
  'Student': '/students/dashboard',
};

const profileSetupPaths = {
  'T&P': '/t&p/dashboard?view=settings',
  'Company': '/company/profile-setup',
  'Student': '/students/profile-setup',
};

export default function SignInPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('Student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const role = roles.find(r => r.key === selectedRole);

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true);
    setError('');
    try{
      const result = await api.post('/users/login',{
        email,
        password,
        role_id: roleIdMap[selectedRole]
      });

      localStorage.setItem(
        'auth_user',
        JSON.stringify({
          user: result.data,
          token: result.data.auth_token
        })
      );

      const firstLogin = result.data?.first_login === true;
      if (firstLogin && selectedRole !== 'Super Admin') {
        navigate(profileSetupPaths[selectedRole] || dashboardPaths[selectedRole]);
        return;
      }

      navigate(dashboardPaths[selectedRole]);
    }catch(err){
      setError(err.message);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-orbit-bg flex items-center justify-center p-6">
      <motion.div
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        className="w-full max-w-md rounded-2xl border border-orbit-border bg-orbit-surface p-8"
      >

      {step===1 ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-2">Welcome</h1>
          <p className="text-center text-slate-400 mb-6">
            Select your role
          </p>

          <div className="grid grid-cols-2 gap-3">
            {roles.map(r=>{
              const Icon=r.icon;
              return(
                <button
                  key={r.key}
                  onClick={()=>setSelectedRole(r.key)}
                  className={`rounded-xl border p-4 text-left ${
                    selectedRole===r.key
                    ? 'border-orbit-primary bg-orbit-primary/10'
                    : 'border-orbit-border'
                  }`}
                >
                  <Icon className="mb-2"/>
                  <div className="font-semibold">{r.label}</div>
                  <div className="text-xs text-slate-500">{r.desc}</div>
                </button>
              );
            })}
          </div>

          <Button
            className="w-full mt-6"
            icon={<ArrowRight className="w-4 h-4"/>}
            iconPosition="right"
            onClick={()=>setStep(2)}
          >
            Continue
          </Button>
        </>
      ) : (
        <>
          <button
            className="text-sm text-orbit-primary mb-4"
            onClick={()=>setStep(1)}
          >
            ← Change Role
          </button>

          <div className="text-center mb-6">
            <role.icon className="mx-auto mb-3"/>
            <h2 className="text-xl font-bold">{role.label}</h2>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500 p-3 text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              prefix={<Mail className="w-4 h-4"/>}
              required
            />

            <Input
              label="Password"
              type={showPassword?'text':'password'}
              value={password}
              onChange={e=>setPassword(e.target.value)}
              prefix={<Lock className="w-4 h-4"/>}
              suffix={
                <button
                  type="button"
                  onClick={()=>setShowPassword(!showPassword)}
                >
                  {showPassword?<EyeOff size={16}/>:<Eye size={16}/>}
                </button>
              }
              required
            />

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-orbit-primary"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full"
            >
              Sign In
            </Button>

          </form>
        </>
      )}

      </motion.div>
    </div>
  );
}
