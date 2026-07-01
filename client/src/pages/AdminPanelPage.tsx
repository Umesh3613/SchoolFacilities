import { useEffect, useState } from 'react';
import { api, type Issue } from '../lib/api';
import { getUser } from '../lib/auth';

export default function AdminPanelPage() {
  const user = getUser();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState({ totalIssues: 0, resolvedCount: 0, inProgressCount: 0, pendingCount: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<Record<string, Issue['status']>>({});
  const [error, setError] = useState('');

  const refresh = async () => {
    const [issueList, overview] = await Promise.all([api.getIssues(), api.getAdminOverview()]);
    setIssues(issueList);
    setStats(overview);
  };

  useEffect(() => {
    if (user?.role !== 'Admin') {
      setLoading(false);
      return;
    }

    refresh()
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Unable to load admin overview.');
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (issue: Issue) => {
    const status = selectedStatuses[issue.id] ?? issue.status;

    setUpdatingId(issue.id);
    setError('');

    try {
      await api.updateIssue(issue.id, { status });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update issue status.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (user?.role !== 'Admin') {
    return (
      <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-soft">
        <h3 className="text-2xl font-semibold">Admin management</h3>
        <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">This area is restricted to admin users. Sign in with an admin account to manage issues.</p>
      </section>
    );
  }

  return (
    <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-soft">
      <h3 className="text-2xl font-semibold">Admin management</h3>
      {error ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="mt-4 text-sm text-slate-500">Loading admin overview...</p> : null}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Total', stats.totalIssues],
          ['Resolved', stats.resolvedCount],
          ['In progress', stats.inProgressCount],
          ['Pending', stats.pendingCount]
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {!loading && issues.map((issue) => (
          <div key={issue.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-semibold">{issue.title}</p>
                <p className="text-sm text-slate-600">{issue.location} - {issue.category} - Assigned to {issue.assignedTo}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                  value={selectedStatuses[issue.id] ?? issue.status}
                  onChange={(event) => setSelectedStatuses({ ...selectedStatuses, [issue.id]: event.target.value as Issue['status'] })}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
                <button
                  className="min-h-10 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={updatingId === issue.id || (selectedStatuses[issue.id] ?? issue.status) === issue.status}
                  onClick={() => updateStatus(issue)}
                >
                  {updatingId === issue.id ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
