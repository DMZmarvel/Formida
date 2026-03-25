import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/Toast';
import {
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDollarSign,
  FiCalendar,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiTrendingUp,
  FiPlus,
} from 'react-icons/fi';

type Notice = {
  _id: string;
  referenceId: string;
  type: 'change-of-name' | 'lost-document' | 'court-affidavit' | string;
  status: 'pending' | 'approved' | 'rejected';
  paid: boolean;
  content?: string;
  publishAt?: string;
  price?: number;
  createdAt?: string;
};

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ||
  'http://localhost:4040/api';

const STATUS_CFG = {
  approved: {
    label: 'Approved',
    color: '#2e7d5f',
    bg: 'rgba(46,125,95,.08)',
    border: 'rgba(46,125,95,.2)',
    Icon: FiCheckCircle,
  },
  rejected: {
    label: 'Rejected',
    color: '#c0392b',
    bg: 'rgba(192,57,43,.07)',
    border: 'rgba(192,57,43,.2)',
    Icon: FiXCircle,
  },
  pending: {
    label: 'Pending',
    color: '#F4991A',
    bg: 'rgba(244,153,26,.08)',
    border: 'rgba(244,153,26,.2)',
    Icon: FiClock,
  },
};

const css = `
  .db-page { background: #F8F3D9; min-height: 100vh; padding: 40px 0 80px; }
  .db-container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
  .db-hero {
    background: #504B38; border-radius: 20px; padding: 32px 36px;
    margin-bottom: 24px; position: relative; overflow: hidden;
  }
  .db-hero-accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, transparent, #F4991A, transparent); }
  .db-hero-blob { position: absolute; border-radius: 50%; pointer-events: none; background: rgba(244,153,26,.1); filter: blur(60px); }
  .db-stat-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; margin-bottom: 24px; }
  .db-stat-card { background: #fff; border: 1.5px solid #EBE5C2; border-radius: 14px; padding: 18px 20px; transition: all .2s; }
  .db-stat-card:hover { border-color: rgba(244,153,26,.35); box-shadow: 0 4px 16px rgba(80,75,56,.08); }
  .db-stat-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
  .db-stat-val { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 900; line-height: 1; }
  .db-stat-label { font-size: 12px; color: #B9B28A; margin-top: 4px; }
  .db-main { background: #fff; border: 1.5px solid #EBE5C2; border-radius: 20px; padding: 28px; box-shadow: 0 2px 14px rgba(80,75,56,.05); }
  .db-select { border: 1.5px solid #EBE5C2; border-radius: 9px; background: #F8F3D9; padding: 8px 12px; font-size: 13px; color: #504B38; outline: none; font-family: inherit; cursor: pointer; }
  .db-select:focus { border-color: #F4991A; }
  .db-notice-card { background: #F8F3D9; border: 1.5px solid #EBE5C2; border-radius: 14px; overflow: hidden; margin-bottom: 12px; transition: all .2s; }
  .db-notice-card:hover { border-color: rgba(244,153,26,.4); background: #fff; }
  .db-notice-top { padding: 16px 20px 12px; border-bottom: 1px solid #EBE5C2; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
  .db-notice-body { padding: 12px 20px 16px; }
  .db-ref { background: #EBE5C2; color: #504B38; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 6px; font-family: monospace; }
  .db-type { display: inline-flex; align-items: center; background: #fff; border: 1px solid #EBE5C2; color: #B9B28A; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 999px; text-transform: capitalize; }
  .db-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 700; padding: 3px 10px; border-radius: 999px; border: 1.5px solid; }
  .db-content { color: #504B38; font-size: 13px; line-height: 1.7; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 12px; }
  .db-meta { display: flex; flex-wrap: wrap; gap: 14px; padding-top: 10px; border-top: 1px solid #EBE5C2; }
  .db-meta-item { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #B9B28A; }
  .db-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
  .db-btn-ghost { display: inline-flex; align-items: center; gap: 6px; background: #fff; color: #504B38; font-weight: 600; font-size: 12.5px; padding: 7px 15px; border-radius: 8px; border: 1.5px solid #EBE5C2; text-decoration: none; transition: all .2s; }
  .db-btn-ghost:hover { border-color: #504B38; }
  .db-btn-pay { display: inline-flex; align-items: center; gap: 6px; background: #F4991A; color: #fff; font-weight: 700; font-size: 12.5px; padding: 7px 16px; border-radius: 8px; text-decoration: none; transition: all .2s; }
  .db-btn-pay:hover { background: #e08810; }
  .db-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; flex-wrap: wrap; gap: 12px; }
  .db-page-btn { display: inline-flex; align-items: center; gap: 5px; border: 1.5px solid #EBE5C2; border-radius: 9px; background: #fff; color: #504B38; font-size: 13px; font-weight: 600; padding: 8px 16px; cursor: pointer; transition: all .15s; }
  .db-page-btn:hover:not(:disabled) { border-color: #F4991A; color: #F4991A; }
  .db-page-btn:disabled { opacity: .4; cursor: not-allowed; }
  .db-empty { text-align: center; padding: 48px 24px; }
  @media (max-width: 768px) { .db-stat-grid { grid-template-columns: repeat(2, 1fr) !important; } }
`;

