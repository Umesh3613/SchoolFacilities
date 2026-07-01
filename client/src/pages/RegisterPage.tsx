import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { saveSession } from '../lib/auth';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  role: 'Parent' | 'Teacher' | 'Admin';
  schoolId: string;
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({ name: '', email: '', password: '', role: 'Parent', schoolId: 'SCH-1001' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.register(form);
      saveSession(response.user, response.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-soft backdrop-blur sm:p-8">
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="mt-2 text-sm text-slate-600">Set up a parent, teacher, or admin profile tied to a school ID.</p>
        <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={submit}>
          <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3" minLength={2} placeholder="Full name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3" placeholder="Email" required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3" minLength={8} placeholder="Password" required type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as RegisterForm['role'] })}>
            <option>Parent</option>
            <option>Teacher</option>
            <option>Admin</option>
          </select>
          <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:col-span-2" minLength={3} placeholder="School ID" required value={form.schoolId} onChange={(event) => setForm({ ...form, schoolId: event.target.value })} />
          {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">{error}</p> : null}
          <button className="rounded-2xl bg-sky px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">Already registered?</p>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-teal-700 bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700"
            to="/login"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
