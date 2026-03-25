import {
  FiShield,
  FiZap,
  FiClipboard,
  FiUsers,
  FiArrowRight,
} from 'react-icons/fi';
import { BsFingerprint } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: FiClipboard,
    title: 'Multiple Notice Types',
    desc: 'Change of name, court affidavits, lost documents, public announcements — all in one place.',
  },
  {
    icon: FiZap,
    title: 'Fast Processing',
    desc: 'Submit your notice and get reviewed, approved, and published within 48 hours on average.',
  },
  {
    icon: BsFingerprint,
    title: 'Unique Reference ID',
    desc: 'Every submission gets a trackable reference number. Check your notice status anytime.',
  },
  {
    icon: FiShield,
    title: 'Legally Compliant',
    desc: 'All publications comply with Nigerian legal requirements and are published in recognised outlets.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Fill the Form',
    desc: 'Select your notice type and provide the required details.',
  },
  {
    num: '02',
    title: 'Make Payment',
    desc: 'Securely pay the applicable publication fee online.',
  },
  {
    num: '03',
    title: 'Get Published',
    desc: 'We handle everything else and send you proof of publication.',
  },
];

const Facilities = () => {
  return (
    <section
      style={{ background: '#000', position: 'relative', overflow: 'hidden' }}
    >
      <style>{`
        .fmd-feat-card {
          background: #F8F3D9;
          border: 1.5px solid #EBE5C2;
          border-radius: 16px;
          padding: 24px;
          transition: all .25s;
          position: relative;
          overflow: hidden;
        }
        .fmd-feat-card:hover {
          border-color: #F4991A;
          background: #fff;
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(244,153,26,0.12);
        }
        .fmd-feat-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(244,153,26,0.1);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 18px; transition: background .25s;
        }
        .fmd-feat-card:hover .fmd-feat-icon { background: rgba(244,153,26,0.18); }
        .fmd-step-num {
          width: 40px; height: 40px; border-radius: 12px;
          background: rgba(244,153,26,0.1); border: 1.5px solid rgba(244,153,26,0.25);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .fmd-step-line { flex:1; width: 1px; background: #EBE5C2; margin-top: 6px; min-height: 28px; }
        .fmd-vendor-card {
          background: #F8F3D9;
          border: 1.5px solid #EBE5C2;
          border-radius: 20px;
          padding: 32px;
          position: relative;
          overflow: hidden;
        }
        .fmd-vendor-top {
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, transparent, #F4991A, transparent);
        }
        .fmd-perk { display: flex; align-items: center; gap: 10px; font-size: 13.5px; color: #504B38; }
        .fmd-perk-dot { width: 7px; height: 7px; border-radius: 50%; background: #F4991A; flex-shrink: 0; }
        .fmd-primary-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #F4991A; color: #fff; font-weight: 700; font-size: 13px;
          padding: 11px 22px; border-radius: 10px; text-decoration: none; transition: all .2s;
        }
        .fmd-primary-btn:hover { background: #e08810; box-shadow: 0 4px 18px rgba(244,153,26,0.35); }
        .fmd-ghost-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: #504B38; font-weight: 600; font-size: 13px;
          padding: 10px 18px; border-radius: 10px; text-decoration: none;
          border: 1.5px solid #B9B28A; transition: all .2s;
        }
        .fmd-ghost-btn:hover { background: #EBE5C2; border-color: #504B38; }
        @media (max-width: 768px) {
          .fmd-fac-grid { grid-template-columns: 1fr 1fr !important; }
          .fmd-split-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .fmd-fac-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '96px 28px' }}>
        {/* Section header */}
        <div style={{ maxWidth: 560, marginBottom: 56 }}>
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
            Why Formida
          </span>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              color: '#504B38',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: 16,
            }}
          >
            Everything you need to
            <br />
            <span style={{ color: '#B9B28A' }}>publish a legal notice.</span>
          </h2>
          <p style={{ color: '#B9B28A', fontSize: 15, lineHeight: 1.75 }}>
            Built for individuals, lawyers, and businesses across Nigeria —
            Formida simplifies the entire legal publication process from start
            to finish.
          </p>
        </div>

        {/* Feature cards */}
        <div
          className="fmd-fac-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 16,
            marginBottom: 80,
          }}
        >
          {FEATURES.map((f) => {
            const Icon = f.icon as React.ElementType;
            return (
              <div key={f.title} className="fmd-feat-card">
                <div className="fmd-feat-icon">
                  <Icon size={20} color="#F4991A" strokeWidth={1.8} />
                </div>
                <h3
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    color: '#504B38',
                    fontWeight: 700,
                    fontSize: 14,
                    marginBottom: 8,
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ color: '#B9B28A', fontSize: 13, lineHeight: 1.65 }}>
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#EBE5C2', marginBottom: 64 }} />

        {/* How it works + Vendor */}
        <div
          className="fmd-split-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'start',
          }}
        >
          {/* Steps */}
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
              How It Works
            </span>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                fontWeight: 900,
                color: '#504B38',
                lineHeight: 1.15,
                marginBottom: 36,
              }}
            >
              Three steps to get
              <br />
              your notice published.
            </h2>

            <div>
              {STEPS.map((step, i) => (
                <div key={step.num} style={{ display: 'flex', gap: 16 }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <div className="fmd-step-num">
                      <span
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          color: '#F4991A',
                          fontSize: 12,
                          fontWeight: 900,
                        }}
                      >
                        {step.num}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && <div className="fmd-step-line" />}
                  </div>
                  <div style={{ paddingBottom: i < STEPS.length - 1 ? 24 : 0 }}>
                    <h4
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        color: '#504B38',
                        fontWeight: 700,
                        fontSize: 15,
                        marginBottom: 4,
                      }}
                    >
                      {step.title}
                    </h4>
                    <p
                      style={{
                        color: '#B9B28A',
                        fontSize: 13,
                        lineHeight: 1.65,
                      }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/notice"
              className="fmd-primary-btn"
              style={{ marginTop: 32 }}
            >
              Start Your Application <FiArrowRight size={14} />
            </Link>
          </div>

          {/* Vendor card */}
          <div className="fmd-vendor-card">
            <div className="fmd-vendor-top" />
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'rgba(244,153,26,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <FiUsers size={24} color="#F4991A" strokeWidth={1.6} />
            </div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                color: '#504B38',
                fontWeight: 900,
                fontSize: 22,
                lineHeight: 1.25,
                marginBottom: 12,
              }}
            >
              Are you a Publisher or
              <br />
              Media Vendor?
            </h3>
            <p
              style={{
                color: '#B9B28A',
                fontSize: 14,
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              Partner with Formida to receive and publish legal notices directly
              through your media outlet. Manage submissions, track earnings, and
              grow your publication business.
            </p>

            <div
              style={{ height: 1, background: '#EBE5C2', marginBottom: 20 }}
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                marginBottom: 28,
              }}
            >
              {[
                'Dedicated vendor dashboard',
                'Real-time notice assignments',
                'Transparent earnings tracking',
              ].map((p) => (
                <div key={p} className="fmd-perk">
                  <div className="fmd-perk-dot" />
                  {p}
                </div>
              ))}
            </div>

            <Link to="/vendor/login" className="fmd-ghost-btn">
              Vendor Portal <FiArrowRight size={13} color="#B9B28A" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Facilities;
