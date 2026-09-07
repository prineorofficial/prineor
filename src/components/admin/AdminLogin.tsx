import React, { useState } from 'react';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Globe, KeyRound } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { AdminForgotPassword } from './AdminForgotPassword';

interface AdminLoginProps {
  onSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToSite }) => {
  const { login } = useCMS();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both your administrator email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      let data: any = {};
      const responseText = await res.text();
      try {
        data = JSON.parse(responseText);
      } catch {
        if (!res.ok) {
          throw new Error('Invalid email or password. Email and password do not match.');
        }
      }

      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password. Email and password do not match.');
      }

      if (data.token) {
        try {
          sessionStorage.setItem('prineor_admin_jwt', data.token);
          localStorage.setItem('prineor_admin_jwt', data.token);
        } catch {
          // ignore storage access errors
        }
      }

      // Update CMS auth state
      login(data.adminEmail || email.trim(), data.token || '');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Email and password do not match.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative selection:bg-[#E6B942]/30 selection:text-[#855B09]">
      {/* Soft Ambient Pearl & Gold Backdrops */}
      <div className="fixed top-10 left-10 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-[30rem] h-[30rem] bg-indigo-50/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {showForgot ? (
        <AdminForgotPassword
          onBackToLogin={() => setShowForgot(false)}
          onResetSuccess={() => setShowForgot(false)}
        />
      ) : (
        /* Login Card */
        <div className="w-full max-w-md rounded-3xl glass-panel-elevated p-8 sm:p-10 border border-white/95 shadow-[0_25px_60px_rgba(212,158,36,0.15)] relative overflow-hidden">
          
          {/* Top Floating Badge */}
          <div className="flex items-center justify-between mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-[#D49E24]/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">Prineor CMS</span>
            </div>

            <button
              onClick={onBackToSite}
              className="text-xs font-semibold text-[#64748B] hover:text-[#A87915] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#D49E24]" />
              <span>Public Site</span>
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-cinzel font-black text-2xl sm:text-3xl text-[#0F172A] tracking-wide">
              Admin Sign In
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2">
              Sign in with your private credentials to manage Prineor portfolio content and services.
            </p>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-50/90 border border-red-200 text-xs text-red-700 leading-relaxed animate-in fade-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your private admin email"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl glass-pill bg-white/80 border border-white/95 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A] shadow-inner"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-[11px] font-bold text-[#855B09] hover:text-[#A87915] transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-2xl glass-pill bg-white/80 border border-white/95 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A] shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs sm:text-sm shadow-[0_6px_25px_rgba(212,158,36,0.35)] hover:shadow-[0_8px_30px_rgba(212,158,36,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Access Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security badge footer */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-center gap-2 text-center text-[11px] text-[#64748B]">
            <ShieldCheck className="w-4 h-4 text-[#D49E24] flex-shrink-0" />
            <span>Encrypted Server Authentication • JWT Session Protected</span>
          </div>

        </div>
      )}
    </div>
  );
};
