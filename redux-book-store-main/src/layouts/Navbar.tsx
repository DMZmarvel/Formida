import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiFileText,
  FiUser,
  FiLogOut,
  FiGrid,
} from 'react-icons/fi';

type NavItem = { to: string; label: string; auth?: 'any' | 'authed' | 'admin' };

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', auth: 'any' },
  { to: '/notice', label: 'Submit Notice', auth: 'any' },
  { to: '/status', label: 'Check Status', auth: 'any' },
  { to: '/publications', label: 'Publications', auth: 'any' },
  { to: '/my-notices', label: 'My Notices', auth: 'authed' },
  { to: '/admin/notices', label: 'Admin', auth: 'admin' },
];

const css = `
  .fmd-nav { position: sticky; top: 0; z-index: 50; width: 100%; }
 .fmd-inner {
    background: #000;
    border-bottom: 3px solid; 
    border-image-source: linear-gradient(90deg, transparent, #F4991A, transparent);
    border-image-slice: 1;
    transition: box-shadow .25s;
  }
  .fmd-inner.scrolled {
    background: #000;
    backdrop-filter: blur(12px);
    box-shadow: 0 2px 20px rgba(80,75,56,0.1);
  }
  .fmd-wrap {
    max-width: 1200px; margin: 0 auto; padding: 0 24px;
    height: 68px; display: flex; align-items: center;
    justify-content: space-between; gap: 32px;
  }
  .fmd-logo { display:flex; align-items:center; gap:10px; text-decoration:none; flex-shrink:0; }
  .fmd-logo-mark {
    width: 36px; height: 36px; background: #F4991A; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
  }
  .fmd-logo-text {
    font-size: 19px; font-weight: 900; color: #EBE5C2;
    letter-spacing: -.5px; font-family: 'Syne', sans-serif;
  }
  .fmd-logo-text span { color: #F4991A; }
  .fmd-links { display:flex; align-items:center; gap:2px; list-style:none; margin:0; padding:0; }
  .fmd-link {
    text-decoration: none; font-size: 13.5px; font-weight: 500;
    color: #B9B28A; padding: 6px 13px; border-radius: 8px;
    transition: color .15s, background .15s; white-space: nowrap;
  }
  .fmd-link:hover { color: #504B38; background: #EBE5C2; }
  .fmd-link.active { color: #504B38; background: #EBE5C2; font-weight: 600; }
  .fmd-actions { display:flex; align-items:center; gap:8px; flex-shrink:0; }
  .fmd-ghost {
    text-decoration: none; font-size: 13.5px; font-weight: 500;
    color: #504B38; padding: 7px 16px; border-radius: 8px;
    border: 1.5px solid #B9B28A; background: transparent;
    cursor: pointer; white-space: nowrap;
    display: inline-flex; align-items: center; justify-content: center;
    transition: all .15s;
  }
  .fmd-ghost:hover { border-color: #504B38; background: #EBE5C2; }
  .fmd-primary {
    text-decoration: none; font-size: 13.5px; font-weight: 700;
    color: #fff; padding: 7px 18px; border-radius: 8px;
    background: #F4991A; border: none; cursor: pointer; white-space: nowrap;
    display: inline-flex; align-items: center; justify-content: center;
    transition: all .2s;
  }
  .fmd-primary:hover { background: #e08810; box-shadow: 0 4px 16px rgba(244,153,26,0.35); }
  .fmd-acc-wrap { position: relative; }
  .fmd-acc-btn {
    display: flex; align-items: center; gap: 8px;
    background: #EBE5C2; border: 1.5px solid #B9B28A;
    border-radius: 9px; padding: 5px 10px 5px 5px;
    cursor: pointer; transition: all .15s; color: #504B38;
  }
  .fmd-acc-btn:hover { background: #e0d9ad; border-color: #504B38; }
  .fmd-avatar {
    width: 28px; height: 28px; border-radius: 7px; background: #F4991A;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; color: #fff; flex-shrink: 0;
    font-family: 'Syne', sans-serif;
  }
  .fmd-acc-name {
    font-size: 13px; font-weight: 600; color: #504B38;
    max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .fmd-chev { color: #B9B28A; width: 14px; height: 14px; transition: transform .2s; flex-shrink: 0; }
  .fmd-chev.open { transform: rotate(180deg); }
  .fmd-drop {
    position: absolute; right: 0; top: calc(100% + 8px); width: 210px;
    background: #F8F3D9; border: 1.5px solid #EBE5C2;
    border-radius: 12px; overflow: hidden;
    box-shadow: 0 8px 32px rgba(80,75,56,0.15); z-index: 100;
  }
  .fmd-drop-head { padding: 13px 15px 11px; border-bottom: 1px solid #EBE5C2; }
  .fmd-drop-name { font-size: 13px; font-weight: 700; color: #504B38; font-family: 'Syne', sans-serif; }
  .fmd-drop-role { font-size: 11px; color: #B9B28A; margin-top: 2px; }
  .fmd-drop-item {
    display: flex; align-items: center; gap: 9px; padding: 9px 15px;
    font-size: 13px; font-weight: 500; color: #504B38;
    text-decoration: none; transition: background .12s;
    border: none; background: none; width: 100%; cursor: pointer; text-align: left;
  }
  .fmd-drop-item:hover { background: #EBE5C2; }
  .fmd-drop-item.danger { color: #c0392b; }
  .fmd-drop-item.danger:hover { background: #fdecea; }
  .fmd-drop-div { height: 1px; background: #EBE5C2; }
  .fmd-burger {
    display: none; align-items: center; justify-content: center;
    width: 36px; height: 36px; border-radius: 8px;
    border: 1.5px solid #B9B28A; background: transparent;
    color: #504B38; cursor: pointer; transition: all .15s; flex-shrink: 0;
  }
  .fmd-burger:hover { background: #EBE5C2; border-color: #504B38; }
  .fmd-overlay { position: fixed; inset: 0; z-index: 998; background: rgba(80,75,56,0.3); backdrop-filter: blur(3px); }
  .fmd-drawer {
    position: fixed; inset-x: 0; top: 68px; z-index: 999;
    background: #F8F3D9; border-bottom: 1.5px solid #EBE5C2;
    padding: 14px 20px 22px; max-height: calc(100vh - 68px); overflow-y: auto;
  }
  .fmd-drawer-links { list-style: none; margin: 0 0 14px; padding: 0; display: flex; flex-direction: column; gap: 2px; }
  .fmd-drawer-link {
    display: block; padding: 10px 12px; border-radius: 8px;
    font-size: 14px; font-weight: 500; color: #B9B28A;
    text-decoration: none; transition: all .12s;
  }
  .fmd-drawer-link:hover, .fmd-drawer-link.active { background: #EBE5C2; color: #504B38; font-weight: 600; }
  .fmd-drawer-foot { border-top: 1px solid #EBE5C2; padding-top: 14px; display: flex; gap: 8px; }
  .fmd-drawer-user { display: flex; align-items: center; justify-content: space-between; width: 100%; }
  .fmd-drawer-user-info { display: flex; align-items: center; gap: 10px; }
  @media (max-width: 900px) {
    .fmd-links, .fmd-actions { display: none !important; }
    .fmd-burger { display: flex !important; }
  }
`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [role, setRole] = useState<'user' | 'admin' | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    ['token', 'role', 'userName', 'userEmail'].forEach((k) =>
      localStorage.removeItem(k)
    );
    setIsAuthed(false);
    setRole(null);
    navigate('/login');
  };

  const isActive = (path: string) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  return (
    <>
      <style>{css}</style>
      <header className="fmd-nav">
        <div className={`fmd-inner${scrolled ? ' scrolled' : ''}`}>
          <div className="fmd-wrap">
            {/* Logo */}
            <Link to="/" className="fmd-logo">
              <div className="fmd-logo-mark">
                <FiFileText size={17} color="#fff" strokeWidth={2.5} />
              </div>
              <span className="fmd-logo-text">
                form<span>ida</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <ul className="fmd-links">
              {visibleItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`fmd-link${isActive(item.to) ? ' active' : ''}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop actions */}
            <div className="fmd-actions">
              {!isAuthed ? (
                <>
                  <Link to="/login" className="fmd-ghost">
                    Sign in
                  </Link>
                  <Link to="/register" className="fmd-primary">
                    Get started
                  </Link>
                </>
              ) : (
                <div className="fmd-acc-wrap">
                  <button
                    className="fmd-acc-btn"
                    onClick={() => setAccountOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={accountOpen}
                  >
                    <div className="fmd-avatar">{initials}</div>
                    <span className="fmd-acc-name">
                      {userName || 'Account'}
                    </span>
                    <FiChevronDown
                      className={`fmd-chev${accountOpen ? ' open' : ''}`}
                    />
                  </button>
                  {accountOpen && (
                    <div
                      className="fmd-drop"
                      onMouseLeave={() => setAccountOpen(false)}
                      role="menu"
                    >
                      <div className="fmd-drop-head">
                        <div className="fmd-drop-name">
                          {userName || 'Account'}
                        </div>
                        <div className="fmd-drop-role">
                          {role === 'admin' ? 'Administrator' : 'User'}
                        </div>
                      </div>
                      <Link
                        to="/dashboard"
                        className="fmd-drop-item"
                        role="menuitem"
                      >
                        <FiGrid size={13} /> Dashboard
                      </Link>
                      <Link
                        to="/my-notices"
                        className="fmd-drop-item"
                        role="menuitem"
                      >
                        <FiFileText size={13} /> My Notices
                      </Link>
                      {role === 'admin' && (
                        <Link
                          to="/admin/notices"
                          className="fmd-drop-item"
                          role="menuitem"
                        >
                          <FiUser size={13} /> Admin Panel
                        </Link>
                      )}
                      <div className="fmd-drop-div" />
                      <button
                        onClick={logout}
                        className="fmd-drop-item danger"
                        role="menuitem"
                      >
                        <FiLogOut size={13} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {isAuthed && <div className="fmd-avatar">{initials}</div>}
              <button
                className="fmd-burger"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <>
            <div
              className="fmd-overlay"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="fmd-drawer" role="dialog" aria-modal="true">
              <ul className="fmd-drawer-links">
                {visibleItems.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className={`fmd-drawer-link${isActive(item.to) ? ' active' : ''}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="fmd-drawer-foot">
                {!isAuthed ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="fmd-ghost"
                      style={{ flex: 1, textAlign: 'center' }}
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="fmd-primary"
                      style={{ flex: 1, textAlign: 'center' }}
                    >
                      Get started
                    </Link>
                  </>
                ) : (
                  <div className="fmd-drawer-user">
                    <div className="fmd-drawer-user-info">
                      <div className="fmd-avatar">{initials}</div>
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: '#504B38',
                            fontFamily: 'Syne,sans-serif',
                          }}
                        >
                          {userName}
                        </div>
                        <div style={{ fontSize: 11, color: '#B9B28A' }}>
                          {role === 'admin' ? 'Administrator' : 'User'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="fmd-ghost"
                      style={{ fontSize: 13 }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
