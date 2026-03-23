import {
  FiInbox,
  FiDollarSign,
  FiUsers,
  FiRefreshCw,
  FiArrowRight,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
// import benefitsImg from '../../Images/benefits.png';

const BENEFITS = [
  {
    icon: FiInbox,
    title: 'Centralised Records',
    desc: 'Access and manage all your published notices from one dashboard, anytime.',
  },
  {
    icon: FiDollarSign,
    title: 'Transparent Pricing',
    desc: 'Clear, upfront pricing with no hidden fees. Know exactly what you pay.',
  },
  {
    icon: FiUsers,
    title: 'Dedicated Support',
    desc: 'Our team is always available to guide you through your notice submission.',
  },
  {
    icon: FiRefreshCw,
    title: 'Easy Revisions',
    desc: 'Update or resubmit your notices quickly and efficiently before publication.',
  },
];

const Benefits = () => {
  return (
    <section
      style={{
        background: '#fff',
        padding: '96px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .fmd-ben-blob {
          position: absolute; border-radius: 50%; pointer-events: none;
          background: rgba(244,153,26,.07); filter: blur(80px);
        }
        .fmd-ben-card {
          background: #F8F3D9;
          border: 1.5px solid #EBE5C2;
          border-radius: 16px;
          padding: 24px;
          transition: all .25s;
          cursor: default;
        }
        .fmd-ben-card:hover {
          border-color: #F4991A;
          background: #fff;
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(244,153,26,.12);
        }
        .fmd-ben-icon {
          width: 46px; height: 46px; border-radius: 13px;
          background: rgba(244,153,26,.1);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px; transition: background .25s;
        }
        .fmd-ben-card:hover .fmd-ben-icon { background: rgba(244,153,26,.2); }
        .fmd-ben-img-wrap {
          position: relative; border-radius: 20px; overflow: hidden;
          box-shadow: 0 20px 56px rgba(80,75,56,.15);
        }
        .fmd-ben-img-badge {
          position: absolute; bottom: 20px; left: 20px;
          background: #fff; border: 1.5px solid #EBE5C2;
          border-radius: 13px; padding: 13px 18px;
          box-shadow: 0 6px 20px rgba(80,75,56,.12);
        }
        .fmd-ben-cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: #F4991A; color: #fff; font-weight: 700;
          font-size: 13px; padding: 11px 22px; border-radius: 10px;
          text-decoration: none; transition: all .2s;
        }
        .fmd-ben-cta:hover { background: #e08810; box-shadow: 0 4px 18px rgba(244,153,26,.35); }
        @media (max-width: 768px) {
          .fmd-ben-grid { grid-template-columns: 1fr !important; }
          .fmd-ben-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Decorative blobs */}
      <div
        className="fmd-ben-blob"
        style={{ width: 400, height: 400, top: -80, right: -80 }}
      />
      <div
        className="fmd-ben-blob"
        style={{
          width: 300,
          height: 300,
          bottom: -60,
          left: -60,
          background: 'rgba(185,178,138,.1)',
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
          className="fmd-ben-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.1fr',
            gap: 72,
            alignItems: 'center',
          }}
        >
          {/* LEFT — image */}
          <div style={{ position: 'relative' }}>
            <div className="fmd-ben-img-wrap">
              {/*
                Replace the src below with your actual image:
                import benefitsImg from '../../Images/benefits.png'
                Then use: src={benefitsImg}
              */}
              <img
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=700&q=80"
                alt="Formida benefits"
                style={{
                  width: '100%',
                  height: 420,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {/* Overlay tint */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(160deg, rgba(244,153,26,.06) 0%, transparent 60%)',
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* Floating badge */}
            <div className="fmd-ben-img-badge">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 5,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#F4991A',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#504B38',
                  }}
                >
                  Used by 12,400+ Nigerians
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#B9B28A' }}>
                Trusted legal publication platform
              </div>
            </div>

            {/* Decorative corner accent */}
            <div
              style={{
                position: 'absolute',
                top: -16,
                right: -16,
                width: 80,
                height: 80,
                borderRadius: 16,
                background: '#EBE5C2',
                zIndex: -1,
              }}
            />
          </div>

          {/* RIGHT — content */}
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
              Why Choose Formida
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
              Built around
              <br />
              <span style={{ color: '#F4991A' }}>your needs.</span>
            </h2>
            <p
              style={{
                color: '#B9B28A',
                fontSize: 15,
                lineHeight: 1.75,
                maxWidth: 440,
                marginBottom: 36,
              }}
            >
              Publish and manage your public notices with ease — fast, reliable,
              and tailored for individuals, organisations, and legal compliance
              across Nigeria.
            </p>

            {/* Benefit cards grid */}
            <div
              className="fmd-ben-cards"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 14,
                marginBottom: 36,
              }}
            >
              {BENEFITS.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="fmd-ben-card">
                    <div className="fmd-ben-icon">
                      <Icon size={20} color="#F4991A" strokeWidth={1.8} />
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        color: '#504B38',
                        fontWeight: 700,
                        fontSize: 13,
                        marginBottom: 6,
                      }}
                    >
                      {b.title}
                    </h3>
                    <p
                      style={{
                        color: '#B9B28A',
                        fontSize: 12,
                        lineHeight: 1.65,
                      }}
                    >
                      {b.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <Link to="/notice" className="fmd-ben-cta">
              Get Started <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
