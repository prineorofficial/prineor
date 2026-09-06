import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  KeyRound, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  ShieldAlert
} from 'lucide-react';

interface AdminForgotPasswordProps {
  onBackToLogin: () => void;
  onResetSuccess: () => void;
}

export const AdminForgotPassword: React.FC<AdminForgotPasswordProps> = ({ 
  onBackToLogin, 
  onResetSuccess 
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Empty', color: 'bg-slate-200', text: 'text-slate-400' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500', text: 'text-red-600' };
    if (score <= 3) return { score: 2, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600' };
    if (score <= 4) return { score: 3, label: 'Good', color: 'bg-emerald-500', text: 'text-emerald-600' };
    return { score: 4, label: 'Very Strong', color: 'bg-teal-500', text: 'text-teal-600' };
  };

  const strength = getPasswordStrength(newPassword);

  // Step 1: Verify Email
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your admin email.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password/verify', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      let data: any = {};
      const responseText = await res.text();
      try {
        data = JSON.parse(responseText);
      } catch {
        if (!res.ok) {
          throw new Error('Server connection error. Please try again.');
        }
      }

      if (!res.ok) {
        throw new Error(data.error || 'Admin email not found.');
      }

      setSecurityQuestion(data.securityQuestion || 'Please enter your secret answer or Emergency Recovery Key:');
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to verify admin account.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!securityAnswer.trim() && !recoveryKey.trim()) {
      setError('Please provide either your security answer or your emergency recovery key.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          securityAnswer: securityAnswer.trim(),
          recoveryKey: recoveryKey.trim(),
          newPassword,
          confirmPassword,
        }),
      });

      let data: any = {};
      const responseText = await res.text();
      try {
        data = JSON.parse(responseText);
      } catch {
        if (!res.ok) {
          throw new Error('Server connection error. Please try again.');
        }
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password.');
      }

      setIsSuccess(true);
      setTimeout(() => {
        onResetSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md rounded-3xl glass-panel-elevated p-8 sm:p-10 border border-white/95 shadow-[0_25px_60px_rgba(212,158,36,0.15)] text-center animate-in fade-in">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="font-cinzel font-bold text-2xl text-[#0F172A]">Password Reset!</h2>
        <p className="text-xs sm:text-sm text-[#64748B] mt-2">
          Your password has been successfully updated with bcrypt encryption. Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-3xl glass-panel-elevated p-8 sm:p-10 border border-white/95 shadow-[0_25px_60px_rgba(212,158,36,0.15)] relative animate-in fade-in">
      
      {/* Top back button */}
      <button
        type="button"
        onClick={onBackToLogin}
        className="text-xs font-semibold text-[#64748B] hover:text-[#A87915] flex items-center gap-1.5 mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Login</span>
      </button>

      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center mx-auto mb-3 text-[#A87915]">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="font-cinzel font-bold text-2xl text-[#0F172A]">
          Reset Admin Password
        </h1>
        <p className="text-xs text-[#64748B] mt-1.5">
          {step === 1 
            ? 'Enter your private admin email address to initiate recovery.' 
            : 'Answer your security question or enter your Emergency Recovery Key.'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleVerifyEmail} className="space-y-4">
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
                placeholder="Enter your admin email"
                className="w-full pl-10 pr-4 py-3 rounded-2xl glass-pill bg-white/80 border border-white/95 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A] shadow-inner"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs sm:text-sm shadow-[0_6px_25px_rgba(212,158,36,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? <span>Verifying...</span> : <span>Continue Recovery</span>}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          {/* Security Question Prompt */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs">
            <span className="font-bold text-[#855B09] flex items-center gap-1.5 mb-1">
              <HelpCircle className="w-3.5 h-3.5" />
              Security Question:
            </span>
            <p className="text-[#475569] font-medium">{securityQuestion}</p>
          </div>

          {/* Security Answer */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
              Your Secret Answer
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder="Enter secret answer"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-pill bg-white/80 border border-white/95 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A] shadow-inner"
              />
            </div>
          </div>

          {/* OR Recovery Key */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white/90 px-3 text-[10px] uppercase font-bold text-slate-400 absolute">
              OR RECOVERY KEY
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
              Emergency Recovery Key (PRN-XXXX-XXXX-XXXX)
            </label>
            <input
              type="text"
              value={recoveryKey}
              onChange={(e) => setRecoveryKey(e.target.value.toUpperCase())}
              placeholder="PRN-XXXX-XXXX-XXXX"
              className="w-full px-4 py-2.5 rounded-2xl glass-pill bg-white/80 border border-white/95 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A] shadow-inner"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 rounded-2xl glass-pill bg-white/80 border border-white/95 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A] shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength Meter */}
            {newPassword && (
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#64748B]">Strength:</span>
                  <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 h-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`rounded-full transition-all duration-300 ${
                        step <= strength.score ? strength.color : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 rounded-2xl glass-pill bg-white/80 border border-white/95 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A] shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs sm:text-sm shadow-[0_6px_25px_rgba(212,158,36,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
          >
            {isLoading ? <span>Updating Password...</span> : <span>Confirm & Reset Password</span>}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

    </div>
  );
};
