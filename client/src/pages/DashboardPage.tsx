import { useEffect, useState } from 'react';
import { api, type Issue } from '../lib/api';
import { getUser } from '../lib/auth';

export default function DashboardPage() {
  const user = getUser();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const refreshIssues = async (showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }

    try {
      const items = await api.getIssues();
      setIssues(items);
      setError('');
    } catch (err) {
      setIssues([]);
      setError(err instanceof Error ? err.message : 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      await refreshIssues(true);
    };

    load();

    const intervalId = window.setInterval(() => {
      if (active) {
        refreshIssues(false);
      }
    }, 15000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const resolved = issues.filter((issue) => issue.status === 'Resolved').length;
  const inProgress = issues.filter((issue) => issue.status === 'In Progress').length;
  const pending = issues.filter((issue) => issue.status === 'Pending').length;

  const cards = [
    { label: 'Total issues', value: issues.length, tone: 'bg-sky/10 text-sky' },
    { label: 'Resolved', value: resolved, tone: 'bg-moss/10 text-moss' },
    { label: 'In progress', value: inProgress, tone: 'bg-warm/10 text-warm' },
    { label: 'Pending', value: pending, tone: 'bg-slate-900/10 text-slate-900' }
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] bg-slate-900 p-6 text-white shadow-soft">
        <p className="text-sm text-slate-300">Welcome back, {user?.name ?? 'User'}</p>
        <h3 className="mt-2 text-3xl font-bold">Monitor school facility issues in real time.</h3>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Use this dashboard to prioritize repairs, keep stakeholders informed, and reduce delays on safety-critical maintenance.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-[24px] border border-white/60 bg-white/90 p-5 shadow-soft">
            <p className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${card.tone}`}>{card.label}</p>
            <p className="mt-4 text-4xl font-bold">{card.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-soft">
          <h4 className="text-lg font-semibold">Recent issues</h4>
          <div className="mt-4 space-y-3">
            {loading ? <p className="text-sm text-slate-500">Loading live issue data...</p> : null}
            {!loading && error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
            {!loading && !error && issues.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">No issues reported yet.</p>
            ) : null}
            {!loading && !error && issues.slice(0, 4).map((issue) => (
              <div key={issue.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{issue.title}</p>
                    <p className="text-sm text-slate-600">{issue.location} - {issue.category}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{issue.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-soft">
          <h4 className="text-lg font-semibold">What the portal improves</h4>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-slate-700">
            <li>Transparent repair workflow for parents and teachers</li>
            <li>Prioritization of safety-critical incidents</li>
            <li>Better accountability for school management</li>
            <li>Faster follow-up through notifications and status updates</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
