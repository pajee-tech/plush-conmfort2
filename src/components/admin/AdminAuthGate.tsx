import React, { useState, useEffect } from 'react';
import { adminAuthService } from '../../services/adminAuthService';
import { AdminUser } from '../../types';
import {
  Lock,
  ShieldCheck,
  KeyRound,
  AlertTriangle,
  Copy,
  Check,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
  Info,
} from 'lucide-react';

interface AdminAuthGateProps {
  children: (props: { user: AdminUser; onLogout: () => void }) => React.ReactNode;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutMinutes, setLockoutMinutes] = useState<number | null>(null);

  // Master Init Wizard state
  const [initName, setInitName] = useState('');
  const [initEmail, setInitEmail] = useState('');
  const [initPassword, setInitPassword] = useState('');
  const [initConfirmPassword, setInitConfirmPassword] = useState('');
  const [initError, setInitError] = useState<string | null>(null);
  const [generatedRecoveryKey, setGeneratedRecoveryKey] = useState<string | null>(null);
  const [hasCopiedKey, setHasCopiedKey] = useState(false);

  // Recovery modal state
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [recovEmail, setRecovEmail] = useState('');
  const [recovKey, setRecovKey] = useState('');
  const [recovNewPassword, setRecovNewPassword] = useState('');
  const [recovError, setRecovError] = useState<string | null>(null);
  const [recovSuccess, setRecovSuccess] = useState<string | null>(null);

  // Check backend auth status on mount
  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const status = await adminAuthService.getStatus();
      setIsInitialized(status.initialized);
      if (status.authenticated && status.user) {
        setCurrentUser(status.user);
      } else {
        // Fallback to stored user if token exists
        const stored = adminAuthService.getStoredUser();
        const token = adminAuthService.getToken();
        if (stored && token) {
          setCurrentUser(stored);
        } else {
          setCurrentUser(null);
        }
      }
    } catch (err) {
      console.error('Auth status check error:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    try {
      const res = await adminAuthService.login(loginEmail, loginPassword, rememberMe);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setLockoutMinutes(null);
      } else {
        setLoginError(res.error || 'Invalid credentials');
        if (res.waitMinutes) {
          setLockoutMinutes(res.waitMinutes);
        }
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login connection failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMasterInit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInitError(null);

    if (initPassword !== initConfirmPassword) {
      setInitError('Passwords do not match');
      return;
    }

    if (initPassword.length < 8) {
      setInitError('Password must be at least 8 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await adminAuthService.initMaster(initName, initEmail, initPassword);
      if (res.success && res.recoveryKey) {
        setGeneratedRecoveryKey(res.recoveryKey);
        if (res.user) {
          setCurrentUser(res.user);
        }
        setIsInitialized(true);
      } else {
        setInitError(res.error || 'Initialization failed');
      }
    } catch (err: any) {
      setInitError(err.message || 'Initialization failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecovError(null);
    setRecovSuccess(null);

    try {
      const res = await adminAuthService.recoverPassword(recovEmail, recovKey, recovNewPassword);
      if (res.success) {
        setRecovSuccess('Password reset successfully. Please log in with your new password.');
        setTimeout(() => {
          setIsRecoveryOpen(false);
          setRecovSuccess(null);
          setLoginEmail(recovEmail);
        }, 2500);
      } else {
        setRecovError(res.error || 'Password recovery failed');
      }
    } catch (err: any) {
      setRecovError(err.message || 'Recovery failed');
    }
  };

  const handleLogout = async () => {
    await adminAuthService.logout();
    setCurrentUser(null);
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#A25828] text-white flex items-center justify-center mx-auto animate-pulse">
            <Lock className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-stone-600">Verifying secure administrative session...</p>
        </div>
      </div>
    );
  }

  // 1. ONE-TIME MASTER INITIALIZATION SCREEN
  if (!isInitialized && !currentUser) {
    if (generatedRecoveryKey) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E8E0D5] p-8 max-w-md w-full shadow-2xl space-y-6 animate-fade-in text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
              <KeyRound className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#A25828]">
                Master Security Key
              </span>
              <h2 className="font-serif font-bold text-2xl text-[#221C18] mt-1">
                Save Emergency Recovery Key
              </h2>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                This cryptographic key is required if you ever lose your Master Admin password. Store it securely in a password manager or offline safe.
              </p>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-dashed border-[#D5C7B7] space-y-2">
              <span className="text-[10px] font-bold uppercase text-stone-400">Master Recovery Key</span>
              <div className="font-mono font-bold text-sm text-[#A25828] tracking-wider select-all break-all">
                {generatedRecoveryKey}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generatedRecoveryKey);
                  setHasCopiedKey(true);
                }}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {hasCopiedKey ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedKey ? 'Copied to Clipboard' : 'Copy Key'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGeneratedRecoveryKey(null);
                }}
                className="flex-1 bg-[#A25828] hover:bg-[#8A461A] text-white py-3 rounded-full text-xs font-semibold transition-colors cursor-pointer"
              >
                Enter Admin Portal &rarr;
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-[#E8E0D5] p-8 max-w-md w-full shadow-2xl space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#A25828] text-white flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#A25828]">
              Initial Store Setup
            </span>
            <h2 className="font-serif font-bold text-2xl text-[#221C18]">
              Initialize Master Admin
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              No store owner account exists. Set up the one-time Master Admin credentials to take control of Plush Comfort UK.
            </p>
          </div>

          {initError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{initError}</span>
            </div>
          )}

          <form onSubmit={handleMasterInit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Store Owner Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Master Store Administrator"
                value={initName}
                onChange={(e) => setInitName(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Official Owner Email Address</label>
              <input
                type="email"
                required
                placeholder="admin@plushcomfort.uk"
                value={initEmail}
                onChange={(e) => setInitEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Master Password (min 8 chars)</label>
              <input
                type="password"
                required
                minLength={8}
                placeholder="••••••••••••"
                value={initPassword}
                onChange={(e) => setInitPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Confirm Master Password</label>
              <input
                type="password"
                required
                minLength={8}
                placeholder="••••••••••••"
                value={initConfirmPassword}
                onChange={(e) => setInitConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#A25828] hover:bg-[#8A461A] text-white py-3.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Master Security Profile...' : 'Initialize Master Admin &rarr;'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. SECURE LOGIN SCREEN (IF INITIALIZED BUT NOT AUTHENTICATED)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-[#E8E0D5] p-8 max-w-md w-full shadow-2xl space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#A25828] text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#A25828]">
              Authorized Staff Access Only
            </span>
            <h2 className="font-serif font-bold text-2xl text-[#221C18]">
              Plush Comfort Portal
            </h2>
            <p className="text-xs text-stone-500">
              Calder Road, Dewsbury WF12 9EA · Secure Operations System
            </p>
          </div>

          {lockoutMinutes && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Account temporarily locked due to repeated failed attempts. Please wait {lockoutMinutes} minute(s).
              </span>
            </div>
          )}

          {loginError && !lockoutMinutes && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Staff Email Address</label>
              <input
                type="email"
                required
                placeholder="admin@plushcomfort.uk"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#A25828]"
                />
                <span>Remember this device</span>
              </label>

              <button
                type="button"
                onClick={() => setIsRecoveryOpen(true)}
                className="text-[#A25828] hover:underline font-semibold cursor-pointer"
              >
                Emergency Recovery
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !!lockoutMinutes}
              className="w-full bg-[#A25828] hover:bg-[#8A461A] text-white py-3.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying Credentials...' : 'Sign In to Portal &rarr;'}
            </button>
          </form>
        </div>

        {/* Emergency Recovery Modal */}
        {isRecoveryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60" onClick={() => setIsRecoveryOpen(false)} />
            <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 z-10 shadow-2xl space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-xl text-[#221C18]">Master Account Recovery</h3>
                <p className="text-xs text-stone-500">
                  Reset password using the Master Recovery Key generated during initialization.
                </p>
              </div>

              {recovError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
                  {recovError}
                </div>
              )}
              {recovSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
                  {recovSuccess}
                </div>
              )}

              <form onSubmit={handleRecoverySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Master Admin Email</label>
                  <input
                    type="email"
                    required
                    value={recovEmail}
                    onChange={(e) => setRecovEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Master Recovery Key</label>
                  <input
                    type="text"
                    required
                    placeholder="PC-RECOV-XXXX-XXXX-XXXX-XXXX"
                    value={recovKey}
                    onChange={(e) => setRecovKey(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">New Master Password (min 8 chars)</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={recovNewPassword}
                    onChange={(e) => setRecovNewPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRecoveryOpen(false)}
                    className="flex-1 py-2.5 border rounded-xl font-semibold text-stone-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#A25828] text-white py-2.5 rounded-xl font-bold hover:bg-[#8A461A]"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. AUTHENTICATED PORTAL
  return (
    <div>
      {/* Top Admin Security Strip */}
      <div className="bg-[#221C18] text-stone-300 px-4 sm:px-6 lg:px-8 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-black">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-[#A25828]" />
            <span>Plush Comfort Management</span>
          </div>
          <span className="text-stone-500">|</span>
          <div className="flex items-center gap-2">
            <span className="text-stone-200 font-semibold">{currentUser.name}</span>
            <span className="bg-[#A25828] text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
            Active Session ID: {currentUser.id.slice(0, 12)}
          </span>
          <button
            onClick={handleLogout}
            className="text-stone-300 hover:text-white flex items-center gap-1 font-semibold transition-colors cursor-pointer text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {children({ user: currentUser, onLogout: handleLogout })}
    </div>
  );
};
