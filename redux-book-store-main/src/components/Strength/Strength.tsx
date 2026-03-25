import { FiCheck, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const STRENGTHS = [
  {
    title: 'Streamlined Workflow',
    desc: 'End-to-end submission process built for speed — from form to publication in hours, not days.',
  },
  {
    title: 'One-Click Notice Management',
    desc: 'Track all your submitted notices from a single dashboard with live status updates.',
  },
  {
    title: 'Automated Publication Reminders',
    desc: 'Get notified at every stage — submission, approval, and final publication confirmation.',
  },
  {
    title: 'Efficient Document Verification',
    desc: 'Our team reviews and verifies every notice for accuracy and legal compliance before publishing.',
  },
  {
    title: 'Vendor Productivity Tracking',
    desc: 'Vendors get real-time visibility into assigned notices, earnings, and publication records.',
  },
];

const METRICS = [
  { label: 'Notices Submitted', val: '2,340', pct: 92 },
  { label: 'Approval Rate', val: '98.4%', pct: 98 },
  { label: 'Published On Time', val: '97.1%', pct: 97 },
  { label: 'Vendor Fulfilment', val: '94.8%', pct: 95 },
  { label: 'User Satisfaction', val: '4.9 / 5', pct: 98 },
];

const Strength = () => {
  return (
    <section
      style={{
        background: '#000',
        position: 'relative',
        overflow: 'hidden',
        padding: '96px 0',
      }}
    >
      <style>{`
        .fmd-str-blob {
          position: absolute; border-radius: 50%; pointer-events: none;
          background: rgba(244,153,26,0.07); filter: blur(80px);
        }
        .fmd-str-item {
          display: flex; gap: 16px; padding: 18px 0;
          border-bottom: 1px solid #EBE5C2;
          transition: padding-left .2s; cursor: default;
        }
        .fmd-str-item:last-child { border-bottom: none; }
        .fmd-str-item:hover { padding-left: 5px; }
        .fmd-str-check {
          width: 28px; height: 28px; border-radius: 8px;
          background: rgba(244,153,26,0.1); border: 1.5px solid rgba(244,153,26,0.25);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 2px; transition: background .2s, border-color .2s;
        }
        .fmd-str-item:hover .fmd-str-check {
          background: rgba(244,153,26,0.18); border-color: rgba(244,153,26,0.5);
        }
        .fmd-metrics-card {
          background: #fff; border: 1.5px solid #EBE5C2;
          border-radius: 20px; overflow: hidden; position: relative;
          box-shadow: 0 8px 32px rgba(80,75,56,0.08);
        }
        .fmd-metrics-top {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, transparent, #F4991A, transparent);
        }
        .fmd-prog-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 0; border-bottom: 1px solid #F8F3D9;
        }
        .fmd-prog-row:last-of-type { border-bottom: none; }
        .fmd-prog-bg {
          flex: 1; height: 5px; border-radius: 999px;
          background: #EBE5C2; margin: 0 14px;
        }
        .fmd-prog-fill { height: 5px; border-radius: 999px; background: #F4991A; }
        .fmd-status-badge {
          margin-top: 20px; padding: 12px 16px;
          background: rgba(244,153,26,0.07);
          border: 1px solid rgba(244,153,26,0.2);
          border-radius: 10px; display: flex; align-items: center; gap: 10px;
        }
        .fmd-str-cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: #F4991A; color: #fff; font-weight: 700; font-size: 13px;
          padding: 11px 22px; border-radius: 10px; text-decoration: none;
          transition: all .2s; margin-top: 28px;
        }
        .fmd-str-cta:hover { background: #e08810; box-shadow: 0 4px 18px rgba(244,153,26,0.35); }
        @media (max-width: 768px) {
          .fmd-str-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Decorative blobs */}
      <div
        className="fmd-str-blob"
        style={{ width: 500, height: 500, bottom: -120, left: -80 }}
      />
      <div
        className="fmd-str-blob"
        style={{
          width: 350,
          height: 350,
          top: -60,
          right: 0,
          background: 'rgba(185,178,138,0.1)',
        }}
      />

      <div
        style={{
          maxWidth: 1160,
          margin: '0 auto',
          padding: '0 28px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          className="fmd-str-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 72,
            alignItems: 'center',
          }}
        >
          {/* LEFT */}
          <div>
            <span
              style={{
                color: '#F4991A',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: 14,
              }}
            >
              Our Strength
            </span>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)',
                fontWeight: 900,
                color: '#504B38',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                marginBottom: 14,
              }}
            >
              Built for reliability.
              <br />
              <span style={{ color: '#B9B28A' }}>Designed to scale.</span>
            </h2>
            <p
              style={{
                color: '#B9B28A',
                fontSize: 15,
                lineHeight: 1.75,
                maxWidth: 440,
                marginBottom: 32,
              }}
            >
              Backed by a dedicated team and modern infrastructure, Formida
              delivers seamless public notice services with zero compromise on
              compliance or speed.
            </p>

            <div>
              {STRENGTHS.map((s) => (
                <div key={s.title} className="fmd-str-item">
                  <div className="fmd-str-check">
                    <FiCheck size={13} color="#F4991A" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p
                      style={{
                        color: '#504B38',
                        fontSize: 14,
                        fontWeight: 700,
                        fontFamily: "'Syne', sans-serif",
                        marginBottom: 3,
                      }}
                    >
                      {s.title}
                    </p>
                    <p
                      style={{
                        color: '#B9B28A',
                        fontSize: 13,
                        lineHeight: 1.6,
                      }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/notice" className="fmd-str-cta">
              Start a Notice <FiArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </div>

          {/* RIGHT — metrics card */}
          <div
            className="fmd-metrics-card"
            style={{ padding: '28px 28px 24px' }}
          >
            <div className="fmd-metrics-top" />
            <div style={{ marginBottom: 24 }}>
              <p
                style={{
                  color: '#B9B28A',
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                Platform Performance
              </p>
              <p
                style={{
                  fontFamily: "'Syne', sans-serif",
                  color: '#504B38',
                  fontWeight: 800,
                  fontSize: 20,
                }}
              >
                This Month
              </p>
            </div>

            {METRICS.map((row) => (
              <div key={row.label} className="fmd-prog-row">
                <span style={{ color: '#B9B28A', fontSize: 12, minWidth: 140 }}>
                  {row.label}
                </span>
                <div className="fmd-prog-bg">
                  <div
                    className="fmd-prog-fill"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    color: '#F4991A',
                    fontSize: 12,
                    fontWeight: 800,
                    minWidth: 56,
                    textAlign: 'right',
                  }}
                >
                  {row.val}
                </span>
              </div>
            ))}

            <div className="fmd-status-badge">
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#F4991A',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <p style={{ color: '#B9B28A', fontSize: 12, margin: 0 }}>
                All systems operational — last checked{' '}
                <strong style={{ color: '#504B38' }}>2 mins ago</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Strength;
