import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearSession, getUser } from '../lib/auth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/report', label: 'Report Issue' },
  { to: '/tracking', label: 'Tracking' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/admin', label: 'Admin Panel' }
];

export default function Layout() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#edf7f5_100%)] text-ink">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden max-h-[100dvh] w-72 shrink-0 rounded-[28px] border border-white/60 bg-white/85 p-6 shadow-soft backdrop-blur lg:flex lg:flex-col">
          <div>
            <div className="inline-flex rounded-full bg-sky/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky">
              School Facility Portal
            </div>
            <h1 className="mt-4 text-2xl font-bold leading-tight">Safe campuses start with visible repair workflows.</h1>
            <p className="mt-3 text-sm text-slate-600">Track toilets, furniture, sanitation, and electrical hazards in one place.</p>
          </div>

          <nav className="mt-10 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-sky text-white shadow-lg shadow-sky/20' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-3xl bg-slate-900 p-5 text-white">
            <p className="text-sm text-slate-300">Signed in as</p>
            <p className="mt-1 font-semibold">{user?.name ?? 'Guest'}</p>
            <p className="text-sm text-slate-300">{user?.role ?? 'Visitor'}</p>
            <button className="mt-5 rounded-2xl bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <header className="mb-6 rounded-[28px] border border-white/70 bg-white/85 px-5 py-4 shadow-soft backdrop-blur">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-warm">School safety operations</p>
                <h2 className="text-xl font-semibold text-ink">Repair reporting and accountability dashboard</h2>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <span className="rounded-full bg-moss/10 px-3 py-1 font-medium text-moss">Priority workflow enabled</span>
                <span className="rounded-full bg-sky/10 px-3 py-1 font-medium text-sky">MongoDB ready</span>
              </div>
            </div>
          </header>

          <nav className="mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-white/70 bg-white/85 p-2 shadow-soft lg:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `shrink-0 rounded-xl px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-sky text-white' : 'bg-slate-50 text-slate-700'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button className="shrink-0 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white" onClick={handleLogout}>
              Log out
            </button>
          </nav>

          <div className="grid gap-6 xl:grid-cols-[1fr]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
