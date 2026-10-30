import React, { useState } from 'react';
import { AlertCircle, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15';

export default function LoginPage({ onLogin, initialError = '' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(email.trim(), password);
    } catch (loginError) {
      setError(loginError.message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return <main className="flex min-h-screen items-center justify-center bg-[#edf3f0] p-4">
    <section className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-300/40 sm:p-8">
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-500 text-2xl font-black text-white">B</div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Sign in to Berry Admin</h1>
        <p className="mt-2 text-sm text-slate-500">Use your administrator account to continue.</p>
      </div>
      {error && <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"><AlertCircle size={18} className="mt-0.5 shrink-0" /><span>{error}</span></div>}
      <form onSubmit={submit} className="space-y-4">
        <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
          <span>Email address</span>
          <span className="relative block"><Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className={`${inputClass} pl-10`} required autoComplete="username" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@example.com" /></span>
        </label>
        <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
          <span>Password</span>
          <span className="relative block"><LockKeyhole size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className={`${inputClass} pl-10 pr-12`} required autoComplete="current-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>
        </label>
        <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0e8749] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0c743e] disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Signing in…' : <><ShieldCheck size={17} />Sign in</>}</button>
      </form>
      <p className="mt-5 text-center text-xs text-slate-500">Administrator access is required. Customer accounts cannot sign in here.</p>
    </section>
  </main>;
}
