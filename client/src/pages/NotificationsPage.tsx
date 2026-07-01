import { useEffect, useState } from 'react';
import { api, type Notification } from '../lib/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    api.getNotifications()
      .then((items) => {
        if (active) {
          setNotifications(items);
          setError('');
        }
      })
      .catch((err) => {
        if (active) {
          setNotifications([]);
          setError(err instanceof Error ? err.message : 'Unable to load notifications.');
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
      <h3 className="text-2xl font-semibold">Notifications</h3>
      <div className="mt-6 space-y-3">
        {loading ? <p className="text-sm text-slate-500">Loading live notifications...</p> : null}
        {!loading && error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        {!loading && !error && notifications.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">No notifications yet.</p>
        ) : null}
        {!loading && !error && notifications.map((notification) => (
          <div key={notification.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{notification.title}</p>
                <p className="text-sm text-slate-600">{notification.message}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${notification.read ? 'bg-white text-slate-500' : 'bg-emerald-100 text-emerald-700'}`}>{notification.read ? 'Read' : 'New'}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
