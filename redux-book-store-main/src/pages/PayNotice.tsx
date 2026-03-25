import React from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/Toast';
import {
  FiShield,
  FiCheckCircle,
  FiFileText,
  FiCalendar,
  FiDollarSign,
  FiArrowRight,
  FiCreditCard,
  FiInfo,
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

const css = `
  .pay-page { background: #F8F3D9; min-height: 100vh; padding: 50px 0 90px; }
  .pay-container { max-width: 820px; margin: 0 auto; padding: 0 24px; }
  .pay-header {
    background: #504B38; border-radius: 20px; padding: 28px 32px;
    margin-bottom: 24px; position: relative; overflow: hidden;
  }
  .pay-header-accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, transparent, #F4991A, transparent); }
  .pay-header-blob { position: absolute; border-radius: 50%; background: rgba(244,153,26,.08); filter: blur(60px); pointer-events: none; }
  .pay-grid { display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start; }
  .pay-card { background: #fff; border: 1.5px solid #EBE5C2; border-radius: 18px; overflow: hidden; box-shadow: 0 2px 14px rgba(80,75,56,.06); }
  .pay-card-section { padding: 22px 24px; border-bottom: 1.5px solid #EBE5C2; }
  .pay-card-section:last-child { border-bottom: none; }
  .pay-ref { background: #EBE5C2; color: #504B38; font-size: 13px; font-weight: 700; padding: 4px 12px; border-radius: 7px; font-family: monospace; }
  .pay-type { display: inline-flex; background: #F8F3D9; border: 1.5px solid #EBE5C2; color: #504B38; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 999px; text-transform: capitalize; }
  .pay-row { display: flex; align-items: flex-start; gap: 12px; padding: 11px 0; border-bottom: 1px solid #F8F3D9; }
  .pay-row:last-child { border-bottom: none; }
  .pay-row-icon { width: 32px; height: 32px; border-radius: 9px; background: rgba(244,153,26,.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .pay-row-label { font-size: 11px; color: #B9B28A; text-transform: uppercase; letter-spacing: .1em; font-weight: 600; margin-bottom: 2px; }
  .pay-row-val { font-size: 14px; color: #504B38; font-weight: 500; }
  .pay-content-box { background: #F8F3D9; border: 1.5px solid #EBE5C2; border-radius: 11px; padding: 14px 16px; font-size: 13.5px; color: #504B38; line-height: 1.75; margin-top: 14px; }
  .pay-price-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; background: rgba(244,153,26,.05); border-top: 1.5px solid rgba(244,153,26,.15); }
  /* Payment methods */
  .pay-method { border: 1.5px solid #EBE5C2; border-radius: 13px; padding: 16px 18px; margin-bottom: 10px; cursor: pointer; transition: all .2s; background: #F8F3D9; }
  .pay-method:hover, .pay-method.selected { border-color: #F4991A; background: #fff; box-shadow: 0 3px 12px rgba(244,153,26,.12); }
  .pay-method-label { font-size: 13px; font-weight: 700; color: '#504B38'; display: flex; align-items: center; gap: 8px; }
  .pay-method-sub { font-size: 12px; color: #B9B28A; margin-top: 3px; }
  .pay-btn-primary { width: 100%; display: flex; align-items: center; justify-content: center; gap: 9px; background: #F4991A; color: #fff; font-weight: 700; font-size: 14px; padding: 14px; border-radius: 12px; border: none; cursor: pointer; transition: all .2s; margin-top: 14px; }
  .pay-btn-primary:hover { background: #e08810; box-shadow: 0 5px 20px rgba(244,153,26,.35); }
  .pay-btn-primary:disabled { opacity: .6; cursor: not-allowed; }
  .pay-btn-mock { width: 100%; display: flex; align-items: center; justify-content: center; gap: 9px; background: transparent; color: #504B38; font-weight: 600; font-size: 13px; padding: 11px; border-radius: 11px; border: 1.5px solid #B9B28A; cursor: pointer; transition: all .2s; margin-top: 8px; }
  .pay-btn-mock:hover { background: #EBE5C2; border-color: #504B38; }
  .pay-security { display: flex; align-items: center; gap: 7px; background: rgba(46,125,95,.06); border: 1px solid rgba(46,125,95,.15); border-radius: 9px; padding: 10px 14px; margin-top: 14px; }
  .pay-aside { background: #fff; border: 1.5px solid #EBE5C2; border-radius: 18px; padding: 22px; box-shadow: 0 2px 14px rgba(80,75,56,.05); position: sticky; top: 24px; }
  .pay-tip { display: flex; align-items: flex-start; gap: 8px; padding: 9px 0; border-bottom: 1px solid #EBE5C2; }
  .pay-tip:last-child { border-bottom: none; }
  .pay-tip-dot { width: 6px; height: 6px; border-radius: 50%; background: #F4991A; flex-shrink: 0; margin-top: 5px; }
  .pay-success-box { background: rgba(46,125,95,.06); border: 1.5px solid rgba(46,125,95,.2); border-radius: 14px; padding: 24px; text-align: center; }
  @media (max-width: 700px) { .pay-grid { grid-template-columns: 1fr !important; } }
`;

const PAYMENT_METHODS = [
  {
    id: 'paystack',
    label: 'Paystack',
    sub: 'Pay with card, bank transfer or USSD via Paystack',
    icon: '💳',
  },
  {
    id: 'flutterwave',
    label: 'Flutterwave',
    sub: 'Pay with card, mobile money or bank transfer',
    icon: '🦋',
  },
  {
    id: 'bank',
    label: 'Bank Transfer',
    sub: 'Direct bank transfer — attach proof of payment',
    icon: '🏦',
  },
];

export default function PayNotice() {
  const { refId } = useParams();
  const { addToast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [paying, setPaying] = React.useState(false);
  const [notice, setNotice] = React.useState<Notice | null>(null);
  const [selectedMethod, setSelectedMethod] = React.useState('paystack');

  const load = React.useCallback(async () => {
    if (!refId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/notices/status/${encodeURIComponent(refId)}`
      );
      setNotice(res.data);
    } catch (err: any) {
      addToast(
        'error',
        err?.response?.data?.message || 'Could not load notice.'
      );
    } finally {
      setLoading(false);
    }
  }, [refId, addToast]);

  React.useEffect(() => {
    load();
  }, [load]);

  // ─── Mock pay (keep for dev; replace with real gateway in prod) ───────────
  const mockPay = async () => {
    if (!refId) return;
    setPaying(true);
    try {
      const res = await axios.patch(
        `${API_BASE}/notices/mark-paid/${encodeURIComponent(refId)}`
      );
      setNotice(res.data?.notice ?? notice);
      addToast(
        'success',
        'Payment confirmed. Your notice is now marked as paid.'
      );
    } catch (err: any) {
      addToast(
        'error',
        err?.response?.data?.message || 'Payment confirmation failed.'
      );
    } finally {
      setPaying(false);
    }
  };

  // ─── Real gateway hook (Paystack example — wire up when ready) ─────────────
  const initiatePayment = () => {
    if (selectedMethod === 'paystack') {
      // TODO: Replace with real Paystack inline or redirect flow
      // Example:
      // const handler = PaystackPop.setup({
      //   key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      //   email: userEmail,
      //   amount: (notice?.price ?? 0) * 100,
      //   ref: `FMD-${Date.now()}`,
      //   onSuccess: (transaction) => verifyPayment(transaction.reference),
      //   onCancel: () => addToast('error', 'Payment cancelled.'),
      // });
      // handler.openIframe();
      addToast('error', 'Paystack not yet integrated. Use mock pay for now.');
    } else if (selectedMethod === 'flutterwave') {
      // TODO: Wire up Flutterwave
      addToast(
        'error',
        'Flutterwave not yet integrated. Use mock pay for now.'
      );
    } else {
      addToast(
        'error',
        'Bank transfer — send proof to support@formida.ng after transfer.'
      );
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="pay-page">
        <div className="pay-container">
          {/* Header */}
          <div className="pay-header">
            <div className="pay-header-accent" />
            <div
              className="pay-header-blob"
              style={{ width: 280, height: 280, top: -80, right: -40 }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
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
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#F4991A',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    color: '#F4991A',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '.15em',
                    textTransform: 'uppercase',
                  }}
                >
                  Secure Payment
                </span>
              </div>
              <h1
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 'clamp(1.4rem,3vw,1.9rem)',
                  fontWeight: 900,
                  color: '#F8F3D9',
                  marginBottom: 6,
                }}
              >
                Pay for Your Notice
              </h1>
              <p style={{ color: '#B9B28A', fontSize: 13.5 }}>
                Complete payment to schedule your legal notice for publication.
              </p>
            </div>
          </div>

          {loading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 64,
                gap: 10,
                color: '#B9B28A',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  border: '2.5px solid #EBE5C2',
                  borderTopColor: '#F4991A',
                  borderRadius: '50%',
                  animation: 'payspin .7s linear infinite',
                }}
              />
              <style>{`@keyframes payspin{to{transform:rotate(360deg)}}`}</style>
              <span style={{ fontSize: 13 }}>Loading notice…</span>
            </div>
          ) : !notice ? (
            <div
              style={{
                background: 'rgba(192,57,43,.05)',
                border: '1.5px solid rgba(192,57,43,.15)',
                borderRadius: 14,
                padding: 24,
                textAlign: 'center',
                color: '#c0392b',
                fontSize: 14,
              }}
            >
              Notice not found. Please check your reference ID.
            </div>
          ) : notice.paid ? (
            /* ── Already paid ── */
            <div className="pay-success-box">
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: 'rgba(46,125,95,.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <FiCheckCircle size={24} color="#2e7d5f" strokeWidth={2} />
              </div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 900,
                  color: '#2e7d5f',
                  fontSize: 18,
                  marginBottom: 8,
                }}
              >
                Payment Confirmed!
              </div>
              <p style={{ color: '#B9B28A', fontSize: 13.5, marginBottom: 8 }}>
                Your notice is scheduled for publication.
              </p>
              {notice.publishAt && (
                <p
                  style={{
                    color: '#504B38',
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 22,
                  }}
                >
                  Estimated publish date:{' '}
                  {new Date(notice.publishAt).toDateString()}
                </p>
              )}
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Link
                  to={`/notice/preview/${notice.referenceId}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    background: 'transparent',
                    color: '#504B38',
                    fontWeight: 600,
                    fontSize: 13,
                    padding: '10px 18px',
                    borderRadius: 10,
                    border: '1.5px solid #B9B28A',
                    textDecoration: 'none',
                  }}
                >
                  <FiFileText size={13} /> View Preview
                </Link>
                <Link
                  to="/publications"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    background: '#2e7d5f',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 13,
                    padding: '10px 18px',
                    borderRadius: 10,
                    textDecoration: 'none',
                  }}
                >
                  Go to Publications <FiArrowRight size={13} />
                </Link>
              </div>
            </div>
          ) : (
            /* ── Payment flow ── */
            <div className="pay-grid">
              {/* Left: notice details + payment */}
              <div>
                {/* Notice summary */}
                <div className="pay-card" style={{ marginBottom: 16 }}>
                  <div className="pay-card-section">
                    <div
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#B9B28A',
                        textTransform: 'uppercase',
                        letterSpacing: '.12em',
                        marginBottom: 12,
                      }}
                    >
                      Notice Summary
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 8,
                        marginBottom: 16,
                      }}
                    >
                      <span className="pay-ref">{notice.referenceId}</span>
                      <span className="pay-type">
                        {notice.type?.replace(/-/g, ' ')}
                      </span>
                    </div>
                    <div>
                      {notice.newspaper && (
                        <div className="pay-row">
                          <div className="pay-row-icon">
                            <FiFileText size={14} color="#F4991A" />
                          </div>
                          <div>
                            <div className="pay-row-label">Newspaper</div>
                            <div className="pay-row-val">
                              {notice.newspaper}
                            </div>
                          </div>
                        </div>
                      )}
                      {notice.publishAt && (
                        <div className="pay-row">
                          <div className="pay-row-icon">
                            <FiCalendar size={14} color="#F4991A" />
                          </div>
                          <div>
                            <div className="pay-row-label">Publish Date</div>
                            <div className="pay-row-val">
                              {new Date(notice.publishAt).toDateString()}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {notice.content && (
                      <div className="pay-content-box">{notice.content}</div>
                    )}
                  </div>

                  {/* Price row */}
                  <div className="pay-price-row">
                    <div>
                      <div
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: 13,
                          fontWeight: 700,
                          color: '#504B38',
                        }}
                      >
                        Total Amount
                      </div>
                      <div
                        style={{ fontSize: 12, color: '#B9B28A', marginTop: 2 }}
                      >
                        One-time publication fee
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 26,
                        fontWeight: 900,
                        color: '#F4991A',
                      }}
                    >
                      ₦{Number(notice.price ?? 0).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Payment methods */}
                <div
                  style={{
                    background: '#fff',
                    border: '1.5px solid #EBE5C2',
                    borderRadius: 18,
                    padding: '22px 22px 24px',
                    boxShadow: '0 2px 14px rgba(80,75,56,.05)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 18,
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        background: 'rgba(244,153,26,.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FiCreditCard size={16} color="#F4991A" />
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: 14,
                          fontWeight: 800,
                          color: '#504B38',
                        }}
                      >
                        Choose Payment Method
                      </div>
                      <div
                        style={{ fontSize: 12, color: '#B9B28A', marginTop: 1 }}
                      >
                        All transactions are encrypted and secure
                      </div>
                    </div>
                  </div>

                  {PAYMENT_METHODS.map((m) => (
                    <div
                      key={m.id}
                      className={`pay-method${selectedMethod === m.id ? ' selected' : ''}`}
                      onClick={() => setSelectedMethod(m.id)}
                    >
                      <div
                        className="pay-method-label"
                        style={{ color: '#504B38' }}
                      >
                        <span style={{ fontSize: 18 }}>{m.icon}</span>
                        {m.label}
                        {selectedMethod === m.id && (
                          <span
                            style={{
                              marginLeft: 'auto',
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              background: '#F4991A',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <FiCheckCircle
                              size={10}
                              color="#fff"
                              strokeWidth={2.5}
                            />
                          </span>
                        )}
                      </div>
                      <div className="pay-method-sub">{m.sub}</div>
                    </div>
                  ))}

                  {/* Pay button */}
                  <button
                    className="pay-btn-primary"
                    onClick={initiatePayment}
                    disabled={paying}
                  >
                    <FiShield size={15} strokeWidth={2.5} />
                    Pay ₦{Number(notice.price ?? 0).toLocaleString()} Securely
                  </button>

                  {/* Dev mock */}
                  <button
                    className="pay-btn-mock"
                    onClick={mockPay}
                    disabled={paying}
                  >
                    {paying ? 'Processing…' : '🧪 Mock Payment (Dev Only)'}
                  </button>

                  <div className="pay-security">
                    <FiShield size={13} color="#2e7d5f" strokeWidth={2} />
                    <span style={{ fontSize: 12, color: '#2e7d5f' }}>
                      256-bit SSL encrypted · Your card details are never stored
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: 11.5,
                      color: '#B9B28A',
                      marginTop: 12,
                      lineHeight: 1.65,
                    }}
                  >
                    In production, the mock button above will be removed and
                    replaced with a live Paystack or Flutterwave checkout.
                    Contact <strong>support@formida.ng</strong> with any payment
                    issues.
                  </p>
                </div>
              </div>

              {/* Right: aside tips */}
              <div className="pay-aside">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      background: 'rgba(244,153,26,.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FiInfo size={14} color="#F4991A" />
                  </div>
                  <div
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 14,
                      fontWeight: 800,
                      color: '#504B38',
                    }}
                  >
                    Payment Info
                  </div>
                </div>
                {[
                  'Your notice will be scheduled immediately after payment is confirmed.',
                  'Publication occurs within 3–7 business days in your selected newspaper.',
                  "You'll receive an email confirmation with your publication receipt.",
                  'Payments are one-time and non-refundable once publication begins.',
                  'Contact support if you experience any payment issues.',
                ].map((tip, i) => (
                  <div key={i} className="pay-tip">
                    <div className="pay-tip-dot" />
                    <p
                      style={{
                        fontSize: 12.5,
                        color: '#B9B28A',
                        lineHeight: 1.65,
                      }}
                    >
                      {tip}
                    </p>
                  </div>
                ))}

                {/* Amount summary box */}
                <div
                  style={{
                    marginTop: 20,
                    background: '#F8F3D9',
                    border: '1.5px solid #EBE5C2',
                    borderRadius: 12,
                    padding: '16px 18px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#B9B28A',
                      textTransform: 'uppercase',
                      letterSpacing: '.1em',
                      marginBottom: 10,
                    }}
                  >
                    Order Summary
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 13,
                      color: '#504B38',
                      marginBottom: 6,
                    }}
                  >
                    <span>Publication Fee</span>
                    <span style={{ fontWeight: 600 }}>
                      ₦{Number(notice.price ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 13,
                      color: '#B9B28A',
                      marginBottom: 12,
                    }}
                  >
                    <span>Processing Fee</span>
                    <span>₦0</span>
                  </div>
                  <div
                    style={{
                      height: 1,
                      background: '#EBE5C2',
                      marginBottom: 12,
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 15,
                      color: '#504B38',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 900,
                        color: '#F4991A',
                        fontSize: 18,
                      }}
                    >
                      ₦{Number(notice.price ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
