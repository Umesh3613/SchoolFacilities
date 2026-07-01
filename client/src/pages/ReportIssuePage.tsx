import { useState, type FormEvent } from 'react';
import { api, type CreateIssuePayload } from '../lib/api';
import { getUser } from '../lib/auth';

type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';

const initialForm: CreateIssuePayload = {
  title: '',
  description: '',
  category: 'Furniture',
  location: '',
  priority: 'High'
};

export default function ReportIssuePage() {
  const user = getUser();
  const [form, setForm] = useState<CreateIssuePayload>(initialForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      await api.createIssue(form);
      setMessage('Issue submitted successfully.');
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit issue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-soft">
      <h3 className="text-2xl font-semibold">Report a facility issue</h3>
      <p className="mt-2 text-sm text-slate-600">Capture the problem, location, and urgency so maintenance can respond quickly.</p>
      <p className="mt-1 text-sm text-slate-500">Submitting as {user?.name ?? 'Signed-in user'}.</p>
      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={submit}>
        <input className="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" minLength={3} placeholder="Issue title" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        <textarea className="min-h-32 rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" minLength={10} placeholder="Description" required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        <select className="rounded-2xl border border-slate-200 px-4 py-3" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
          <option>Furniture</option>
          <option>Sanitation</option>
          <option>Electrical</option>
          <option>Safety</option>
          <option>Classroom Infrastructure</option>
        </select>
        <select className="rounded-2xl border border-slate-200 px-4 py-3" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as IssuePriority })}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
        <input className="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" minLength={3} placeholder="Location within school" required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} />
        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">{error}</p> : null}
        {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 md:col-span-2">{message}</p> : null}
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-teal-700 bg-teal-600 px-4 py-3 font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700 hover:shadow-teal-600/35 md:col-span-2 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit issue'}
        </button>
      </form>
    </section>
  );
}
