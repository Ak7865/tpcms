import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button, Input } from './../../components/ui';
import api from './../../services/api';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or expired reset token.');
      return;
    }

    const formData = new FormData(e.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm_password');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await api.post(`/users/reset-password?token=${token}`, {
        password,
      });
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orbit-bg flex items-center justify-center p-6">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-orbit-primary/8 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-orbit-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-slate-100 font-semibold">TPCMS</span>
        </div>

        {!success ? (
          <>
            <h1 className="text-2xl font-bold text-slate-100 mb-1">Set new password</h1>
            <p className="text-slate-500 text-sm mb-8">
              Please enter your new password to regain access to your account.
            </p>
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </div>
            )}
            {!token && (
              <div className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-300">
                Warning: No reset token detected in the URL. Password update might fail.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                name="password"
                placeholder="••••••••"
                prefix={<Lock className="w-3.5 h-3.5" />}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                name="confirm_password"
                placeholder="••••••••"
                prefix={<Lock className="w-3.5 h-3.5" />}
                required
              />
              <Button type="submit" size="lg" className="w-full" loading={loading} icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                Reset Password
              </Button>
            </form>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-12 h-12 rounded-2xl bg-orbit-success/15 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100 mb-2">Password reset successful</h1>
            <p className="text-slate-500 text-sm mb-8">
              Your password has been changed successfully. You can now log in with your new credentials.
            </p>
            <Button size="lg" className="w-full" onClick={() => navigate('/sign-in')}>
              Go to Login
            </Button>
          </motion.div>
        )}

        <Link
          to="/sign-in"
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors mt-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to sign in
        </Link>
      </motion.div>
    </div>
  );
}
