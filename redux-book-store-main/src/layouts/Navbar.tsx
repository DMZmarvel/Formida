import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import bagsq from '../Images/BagsQ.png';
import { FiMenu, FiX } from 'react-icons/fi';

type NavItem = { to: string; label: string; auth?: 'any' | 'authed' | 'admin' };

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', auth: 'any' },
  { to: '/notice', label: 'Submit Notice', auth: 'any' },
  { to: '/status', label: 'Check Status', auth: 'any' },
  { to: '/publications', label: 'Publications', auth: 'any' },
  { to: '/my-notices', label: 'My Notices', auth: 'authed' },
  { to: '/admin/notices', label: 'Admin', auth: 'admin' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [role, setRole] = useState<'user' | 'admin' | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Close menus & read auth on route change
  useEffect(() => {
    const token = localStorage.getItem('token');
    const r = (localStorage.getItem('role') as 'user' | 'admin' | null) || null;
    const name = localStorage.getItem('userName');
    setIsAuthed(!!token);
    setRole(r);
    setUserName(name);
    setAccountOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  // Allow ESC to close mobile drawer
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const initials = useMemo(() => {
    if (!userName) return 'U';
    const parts = userName.trim().split(' ').filter(Boolean);
    return (
      parts
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join('') || 'U'
    );
  }, [userName]);

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.auth === 'any') return true;
    if (item.auth === 'authed') return isAuthed;
    if (item.auth === 'admin') return isAuthed && role === 'admin';
    return true;
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setIsAuthed(false);
    setRole(null);
    navigate('/login');
  };

  const isActive = (path: string) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  const closeMenuAndGo = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-3 pt-3 pb-3">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-[1px] shadow-md">
          <nav className="rounded-2xl bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
            <div className="flex items-center justify-between px-4 py-2.5">
              {/* Brand */}
              <Link
                to="/"
                className="flex items-center gap-2"
                aria-label="Public Notice – Home"
              >
                <img
                  src={bagsq}
                  alt="Public Notice logo"
                  className="h-8 w-8 rounded-lg object-contain"
                />
                <span className="text-base md:text-lg font-extrabold text-gray-900">
                  Public Notice
                </span>
              </Link>

              {/* Desktop nav */}
              <ul className="hidden md:flex items-center gap-1">
                {visibleItems.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`px-3 py-2 text-sm rounded-xl transition ${
                        isActive(item.to)
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Right actions (desktop) */}
              <div className="hidden md:flex items-center gap-2">
                {!isAuthed ? (
                  <>
                    <Link
                      to="/login"
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => setAccountOpen((v) => !v)}
                      className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-800 hover:bg-gray-50"
                      aria-haspopup="menu"
                      aria-expanded={accountOpen}
                      aria-controls="account-menu"
                    >
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-white text-xs font-semibold">
                        {initials}
                      </span>
                      <span className="hidden sm:inline text-gray-700 max-w-[140px] truncate">
                        {userName || 'Account'}
                      </span>
                      <span className="sr-only">Toggle account menu</span>
                      <svg
                        className="h-4 w-4 text-gray-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {accountOpen && (
                      <div
                        id="account-menu"
                        className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-lg"
                        onMouseLeave={() => setAccountOpen(false)}
                        role="menu"
                      >
                        <Link
                          to="/dashboard"
                          className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 rounded-t-xl"
                          role="menuitem"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/my-notices"
                          className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
                          role="menuitem"
                        >
                          My Notices
                        </Link>
                        {role === 'admin' && (
                          <Link
                            to="/admin/notices"
                            className="block px-3 py-2 text-sm text-gray-800 hover:bg-gray-50"
                            role="menuitem"
                          >
                            Admin
                          </Link>
                        )}
                        <button
                          onClick={logout}
                          className="block w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-b-xl"
                          role="menuitem"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right side (mobile): CTA + burger */}
              <div className="md:hidden flex items-center gap-2">
                {!isAuthed ? (
                  <Link
                    to="/login"
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700"
                  >
                    Login
                  </Link>
                ) : (
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-white text-xs font-semibold">
                    {initials}
                  </span>
                )}

                {/* Burger button using react-icons */}
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="rounded-xl p-2 text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
                  aria-label="Toggle menu"
                  aria-controls="mobile-drawer"
                  aria-expanded={menuOpen}
                >
                  {menuOpen ? (
                    <FiX className="h-6 w-6" />
                  ) : (
                    <FiMenu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile drawer (full screen) */}
            {menuOpen && (
              <>
                {/* overlay */}
                <div
                  className="fixed inset-0 z-[999] bg-black/35 md:hidden"
                  onClick={() => setMenuOpen(false)}
                  aria-hidden="true"
                />
                <div
                  id="mobile-drawer"
                  className="fixed inset-x-0 top-0 z-[1000] md:hidden
                             mt-[76px] max-h-[calc(100vh-76px)] overflow-auto
                             rounded-b-2xl border border-t-0 border-gray-200 bg-white shadow-xl"
                  role="dialog"
                  aria-modal="true"
                >
                  <div className="px-4 pb-4">
                    <ul className="flex flex-col py-2">
                      {visibleItems.map((item) => (
                        <li key={item.to}>
                          <Link
                            to={item.to}
                            onClick={closeMenuAndGo}
                            className={`block rounded-lg px-3 py-2 text-sm transition ${
                              isActive(item.to)
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {/* Mobile auth actions */}
                    <div className="mt-2 border-t border-gray-200 pt-3">
                      {!isAuthed ? (
                        <div className="flex gap-2">
                          <Link
                            to="/login"
                            onClick={closeMenuAndGo}
                            className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-center text-sm text-white hover:bg-blue-700"
                          >
                            Login
                          </Link>
                          <Link
                            to="/register"
                            onClick={closeMenuAndGo}
                            className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-center text-sm text-gray-800 hover:bg-gray-50"
                          >
                            Register
                          </Link>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-xs font-semibold">
                              {initials}
                            </span>
                            <div className="text-sm text-gray-800">
                              {userName || 'Account'}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              closeMenuAndGo();
                              logout();
                            }}
                            className="rounded-xl bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700"
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
