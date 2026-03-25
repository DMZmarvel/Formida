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
} from 'react-icons/fi';

type Notice = {
  _id: string;
  referenceId: string;
  type: string;
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
  .mn-page { background: #F8F3D9; min-height: 100vh; padding: 40px 0 80px; }
  .mn-container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
  .mn-header {
    background: #fff; border: 1.5px solid #EBE5C2; border-radius: 20px;
    padding: 26px 28px; margin-bottom: 22px;
    box-shadow: 0 2px 14px rgba(80,75,56,.06);
    display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
    position: relative; overflow: hidden;
  }
  .mn-header-accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, transparent, #F4991A, transparent); }
  .mn-select { border: 1.5px solid #EBE5C2; border-radius: 9px; background: #F8F3D9; padding: 8px 12px; font-size: 13px; color: #504B38; outline: none; font-family: inherit; cursor: pointer; }
  .mn-select:focus { border-color: #F4991A; }
  .mn-card { background: #fff; border: 1.5px solid #EBE5C2; border-radius: 16px; overflow: hidden; margin-bottom: 14px; transition: all .2s; }
  .mn-card:hover { border-color: rgba(244,153,26,.4); box-shadow: 0 4px 20px rgba(80,75,56,.08); }
  .mn-card-top { padding: 18px 22px 14px; border-bottom: 1px solid #F8F3D9; }
  .mn-card-body { padding: 14px 22px 18px; }
  .mn-ref { background: #EBE5C2; color: #504B38; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 6px; font-family: monospace; }
  .mn-type-badge { display: inline-flex; align-items: center; background: #F8F3D9; border: 1px solid #EBE5C2; color: #504B38; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 999px; text-transform: capitalize; }
  .mn-status-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 700; padding: 4px 11px; border-radius: 999px; border: 1.5px solid; }
  .mn-paid-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 700; padding: 4px 11px; border-radius: 999px; border: 1.5px solid; }
  .mn-content { color: #504B38; font-size: 13px; line-height: 1.7; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .mn-meta { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 12px; padding-top: 10px; border-top: 1px solid #F8F3D9; }
  .mn-meta-item { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #B9B28A; }
  .mn-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
  .mn-btn-ghost { display: inline-flex; align-items: center; gap: 6px; background: transparent; color: #504B38; font-weight: 600; font-size: 12.5px; padding: 8px 16px; border-radius: 9px; border: 1.5px solid #B9B28A; text-decoration: none; transition: all .2s; }
  .mn-btn-ghost:hover { background: #EBE5C2; border-color: #504B38; }
  .mn-btn-pay { display: inline-flex; align-items: center; gap: 6px; background: #F4991A; color: #fff; font-weight: 700; font-size: 12.5px; padding: 8px 18px; border-radius: 9px; text-decoration: none; transition: all .2s; }
  .mn-btn-pay:hover { background: #e08810; }
  .mn-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; flex-wrap: wrap; gap: 12px; }
  .mn-page-btn { display: inline-flex; align-items: center; gap: 5px; border: 1.5px solid #EBE5C2; border-radius: 9px; background: #fff; color: #504B38; font-size: 13px; font-weight: 600; padding: 8px 16px; cursor: pointer; transition: all .15s; }
  .mn-page-btn:hover:not(:disabled) { border-color: #F4991A; color: #F4991A; }
  .mn-page-btn:disabled { opacity: .4; cursor: not-allowed; }
  .mn-empty { text-align: center; padding: 56px 24px; border: 1.5px dashed #B9B28A; border-radius: 16px; }
  .mn-error { background: rgba(192,57,43,.05); border: 1.5px solid rgba(192,57,43,.15); border-radius: 12px; padding: 16px 20px; color: #c0392b; font-size: 13.5px; margin-top: 20px; }
`;

export default function MyNotices() {
  const { addToast } = useToast();
  const [items, setItems] = React.useState<Notice[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [total, setTotal] = React.useState(0);

  const fetchNotices = React.useCallback(async () => {
    const token = localStorage.getItem('token');
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
      const msg = err?.response?.data?.message || 'Failed to fetch notices.';
      setError(msg);
      addToast('error', msg);
    } finally {
      setLoading(false);
    }
  }, [page, limit, addToast]);

  React.useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <>
      <style>{css}</style>
      <div className="mn-page">
        <div className="mn-container">
          {/* Header */}
          <div className="mn-header">
            <div className="mn-header-accent" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  background: '#F4991A',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FiFileText size={19} color="#fff" strokeWidth={2.5} />
              </div>
              <div>
                <h1
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 'clamp(1.2rem,3vw,1.7rem)',
                    fontWeight: 900,
                    color: '#504B38',
                  }}
                >
                  My Submitted Notices
                </h1>
                <p style={{ color: '#B9B28A', fontSize: 13, marginTop: 2 }}>
                  Track your submissions and next steps.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <select
                className="mn-select"
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
                  padding: '9px 18px',
                  borderRadius: 9,
                  textDecoration: 'none',
                  transition: 'all .2s',
                }}
              >
                + New Notice
              </Link>
            </div>
          </div>

          {/* States */}
          {loading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 56,
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
                  animation: 'mnspin .7s linear infinite',
                }}
              />
              <style>{`@keyframes mnspin{to{transform:rotate(360deg)}}`}</style>
              <span style={{ fontSize: 13 }}>Loading your notices…</span>
            </div>
          ) : error ? (
            <div className="mn-error">{error}</div>
          ) : items.length === 0 ? (
            <div className="mn-empty">
              <div style={{ fontSize: 40, marginBottom: 14 }}>📭</div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  color: '#504B38',
                  fontSize: 16,
                  marginBottom: 8,
                }}
              >
                No notices yet
              </div>
              <p style={{ color: '#B9B28A', fontSize: 13, marginBottom: 20 }}>
                You haven't submitted any notices yet.
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
                  padding: '10px 22px',
                  borderRadius: 10,
                  textDecoration: 'none',
                }}
              >
                Submit Your First Notice <FiArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <>
              {items.map((n) => {
                const scfg = STATUS_CFG[n.status] || STATUS_CFG.pending;
                const SIcon = scfg.Icon;
                return (
                  <div key={n._id} className="mn-card">
                    <div className="mn-card-top">
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <span className="mn-ref">{n.referenceId}</span>
                        <span className="mn-type-badge">
                          {n.type?.replace(/-/g, ' ')}
                        </span>
                        <span
                          className="mn-status-badge"
                          style={{
                            background: scfg.bg,
                            color: scfg.color,
                            borderColor: scfg.border,
                          }}
                        >
                          <SIcon size={12} /> {scfg.label}
                        </span>
                        <span
                          className="mn-paid-badge"
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
                    </div>

                    <div className="mn-card-body">
                      {n.content && <p className="mn-content">{n.content}</p>}

                      <div className="mn-meta">
                        {n.createdAt && (
                          <span className="mn-meta-item">
                            <FiCalendar size={12} color="#F4991A" />
                            Submitted: {new Date(n.createdAt).toDateString()}
                          </span>
                        )}
                        {n.publishAt && (
                          <span className="mn-meta-item">
                            <FiCalendar size={12} color="#F4991A" />
                            Publish: {new Date(n.publishAt).toDateString()}
                          </span>
                        )}
                        {n.price != null && (
                          <span className="mn-meta-item">
                            <FiDollarSign size={12} color="#F4991A" />₦
                            {Number(n.price).toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="mn-actions">
                        <Link
                          to={`/notice/preview/${n.referenceId}`}
                          className="mn-btn-ghost"
                        >
                          <FiFileText size={13} /> Preview
                        </Link>
                        {!n.paid && (
                          <Link
                            to={`/pay/${n.referenceId}`}
                            className="mn-btn-pay"
                          >
                            Pay Now <FiArrowRight size={13} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              <div className="mn-pagination">
                <span style={{ fontSize: 13, color: '#B9B28A' }}>
                  Page <strong style={{ color: '#504B38' }}>{page}</strong> of{' '}
                  <strong style={{ color: '#504B38' }}>{totalPages}</strong> ·{' '}
                  {total} total
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="mn-page-btn"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <FiChevronLeft size={14} /> Prev
                  </button>
                  <button
                    className="mn-page-btn"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next <FiChevronRight size={14} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
