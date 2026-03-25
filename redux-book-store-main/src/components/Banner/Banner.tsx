import { Link } from 'react-router-dom';
import { FiArrowRight, FiSearch, FiCheckCircle } from 'react-icons/fi';
// Replace with your actual hero image import:
// import heroImg from '../../Images/hero.jpg';

const NOTICE_TYPES = [
  'Change of Name',
  'Court Affidavit',
  'Lost Document',
  'Public Notice',
  'Newspaper Publication',
];

const STATS = [
  { value: '12,400+', label: 'Notices Published' },
  { value: '98%', label: 'Approval Rate' },
  { value: '48hrs', label: 'Avg Turnaround' },
];

const Banner = () => {
  return (
    <section
      style={{
        background: '#000',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <style>{`
        .fmd-hero-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(244,153,26,0.12);
          border: 1px solid rgba(244,153,26,0.3);
          border-radius: 999px; padding: 5px 14px;
          font-size: 11px; font-weight: 700;
          letter-spacing: .14em; text-transform: uppercase; color: #F4991A;
          margin-bottom: 24px;
        }
        .fmd-hero-pulse {
          width: 7px; height: 7px; border-radius: 50%; background: #F4991A;
          animation: fmd-pulse 2s infinite;
        }
        @keyframes fmd-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        .fmd-hero-pill {
          background: #EBE5C2; border: 1px solid #B9B28A;
          color: #504B38; font-size: 11px; font-weight: 600;
          padding: 5px 13px; border-radius: 999px;
          transition: background .2s, border-color .2s;
        }
        .fmd-hero-pill:hover { background: #e0d9ad; border-color: #504B38; }
        .fmd-hero-stat-divider {
          width: 1px; background: #B9B28A; align-self: stretch; opacity: .4;
        }
        .fmd-hero-img-wrap {
          position: relative; border-radius: 20px; overflow: hidden;
          box-shadow: 0 24px 64px rgba(80,75,56,0.2);
        }
        .fmd-hero-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, rgba(244,153,26,0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .fmd-floating-card {
          position: absolute; bottom: -16px; left: -20px;
          background: #fff; border: 1.5px solid #EBE5C2;
          border-radius: 14px; padding: 14px 18px;
          box-shadow: 0 8px 24px rgba(80,75,56,0.15);
          min-width: 200px;
        }
        .fmd-floating-card2 {
          position: absolute; top: 20px; right: -20px;
          background: #F4991A; border-radius: 14px; padding: 14px 18px;
          box-shadow: 0 8px 24px rgba(244,153,26,0.35);
          min-width: 160px;
        }
        /* Decorative blobs */
        .fmd-blob1 {
          position: absolute; width: 400px; height: 400px; border-radius: 50%;
          background: rgba(244,153,26,0.08); filter: blur(80px);
          top: -100px; right: -100px; pointer-events: none;
        }
        .fmd-blob2 {
          position: absolute; width: 300px; height: 300px; border-radius: 50%;
          background: rgba(185,178,138,0.15); filter: blur(60px);
          bottom: 0; left: 0; pointer-events: none;
        }
        /* Dot pattern */
        .fmd-dots {
          position: absolute; inset: 0; pointer-events: none;
          opacity: .5;
          background-image: radial-gradient(circle, #B9B28A 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 60% 60% at 80% 50%, black 0%, transparent 100%);
        }
        .fmd-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: #F4991A; color: #fff; font-weight: 700; font-size: 14px;
          padding: 13px 26px; border-radius: 12px; text-decoration: none;
          transition: all .2s; border: none; cursor: pointer;
        }
        .fmd-btn-primary:hover {
          background: #e08810;
          box-shadow: 0 6px 24px rgba(244,153,26,0.4);
          transform: translateY(-1px);
        }
        .fmd-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: #504B38; font-weight: 600; font-size: 14px;
          padding: 13px 24px; border-radius: 12px; text-decoration: none;
          border: 1.5px solid #B9B28A; transition: all .2s;
        }
        .fmd-btn-ghost:hover { border-color: #504B38; background: #EBE5C2; }
        @media (max-width: 768px) {
          .fmd-hero-right { display: none !important; }
        }
      `}</style>

      {/* Decorative */}
      <div className="fmd-blob1" />
      <div className="fmd-blob2" />
      <div className="fmd-dots" />

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '100px 28px 80px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 72,
            alignItems: 'center',
          }}
        >
          {/* LEFT COPY */}
          <div>
            <div className="fmd-hero-badge">
              <span className="fmd-hero-pulse" />
              Nigeria's Legal Publication Platform
            </div>

            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(2.6rem, 5vw, 4rem)',
                fontWeight: 900,
                color: '#504B38',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                marginBottom: 20,
              }}
            >
              Publish Your
              <br />
              <span style={{ color: '#F4991A' }}>Legal Notice</span>
              <br />
              The Right Way.
            </h1>

            <p
              style={{
                color: '#B9B28A',
                fontSize: 16,
                lineHeight: 1.75,
                maxWidth: 440,
                marginBottom: 32,
              }}
            >
              Change of name, court affidavits, lost documents and more — filed,
              published, and tracked entirely online. Fast, compliant, and
              legally recognised.
            </p>

            {/* Notice type pills */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                marginBottom: 36,
              }}
            >
              {NOTICE_TYPES.map((t) => (
                <span key={t} className="fmd-hero-pill">
                  {t}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                marginBottom: 44,
              }}
            >
              <Link to="/notice" className="fmd-btn-primary">
                Submit a Notice <FiArrowRight size={16} />
              </Link>
              <Link to="/status" className="fmd-btn-ghost">
                <FiSearch size={15} /> Check Status
              </Link>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: 'flex',
                gap: 28,
                paddingTop: 28,
                borderTop: '1.5px solid #EBE5C2',
                alignItems: 'center',
              }}
            >
              {STATS.map((s, i) => (
                <>
                  <div key={s.label}>
                    <div
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 24,
                        fontWeight: 900,
                        color: '#504B38',
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{ fontSize: 12, color: '#B9B28A', marginTop: 4 }}
                    >
                      {s.label}
                    </div>
                  </div>
                  {i < STATS.length - 1 && (
                    <div className="fmd-hero-stat-divider" />
                  )}
                </>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="fmd-hero-right" style={{ position: 'relative' }}>
            <div className="fmd-hero-img-wrap">
              {/*
                Replace the src below with your actual image:
                import heroImg from '../../Images/hero.jpg'
                Then use: src={heroImg}
              */}
              <img
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80"
                alt="Legal notice publication"
                style={{
                  width: '100%',
                  height: 460,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div className="fmd-hero-img-overlay" />
            </div>

            {/* Floating card — bottom left */}
            <div className="fmd-floating-card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <FiCheckCircle size={16} color="#F4991A" />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#504B38',
                    fontFamily: 'Syne, sans-serif',
                  }}
                >
                  Notice Approved
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#B9B28A', marginBottom: 4 }}>
                FMD-2025-00842
              </div>
              <div style={{ fontSize: 11, color: '#B9B28A' }}>
                Published in The Punch — today
              </div>
            </div>

            {/* Floating card — top right (stat) */}
            <div className="fmd-floating-card2">
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.75)',
                  textTransform: 'uppercase',
                  letterSpacing: '.12em',
                  marginBottom: 4,
                }}
              >
                This Month
              </div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 28,
                  fontWeight: 900,
                  color: '#fff',
                  lineHeight: 1,
                }}
              >
                1,240
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.75)',
                  marginTop: 4,
                }}
              >
                Notices submitted
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
