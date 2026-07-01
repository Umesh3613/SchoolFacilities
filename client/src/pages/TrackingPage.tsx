import { useEffect, useState } from 'react';
import { api, type Issue } from '../lib/api';

const trackingStages: Array<{ label: string; statuses: Issue['status'][] }> = [
  { label: 'Reported', statuses: ['Pending', 'In Progress', 'Resolved'] },
  { label: 'Assigned', statuses: ['In Progress', 'Resolved'] },
  { label: 'Resolved', statuses: ['Resolved'] }
];

export default function TrackingPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    api.getIssues()
      .then((items) => {
        if (active) {
          setIssues(items);
          setError('');
        }
      })
      .catch((err) => {
        if (active) {
          setIssues([]);
          setError(err instanceof Error ? err.message : 'Unable to load repair tracking.');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-soft">
      <h3 className="text-2xl font-semibold">Repair tracking</h3>
      <p className="mt-2 text-sm text-slate-600">Follow the path from pending report to completed repair.</p>
      <div className="mt-6 space-y-4">
        {loading ? <p className="text-sm text-slate-500">Loading live tracking data...</p> : null}
        {!loading && error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        {!loading && !error && issues.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">No repair items are being tracked yet.</p>
        ) : null}
        {!loading && !error && issues.map((issue) => (
          <article key={issue.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-semibold">{issue.title}</h4>
                <p className="text-sm text-slate-600">{issue.location} - {issue.priority} priority</p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">{issue.status}</span>
            </div>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              {trackingStages.map((stage) => {
                const isActive = stage.statuses.includes(issue.status);

                return (
                  <div key={stage.label} className={`rounded-2xl px-4 py-3 ${isActive ? 'bg-sky/10 text-sky' : 'bg-white text-slate-500'}`}>
                    {stage.label}
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
