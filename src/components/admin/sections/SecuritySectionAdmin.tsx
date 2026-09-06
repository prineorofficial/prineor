import React, { useState, useEffect } from 'react';
import { getAdminAuthHeaders } from '../../../utils/adminApi';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle, 
  LogOut, 
  Save, 
  Sparkles,
  Calendar,
  Key
} from 'lucide-react';
import { useCMS } from '../../../context/CMSContext';

export const SecuritySectionAdmin: React.FC = () => {
  const { logout } = useCMS();
  const [adminProfile, setAdminProfile] = useState<{
    adminEmail: string;
    createdAt?: string;
    securityQuestion?: string;
  } | null>(null);

  const [activeSubTab, setActiveSubTab] = useState<'account' | 'email' | 'password'>('account');
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Email Change State
  const [newEmail, setNewEmail] = useState('');
  const [emailCurrentPassword, setEmailCurrentPassword] = useState('');
  const [showEmailCurrentPassword, setShowEmailCurrentPassword] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Fetch admin profile
  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: getAdminAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setAdminProfile(data);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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

  // Handle Email Change
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('');
    setErrorMessage('');

    if (!newEmail.trim() || !newEmail.includes('@')) {
      setErrorMessage('Please provide a valid new email address.');
      return;
    }
    if (!emailCurrentPassword) {
      setErrorMessage('Current password is required to change admin email.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/change-email', {
        method: 'POST',
        credentials: 'include',
        headers: getAdminAuthHeaders({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          newEmail: newEmail.trim(),
          currentPassword: emailCurrentPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update email.');
      }

      if (data.token) {
        sessionStorage.setItem('prineor_admin_jwt', data.token);
        localStorage.setItem('prineor_admin_jwt', data.token);
      }

      setToastMessage('Admin email updated successfully!');
      setNewEmail('');
      setEmailCurrentPassword('');
      fetchProfile();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to change admin email.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('');
    setErrorMessage('');

    if (!currentPassword) {
      setErrorMessage('Please enter your current password.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        credentials: 'include',
        headers: getAdminAuthHeaders({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password.');
      }

      setToastMessage('Password updated successfully with bcrypt encryption!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill border border-[#D49E24]/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D49E24]" />
            <span className="text-[11px] font-bold text-[#855B09] uppercase tracking-wider">
              Private Admin Credentials
            </span>
          </div>
          <h2 className="font-cinzel font-bold text-xl sm:text-2xl text-[#0F172A]">
            Account & Security Settings
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Manage your private administrator email, password hash, and active session protection.
          </p>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Admin</span>
        </button>
      </div>

      {/* Notifications */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2 animate-in fade-in shadow-xs">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Subtabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => { setActiveSubTab('account'); setErrorMessage(''); setToastMessage(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'account'
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'glass-panel text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Account Overview
        </button>

        <button
          onClick={() => { setActiveSubTab('email'); setErrorMessage(''); setToastMessage(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'email'
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'glass-panel text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Change Admin Email
        </button>

        <button
          onClick={() => { setActiveSubTab('password'); setErrorMessage(''); setToastMessage(''); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'password'
              ? 'bg-[#0F172A] text-white shadow-xs'
              : 'glass-panel text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Change Password
        </button>
      </div>

      {/* SUBTAB 1: ACCOUNT OVERVIEW */}
      {activeSubTab === 'account' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in">
          {/* Active Credentials Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/80 shadow-xs space-y-4">
            <h3 className="font-cinzel font-bold text-base text-[#0F172A] flex items-center gap-2">
              <Key className="w-4 h-4 text-[#D49E24]" />
              Active Admin Profile
            </h3>

            <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/60 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Private Admin Email:</span>
                <span className="font-mono font-bold text-[#0F172A]">
                  {adminProfile?.adminEmail || 'Loading...'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Password Hash Algorithm:</span>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  bcrypt (12 rounds)
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-[#64748B]">Stored Password:</span>
                <span className="font-mono font-bold text-[#64748B] tracking-widest">
                  ••••••••••••••••
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-[#64748B]">Account Created:</span>
                <span className="text-[#0F172A] font-medium">
                  {adminProfile?.createdAt ? new Date(adminProfile.createdAt).toLocaleDateString() : 'Active'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-[#855B09] leading-relaxed">
              <strong>Private & Isolated:</strong> This email and password are never referenced by frontend components, never stored in client bundles, and completely detached from the public inquiry email.
            </div>
          </div>

          {/* Security Protocols Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/80 shadow-xs space-y-4">
            <h3 className="font-cinzel font-bold text-base text-[#0F172A] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Security Architecture
            </h3>

            <div className="space-y-2.5 text-xs text-[#475569]">
              <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#0F172A]">JWT Session Protection</p>
                  <p className="text-[#64748B] text-[11px]">7-day cryptographically signed tokens with server verification.</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#0F172A]">Zero Plain-Text Storage</p>
                  <p className="text-[#64748B] text-[11px]">All passwords and recovery tokens are hashed server-side.</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#0F172A]">Initial Setup Lockdown</p>
                  <p className="text-[#64748B] text-[11px]">Initial setup route disables permanently once your account is created.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CHANGE EMAIL */}
      {activeSubTab === 'email' && (
        <div className="max-w-xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-xs animate-in fade-in">
          <div className="mb-6">
            <h3 className="font-cinzel font-bold text-lg text-[#0F172A]">
              Change Private Admin Email
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Current Email: <span className="font-mono font-bold text-[#0F172A]">{adminProfile?.adminEmail}</span>
            </p>
          </div>

          <form onSubmit={handleChangeEmail} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                New Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new administrator email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-pill bg-white/80 border border-white/90 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                Current Password (for security verification)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showEmailCurrentPassword ? 'text' : 'password'}
                  required
                  value={emailCurrentPassword}
                  onChange={(e) => setEmailCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-2xl glass-pill bg-white/80 border border-white/90 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A]"
                />
                <button
                  type="button"
                  onClick={() => setShowEmailCurrentPassword(!showEmailCurrentPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  {showEmailCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Updating...' : 'Update Admin Email'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUBTAB 3: CHANGE PASSWORD */}
      {activeSubTab === 'password' && (
        <div className="max-w-xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/80 shadow-xs animate-in fade-in">
          <div className="mb-6">
            <h3 className="font-cinzel font-bold text-lg text-[#0F172A]">
              Change Admin Password
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Your new password will be encrypted with bcrypt (12 salt rounds) and saved to the server.
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-2xl glass-pill bg-white/80 border border-white/90 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                New Password (minimum 8 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-2xl glass-pill bg-white/80 border border-white/90 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength meter */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#64748B]">Password Strength:</span>
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

            {/* Confirm New Password */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#475569] block mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-2xl glass-pill bg-white/80 border border-white/90 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D49E24]/50 text-[#0F172A]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E6B942] via-[#D49E24] to-[#F5D372] text-[#0F172A] font-bold text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Encrypting & Saving...' : 'Save New Password'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
