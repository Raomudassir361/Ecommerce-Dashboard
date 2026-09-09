import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('raomudassir1915068@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSentMessage, setResetSentMessage] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setIsLoading(true);

    // Simulate authenticating and signing in
    setTimeout(() => {
      setIsLoading(false);
      const authenticatedUser = {
        name: email.toLowerCase().includes('mudassir') ? 'Rao Mudassir' : email.split('@')[0],
        email: email.trim(),
        role: 'Store Manager (Pakistan)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        rememberMe
      };

      onLogin(authenticatedUser);
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    setEmail('raomudassir1915068@gmail.com');
    setPassword('admin123');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        name: 'Rao Mudassir',
        email: 'raomudassir1915068@gmail.com',
        role: 'Store Manager (Pakistan)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        rememberMe: true
      });
    }, 450);
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSentMessage(`Password reset instructions have been dispatched to ${resetEmail}.`);
    setTimeout(() => {
      setResetSentMessage('');
      setForgotModalOpen(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#edf3f0] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 antialiased font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0e8749] to-[#10b981] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-emerald-900/15"
            >
              B
            </motion.div>
            <div className="flex items-center gap-2 text-left">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                Berry
              </span>
              <span className="px-2 py-0.5 text-xs font-extrabold rounded-md bg-emerald-100 text-[#0e8749] tracking-wider">
                PK
              </span>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign in to Berry Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            E-Commerce Store Administration & Analytics Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-300/50 border border-slate-200/80">
          {/* Quick Demo Pill */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="mb-6 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                alt="Rao Mudassir"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/30 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">Rao Mudassir</p>
                <p className="text-[11px] text-emerald-700 truncate font-medium">raomudassir1915068@gmail.com</p>
              </div>
            </div>

            <motion.button
              type="button"
              id="quick-demo-login-btn"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleQuickDemoLogin}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-[#0e8749] hover:bg-[#0c743e] text-white text-xs font-bold shrink-0 shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>1-Click Sign In</span>
              <ArrowRight className="w-3 h-3" />
            </motion.button>
          </motion.div>

          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Regular Login Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#0e8749] focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs text-slate-600 font-medium">Keep me signed in</span>
              </label>
            </div>

            <motion.button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 rounded-xl bg-[#0e8749] hover:bg-[#0c743e] text-white font-bold text-sm shadow-md shadow-emerald-900/10 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Secure Guarantee Badge */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted Session • Berry E-Commerce PK</span>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {forgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setForgotModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 relative z-10"
            >
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Reset Password
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Enter your registered store administrator email to receive reset instructions.
              </p>

              {resetSentMessage ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{resetSentMessage}</span>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="raomudassir1915068@gmail.com"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0e8749] hover:bg-[#0c743e] rounded-xl shadow-xs cursor-pointer"
                    >
                      Send Link
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