export default function Dashboard() {
  const { addToast } = useToast();
  const [items, setItems] = React.useState<Notice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const token = React.useMemo(() => localStorage.getItem('token'), []);

  const fetchNotices = React.useCallback(async () => {
    if (!token) {
      setError('You must be logged in.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/notices/my`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
      });
      const payload = res.data;
      const list: Notice[] = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : [];
      const count =
        typeof payload?.total === 'number'
          ? payload.total
          : Array.isArray(payload)
            ? payload.length
            : list.length;
      setItems(list);
      setTotal(count);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Failed to fetch your notices.';
      setError(msg);
      addToast('error', msg);
    } finally {
      setLoading(false);
    }
  }, [token, page, limit, addToast]);

  React.useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const stats = React.useMemo(
    () => ({
      total: items.length,
      approved: items.filter((n) => n.status === 'approved').length,
      pending: items.filter((n) => n.status === 'pending').length,
      rejected: items.filter((n) => n.status === 'rejected').length,
      paid: items.filter((n) => n.paid).length,
    }),
    [items]
  );

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const STAT_CARDS = [
    {
      label: 'Total',
      value: stats.total,
      color: '#504B38',
      bg: 'rgba(80,75,56,.08)',
      border: 'rgba(80,75,56,.15)',
      icon: FiFileText,
    },
    {
      label: 'Approved',
      value: stats.approved,
      color: '#2e7d5f',
      bg: 'rgba(46,125,95,.1)',
      border: 'rgba(46,125,95,.2)',
      icon: FiCheckCircle,
    },
    {
      label: 'Pending',
      value: stats.pending,
      color: '#F4991A',
      bg: 'rgba(244,153,26,.1)',
      border: 'rgba(244,153,26,.25)',
      icon: FiClock,
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      color: '#c0392b',
      bg: 'rgba(192,57,43,.08)',
      border: 'rgba(192,57,43,.2)',
      icon: FiXCircle,
    },
    {
      label: 'Paid',
      value: stats.paid,
      color: '#2e7d5f',
      bg: 'rgba(46,125,95,.1)',
      border: 'rgba(46,125,95,.2)',
      icon: FiDollarSign,
    },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="db-page">
        <div className="db-container">
          {/* Hero */}
          <div className="db-hero">
            <div className="db-hero-accent" />
            <div
              className="db-hero-blob"
              style={{ width: 300, height: 300, top: -80, right: -60 }}
            />
            <div
              className="db-hero-blob"
              style={{
                width: 200,
                height: 200,
                bottom: -60,
                left: 200,
                background: 'rgba(244,153,26,.06)',
              }}
            />
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#F4991A',
                      display: 'inline-block',
                      animation: 'dbpulse 2s infinite',
                    }}
                  />
                  <style>{`@keyframes dbpulse{0%,100%{opacity:1}50%{opacity:.35}}`}</style>
                  <span
                    style={{
                      color: '#F4991A',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '.15em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Dashboard
                  </span>
                </div>
                <h1
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 'clamp(1.5rem,3vw,2rem)',
                    fontWeight: 900,
                    color: '#F8F3D9',
                    marginBottom: 6,
                  }}
                >
                  Welcome back
                </h1>
                <p style={{ color: '#B9B28A', fontSize: 13.5 }}>
                  Overview of your notices, statuses, and next steps.
                </p>
              </div>
              <Link
                to="/notice"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#F4991A',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 13.5,
                  padding: '11px 22px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  transition: 'all .2s',
                }}
              >
                <FiPlus size={15} strokeWidth={2.5} /> Submit New Notice
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="db-stat-grid">
            {STAT_CARDS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="db-stat-card">
                  <div
                    className="db-stat-icon"
                    style={{
                      background: s.bg,
                      border: `1.5px solid ${s.border}`,
                    }}
                  >
                    <Icon size={16} color={s.color} strokeWidth={2} />
                  </div>
                  <div className="db-stat-val" style={{ color: s.color }}>
                    {s.value}
                  </div>
                  <div className="db-stat-label">{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Notices table */}
          <div className="db-main">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 20,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 16,
                    fontWeight: 800,
                    color: '#504B38',
                  }}
                >
                  Recent Notices
                </h2>
                <p style={{ fontSize: 13, color: '#B9B28A', marginTop: 2 }}>
                  Latest submissions with quick actions.
                </p>
              </div>
              <select
                className="db-select"
                value={limit}
                onChange={(e) => {
                  setPage(1);
                  setLimit(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 50].map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 48,
                  gap: 10,
                  color: '#B9B28A',
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    border: '2.5px solid #EBE5C2',
                    borderTopColor: '#F4991A',
                    borderRadius: '50%',
                    animation: 'dbspin .7s linear infinite',
                  }}
                />
                <style>{`@keyframes dbspin{to{transform:rotate(360deg)}}`}</style>
                <span style={{ fontSize: 13 }}>Loading…</span>
              </div>
            ) : error ? (
              <div
                style={{
                  background: 'rgba(192,57,43,.05)',
                  border: '1.5px solid rgba(192,57,43,.15)',
                  borderRadius: 12,
                  padding: '16px 20px',
                  color: '#c0392b',
                  fontSize: 13.5,
                }}
              >
                {error}
              </div>
            ) : items.length === 0 ? (
              <div className="db-empty">
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    color: '#504B38',
                    fontSize: 15,
                    marginBottom: 8,
                  }}
                >
                  No notices yet
                </div>
                <p style={{ color: '#B9B28A', fontSize: 13, marginBottom: 18 }}>
                  Submit your first notice to get started.
                </p>
                <Link
                  to="/notice"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    background: '#F4991A',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 13,
                    padding: '10px 20px',
                    borderRadius: 10,
                    textDecoration: 'none',
                  }}
                >
                  Submit a Notice <FiArrowRight size={13} />
                </Link>
              </div>
            ) : (
              <>
                {items.map((n) => {
                  const scfg = STATUS_CFG[n.status] || STATUS_CFG.pending;
                  const SIcon = scfg.Icon;
                  return (
                    <div key={n._id} className="db-notice-card">
                      <div className="db-notice-top">
                        <span className="db-ref">{n.referenceId}</span>
                        <span className="db-type">
                          {n.type?.replace(/-/g, ' ')}
                        </span>
                        <span
                          className="db-badge"
                          style={{
                            background: scfg.bg,
                            color: scfg.color,
                            borderColor: scfg.border,
                          }}
                        >
                          <SIcon size={11} /> {scfg.label}
                        </span>
                        <span
                          className="db-badge"
                          style={{
                            background: n.paid
                              ? 'rgba(46,125,95,.08)'
                              : 'rgba(244,153,26,.08)',
                            color: n.paid ? '#2e7d5f' : '#F4991A',
                            borderColor: n.paid
                              ? 'rgba(46,125,95,.2)'
                              : 'rgba(244,153,26,.2)',
                          }}
                        >
                          <FiDollarSign size={11} />{' '}
                          {n.paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                      <div className="db-notice-body">
                        {n.content && <p className="db-content">{n.content}</p>}
                        <div className="db-meta">
                          {n.createdAt && (
                            <span className="db-meta-item">
                              <FiCalendar size={12} color="#F4991A" />
                              Submitted: {new Date(n.createdAt).toDateString()}
                            </span>
                          )}
                          {n.publishAt && (
                            <span className="db-meta-item">
                              <FiCalendar size={12} color="#F4991A" />
                              Publish: {new Date(n.publishAt).toDateString()}
                            </span>
                          )}
                          {n.price != null && (
                            <span className="db-meta-item">
                              <FiDollarSign size={12} color="#F4991A" />₦
                              {Number(n.price).toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="db-actions">
                          <Link
                            to={`/notice/preview/${n.referenceId}`}
                            className="db-btn-ghost"
                          >
                            <FiFileText size={13} /> Preview
                          </Link>
                          {!n.paid && (
                            <Link
                              to={`/pay/${n.referenceId}`}
                              className="db-btn-pay"
                            >
                              Pay Now <FiArrowRight size={13} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="db-pagination">
                  <span style={{ fontSize: 13, color: '#B9B28A' }}>
                    Page <strong style={{ color: '#504B38' }}>{page}</strong> of{' '}
                    <strong style={{ color: '#504B38' }}>{totalPages}</strong> ·{' '}
                    {total} total
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="db-page-btn"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <FiChevronLeft size={14} /> Prev
                    </button>
                    <button
                      className="db-page-btn"
                      disabled={page >= totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Next <FiChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
