import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  KeyRound, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  Globe
} from 'lucide-react';

interface AdminSetupProps {
  onSuccess: (adminEmail: string, recoveryKey?: string) => void;
  onBackToSite: () => void;
}

export const AdminSetup: React.FC<AdminSetupProps> = ({ onSuccess, onBackToSite }) => {
  const [adminEmail, setAdminEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('What was your first project or brand name?');
  const [customQuestion, setCustomQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Step 2: Show recovery key confirmation before proceeding
  const [createdRecoveryKey, setCreatedRecoveryKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

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

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!adminEmail.trim() || !adminEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your entries.');
      return;
    }

    if (!securityAnswer.trim()) {
      setError('Please provide a security answer for password recovery.');
      return;
    }

    setIsLoading(true);

    try {
      const activeQuestion = securityQuestion === 'custom' ? customQuestion : securityQuestion;
      const res = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail: adminEmail.trim(),
          password,
          confirmPassword,
          securityQuestion: activeQuestion,
          securityAnswer: securityAnswer.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to configure admin account.');
      }

      if (data.token) {
        sessionStorage.setItem('prineor_admin_jwt', data.token);
        localStorage.setItem('prineor_admin_jwt', data.token);
      }

      if (data.recoveryKey) {
        setCreatedRecoveryKey(data.recoveryKey);
      } else {
        onSuccess(adminEmail);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during account setup.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyKey = () => {
    if (createdRecoveryKey) {
      navigator.clipboard.writeText(createdRecoveryKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
    }
  };

  // If account was just created, show recovery key confirmation modal
  if (createdRecoveryKey) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative selection:bg-[#E6B942]/30 selection:text-[#855B09]">
        <div className="fixed top-10 left-10 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="fixed bottom-10 right-10 w-[30rem] h-[30rem] bg-indigo-50/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="w-full max-w-lg rounded-3xl glass-panel-elevated p-8 sm:p-10 border border-white/95 shadow-[0_25px_60px_rgba(212,158,36,0.15)] relative animate-in fade-in zoom-in-95">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6 shadow-xs text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="text-center mb-6">
            <h1 className="font-cinzel font-bold text-2xl text-[#0F172A]">
              Admin Account Configured!
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-2">
              Your administrator credentials have been encrypted with bcrypt (12 rounds) and securely saved on the server.
            </p>
          </div>

          {/* Master Recovery Key Box */}
          <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="w-4 h-4 text-[#A87915]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#855B09]">
                Emergency Recovery Key
              </span>
            </div>
            <p className="text-xs text-[#64748B] mb-3">
              Store this one-time master recovery key in a safe place. You can use it to reset your password if you ever forget it.
            </p>

            <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white border border-amber-200 shadow-inner font-mono text-sm font-bold text-[#0F172A]">
              <span>{createdRecoveryKey}</span>
              <button
                type="button"
                onClick={handleCopyKey}
                className="p-2 rounded-lg hover:bg-slate-100 text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                title="Copy Recovery Key"
              >
                {copiedKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            onClick={() => onSuccess(adminEmail, createdRecoveryKey)}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs sm:text-sm shadow-[0_6px_25px_rgba(212,158,36,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Admin Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative selection:bg-[#E6B942]/30 selection:text-[#855B09]">
      {/* Background Gradients */}
      <div className="fixed top-10 left-10 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-[30rem] h-[30rem] bg-indigo-50/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Setup Card */}
      <div className="w-full max-w-lg rounded-3xl glass-panel-elevated p-8 sm:p-10 border border-white/95 shadow-[0_25px_60px_rgba(212,158,36,0.15)] relative overflow-hidden">
        
        {/* Header Badges */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-[#D49E24]/30 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D49E24]" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">First-Time Initial Setup</span>
          </div>

          <button
            onClick={onBackToSite}
            className="text-xs font-semibold text-[#64748B] hover:text-[#A87915] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#D49E24]" />
            <span>Public Site</span>
          </button>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="font-cinzel font-black text-2xl sm:text-3xl text-[#0F172A] tracking-wide">
            Create Admin Account
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">
            Please choose your private administrator credentials. This setup is only shown once and establishes your secure server authentication.
          </p>
        </div>

        {/* Error Box */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Admin Email */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
              Admin Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="Enter your private admin email"
                className="w-full pl-10 pr-4 py-3 rounded-2xl glass-pill bg-white/85 border border-white/95 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A] shadow-inner"
              />
            </div>
            <span className="text-[10px] text-[#64748B] mt-1 block">
              This private email will NOT be displayed on the public website.
            </span>
          </div>

          {/* Password */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-2xl glass-pill bg-white/85 border border-white/95 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A] shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#64748B]">Strength:</span>
                  <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1.5">
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

          {/* Confirm Password */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-2xl glass-pill bg-white/85 border border-white/95 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A] shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <span className="text-[10px] text-red-500 mt-1 block">
                Passwords do not match.
              </span>
            )}
          </div>

          {/* Security Question for Password Recovery */}
          <div className="pt-2 border-t border-slate-200/60">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
              Password Recovery Question <span className="text-red-500">*</span>
            </label>
            <div className="relative mb-2">
              <HelpCircle className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-pill bg-white/85 border border-white/95 text-xs focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A]"
              >
                <option value="What was your first project or brand name?">What was your first project or brand name?</option>
                <option value="What is the name of your favorite programming language or creative tool?">What is the name of your favorite programming language or creative tool?</option>
                <option value="What city was Prineor conceived in?">What city was Prineor conceived in?</option>
                <option value="custom">Custom Security Question...</option>
              </select>
            </div>

            {securityQuestion === 'custom' && (
              <input
                type="text"
                required
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Enter your custom security question"
                className="w-full px-4 py-2.5 mb-2 rounded-2xl glass-pill bg-white/85 border border-white/95 text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50"
              />
            )}

            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder="Your secret answer (used for password recovery)"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-pill bg-white/85 border border-white/95 text-xs focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs sm:text-sm shadow-[0_6px_25px_rgba(212,158,36,0.35)] hover:shadow-[0_8px_30px_rgba(212,158,36,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <span>Configuring Server Authentication...</span>
              ) : (
                <>
                  <span>Create Admin Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Footer Note */}
        <div className="mt-6 pt-5 border-t border-slate-200/60 flex items-center justify-center gap-2 text-center text-[11px] text-[#64748B]">
          <ShieldCheck className="w-4 h-4 text-[#D49E24] flex-shrink-0" />
          <span>Encrypted with bcrypt (12 rounds) • Server Protected</span>
        </div>

      </div>
    </div>
  );
};
