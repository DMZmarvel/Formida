import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/Toast';
import {
  FiSearch,
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiArrowRight,
  FiDollarSign,
  FiCalendar,
  FiHash,
} from 'react-icons/fi';

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ||
  'http://localhost:4040/api';

type Notice = {
  referenceId: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  paid: boolean;
  publishAt?: string;
  fullName?: string;
  oldName?: string;
  newName?: string;
  docType?: string;
  content?: string;
  newspaper?: string;
  price?: number;
};

const STATUS_CONFIG = {
  approved: {
    label: 'Approved',
    color: '#2e7d5f',
    bg: 'rgba(46,125,95,.08)',
    border: 'rgba(46,125,95,.2)',
    icon: FiCheckCircle,
  },
  rejected: {
    label: 'Rejected',
    color: '#c0392b',
    bg: 'rgba(192,57,43,.07)',
    border: 'rgba(192,57,43,.2)',
    icon: FiXCircle,
  },
  pending: {
    label: 'Pending',
    color: '#F4991A',
    bg: 'rgba(244,153,26,.08)',
    border: 'rgba(244,153,26,.2)',
    icon: FiClock,
  },
};

const css = `
  .fmd-cs-page { background: #F8F3D9; min-height: 100vh; padding: 60px 0 100px; }
  .fmd-cs-container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
  .fmd-cs-header-card {
    background: #fff; border: 1.5px solid #EBE5C2; border-radius: 20px;
    padding: 36px 32px; margin-bottom: 24px;
    box-shadow: 0 2px 16px rgba(80,75,56,.06);
    position: relative; overflow: hidden;
  }
  .fmd-cs-header-accent {
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent, #F4991A, transparent);
  }
  .fmd-cs-search-row {
    display: flex; gap: 10px; margin-top: 24px;
  }
  .fmd-cs-input {
    flex: 1; border: 1.5px solid #EBE5C2; border-radius: 11px;
    background: #F8F3D9; padding: 12px 16px;
    font-size: 14px; color: #504B38; outline: none;
    transition: border-color .15s, background .15s;
    font-family: inherit;
  }
  .fmd-cs-input::placeholder { color: #B9B28A; }
  .fmd-cs-input:focus { border-color: #F4991A; background: #fff; box-shadow: 0 0 0 3px rgba(244,153,26,.1); }
  .fmd-cs-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: #F4991A; color: #fff; font-weight: 700; font-size: 13.5px;
    padding: 12px 24px; border-radius: 11px; border: none;
    cursor: pointer; transition: all .2s; white-space: nowrap; flex-shrink: 0;
  }
  .fmd-cs-btn:hover { background: #e08810; box-shadow: 0 4px 16px rgba(244,153,26,.35); }
  .fmd-cs-btn:disabled { opacity: .6; cursor: not-allowed; }
  .fmd-cs-result-card {
    background: #fff; border: 1.5px solid #EBE5C2; border-radius: 20px;
    overflow: hidden; box-shadow: 0 2px 16px rgba(80,75,56,.06);
    animation: fmd-fadein .3s ease;
  }
  @keyframes fmd-fadein { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  .fmd-cs-result-head { padding: 24px 28px; border-bottom: 1.5px solid #EBE5C2; }
  .fmd-cs-result-body { padding: 24px 28px; }
  .fmd-cs-row { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid #F8F3D9; }
  .fmd-cs-row:last-child { border-bottom: none; }
  .fmd-cs-row-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(244,153,26,.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .fmd-cs-row-label { font-size: 11px; color: #B9B28A; text-transform: uppercase; letter-spacing: .1em; font-weight: 600; margin-bottom: 2px; }
  .fmd-cs-row-val { font-size: 14px; color: #504B38; font-weight: 500; }
  .fmd-cs-content-box { background: #F8F3D9; border: 1.5px solid #EBE5C2; border-radius: 12px; padding: 16px; font-size: 14px; color: #504B38; line-height: 1.7; white-space: pre-wrap; }
  .fmd-cs-footer { padding: 20px 28px; border-top: 1.5px solid #EBE5C2; display: flex; gap: 10px; flex-wrap: wrap; }
  .fmd-cs-btn-ghost {
    display: inline-flex; align-items: center; gap: 7px;
    background: transparent; color: #504B38; font-weight: 600; font-size: 13px;
    padding: 10px 18px; border-radius: 10px; border: 1.5px solid #B9B28A;
    text-decoration: none; transition: all .2s;
  }
  .fmd-cs-btn-ghost:hover { background: #EBE5C2; border-color: #504B38; }
  .fmd-cs-btn-pay {
    display: inline-flex; align-items: center; gap: 7px;
    background: #2e7d5f; color: #fff; font-weight: 700; font-size: 13px;
    padding: 10px 20px; border-radius: 10px; text-decoration: none; transition: all .2s;
  }
  .fmd-cs-btn-pay:hover { background: #235f49; }
  /* Empty state */
  .fmd-cs-empty { text-align: center; padding: 48px 24px; }
  .fmd-cs-tips { background: #fff; border: 1.5px solid #EBE5C2; border-radius: 16px; padding: 22px 24px; margin-top: 20px; }
  .fmd-cs-tip { display: flex; align-items: flex-start; gap: 9px; padding: 8px 0; border-bottom: 1px solid #EBE5C2; }
  .fmd-cs-tip:last-child { border-bottom: none; }
  .fmd-cs-tip-dot { width: 6px; height: 6px; border-radius: 50%; background: #F4991A; flex-shrink: 0; margin-top: 5px; }
`;

