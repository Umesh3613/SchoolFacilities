import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { saveSession } from '../lib/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@school.edu');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.login({ email, password });
      saveSession(response.user, response.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="grid w-full max-w-5xl gap-8 rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-soft backdrop-blur lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
        <section className="rounded-[28px] bg-slate-950 p-8 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">School facilities</p>
          <h1 className="mt-5 text-4xl font-bold leading-tight">Report hazards before they become injuries.</h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300">
            Log unsafe toilets, broken desks, electrical faults, and sanitation issues with live tracking for parents, teachers, and admin staff.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ['24/7', 'Reporting availability'],
              ['Real-time', 'Status tracking'],
              ['Secure', 'JWT authentication'],
              ['MongoDB', 'Persistence ready']
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-slate-300">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col justify-center rounded-[28px] bg-paper p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">Login</h2>
          <p className="mt-2 text-sm text-slate-600">Use the seeded admin account or register a new school user.</p>
          <form className="mt-8 space-y-4" onSubmit={submit}>
            <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0 focus:border-sky" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0 focus:border-sky" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-2xl border border-teal-700 bg-teal-600 px-4 py-3 font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700 hover:shadow-teal-600/35 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="mt-5 text-sm text-slate-600">
            New user? <Link className="font-semibold text-sky" to="/register">Create an account</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