const TIPS = [
  'Your reference ID was sent to your email after submission.',
  'Reference IDs follow the format: FMD-XXXX-XXXXXX.',
  'Approved notices are published within 3–7 business days after payment.',
  'Contact support if your reference ID cannot be found.',
];

export default function CheckStatus() {
  const { addToast } = useToast();
  const [ref, setRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [searched, setSearched] = useState(false);

  const onCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setSearched(false);
    if (!ref.trim()) {
      addToast('error', 'Enter your reference ID.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/notices/status/${encodeURIComponent(ref.trim())}`
      );
      setNotice(res.data);
      addToast('success', 'Status loaded.');
    } catch (err: any) {
      addToast('error', err?.response?.data?.message || 'No record found.');
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="fmd-cs-page">
        <div className="fmd-cs-container">
          {/* Header card */}
          <div className="fmd-cs-header-card">
            <div className="fmd-cs-header-accent" />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: '#F4991A',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FiSearch size={20} color="#fff" strokeWidth={2.5} />
              </div>
              <div>
                <h1
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 'clamp(1.3rem,3vw,1.8rem)',
                    fontWeight: 900,
                    color: '#504B38',
                    lineHeight: 1.1,
                  }}
                >
                  Check Publication Status
                </h1>
                <p style={{ color: '#B9B28A', fontSize: 13.5, marginTop: 3 }}>
                  Enter your reference ID to view the current status of your
                  notice.
                </p>
              </div>
            </div>

            <form onSubmit={onCheck} className="fmd-cs-search-row">
              <input
                className="fmd-cs-input"
                placeholder="e.g., FMD-2024-00842"
                value={ref}
                onChange={(e) => setRef(e.target.value)}
              />
              <button type="submit" disabled={loading} className="fmd-cs-btn">
                {loading ? (
                  <>Checking…</>
                ) : (
                  <>
                    <FiSearch size={14} /> Check Status
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Result */}
          {notice && (
            <div className="fmd-cs-result-card">
              {/* Result head — status banner */}
              {(() => {
                const cfg = STATUS_CONFIG[notice.status];
                const StatusIcon = cfg.icon;
                return (
                  <div className="fmd-cs-result-head">
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 11,
                            background: cfg.bg,
                            border: `1.5px solid ${cfg.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <StatusIcon
                            size={18}
                            color={cfg.color}
                            strokeWidth={2}
                          />
                        </div>
                        <div>
                          <div
                            style={{
                              fontFamily: "'Syne', sans-serif",
                              fontSize: 16,
                              fontWeight: 900,
                              color: '#504B38',
                            }}
                          >
                            {notice.type?.replace(/-/g, ' ')}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: '#B9B28A',
                              marginTop: 2,
                            }}
                          >
                            Ref:{' '}
                            <span style={{ color: '#504B38', fontWeight: 600 }}>
                              {notice.referenceId}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Badges */}
                      <div
                        style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '5px 13px',
                            borderRadius: 999,
                            background: cfg.bg,
                            border: `1.5px solid ${cfg.border}`,
                            fontSize: 12,
                            fontWeight: 700,
                            color: cfg.color,
                            fontFamily: "'Syne', sans-serif",
                          }}
                        >
                          <StatusIcon size={12} /> {cfg.label}
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '5px 13px',
                            borderRadius: 999,
                            background: notice.paid
                              ? 'rgba(46,125,95,.07)'
                              : 'rgba(244,153,26,.08)',
                            border: notice.paid
                              ? '1.5px solid rgba(46,125,95,.2)'
                              : '1.5px solid rgba(244,153,26,.25)',
                            fontSize: 12,
                            fontWeight: 700,
                            color: notice.paid ? '#2e7d5f' : '#F4991A',
                            fontFamily: "'Syne', sans-serif",
                          }}
                        >
                          <FiDollarSign size={12} />{' '}
                          {notice.paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Notice details */}
              <div className="fmd-cs-result-body">
                <div>
                  {notice.newspaper && (
                    <div className="fmd-cs-row">
                      <div className="fmd-cs-row-icon">
                        <FiFileText size={14} color="#F4991A" />
                      </div>
                      <div>
                        <div className="fmd-cs-row-label">Newspaper</div>
                        <div className="fmd-cs-row-val">{notice.newspaper}</div>
                      </div>
                    </div>
                  )}
                  {notice.price != null && (
                    <div className="fmd-cs-row">
                      <div className="fmd-cs-row-icon">
                        <FiDollarSign size={14} color="#F4991A" />
                      </div>
                      <div>
                        <div className="fmd-cs-row-label">Amount</div>
                        <div
                          className="fmd-cs-row-val"
                          style={{
                            fontFamily: "'Syne', sans-serif",
                            fontWeight: 800,
                            color: '#F4991A',
                          }}
                        >
                          ₦{Number(notice.price).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                  {notice.publishAt && (
                    <div className="fmd-cs-row">
                      <div className="fmd-cs-row-icon">
                        <FiCalendar size={14} color="#F4991A" />
                      </div>
                      <div>
                        <div className="fmd-cs-row-label">Publication Date</div>
                        <div className="fmd-cs-row-val">
                          {new Date(notice.publishAt).toDateString()}
                        </div>
                      </div>
                    </div>
                  )}
                  {notice.content && (
                    <div style={{ marginTop: 16 }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#B9B28A',
                          textTransform: 'uppercase',
                          letterSpacing: '.12em',
                          marginBottom: 10,
                        }}
                      >
                        Notice Content
                      </div>
                      <div className="fmd-cs-content-box">{notice.content}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer actions */}
              <div className="fmd-cs-footer">
                <Link
                  to={`/notice/preview/${notice.referenceId}`}
                  className="fmd-cs-btn-ghost"
                >
                  <FiFileText size={13} /> Preview Notice
                </Link>
                {!notice.paid && (
                  <Link
                    to={`/pay/${notice.referenceId}`}
                    className="fmd-cs-btn-pay"
                  >
                    Proceed to Payment <FiArrowRight size={13} />
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Empty / tip state — shown when searched but no result, or before any search */}
          {!notice && (
            <div className="fmd-cs-tips">
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#504B38',
                  marginBottom: 14,
                }}
              >
                Helpful Tips
              </div>
              {TIPS.map((tip, i) => (
                <div key={i} className="fmd-cs-tip">
                  <div className="fmd-cs-tip-dot" />
                  <p
                    style={{ fontSize: 13, color: '#B9B28A', lineHeight: 1.65 }}
                  >
                    {tip}
                  </p>
                </div>
              ))}
              <div
                style={{
                  marginTop: 18,
                  paddingTop: 16,
                  borderTop: '1px solid #EBE5C2',
                  display: 'flex',
                  gap: 10,
                  flexWrap: 'wrap',
                }}
              >
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
                    padding: '10px 18px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    transition: 'all .2s',
                  }}
                >
                  Submit a New Notice <FiArrowRight size={13} />
                </Link>
                <Link
                  to="/contact"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    background: 'transparent',
                    color: '#504B38',
                    fontWeight: 600,
                    fontSize: 13,
                    padding: '10px 16px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    border: '1.5px solid #B9B28A',
                    transition: 'all .2s',
                  }}
                >
                  Contact Support
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
