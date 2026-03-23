import punch from '../../Images/companies/punch.png';
import vanguard from '../../Images/companies/vanguard.png';
import channels from '../../Images/companies/channels.png';
import dailytrust from '../../Images/companies/dailytrust.png';
import thisday from '../../Images/companies/thisday.png';
import leadership from '../../Images/companies/leadership.png';
import thenation from '../../Images/companies/thenation.png';
import sun from '../../Images/companies/sun.png';
import tribune from '../../Images/companies/tribune.png';

const LOGOS = [
  { src: punch, name: 'Punch' },
  { src: vanguard, name: 'Vanguard' },
  { src: channels, name: 'Channels' },
  { src: dailytrust, name: 'Daily Trust' },
  { src: thisday, name: 'ThisDay' },
  { src: leadership, name: 'Leadership' },
  { src: thenation, name: 'The Nation' },
  { src: sun, name: 'The Sun' },
  { src: tribune, name: 'Tribune' },
];

const TRACK = [...LOGOS, ...LOGOS];

const CorporateClient = () => {
  return (
    <section
      style={{
        background: '#EBE5C2',
        padding: '80px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .fmd-corp-fade-l {
          position: absolute; left: 0; top: 0; bottom: 0; width: 120px; z-index: 2;
          background: linear-gradient(to right, #EBE5C2, transparent); pointer-events: none;
        }
        .fmd-corp-fade-r {
          position: absolute; right: 0; top: 0; bottom: 0; width: 120px; z-index: 2;
          background: linear-gradient(to left, #EBE5C2, transparent); pointer-events: none;
        }
        .fmd-corp-track {
          display: flex; gap: 16px; width: max-content;
          animation: fmd-corp-scroll 28s linear infinite;
        }
        .fmd-corp-track:hover { animation-play-state: paused; }
        @keyframes fmd-corp-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .fmd-corp-card {
          width: 180px; height: 90px;
          background: #F8F3D9; border: 1.5px solid #B9B28A;
          border-radius: 14px; display: flex; align-items: center;
          justify-content: center; padding: 16px; flex-shrink: 0;
          transition: border-color .25s, background .25s, transform .2s;
          cursor: default;
        }
        .fmd-corp-card:hover {
          border-color: #F4991A; background: #fff;
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(244,153,26,0.15);
        }
        .fmd-corp-card img {
          max-width: 120px; max-height: 52px; object-fit: contain;
          filter: grayscale(1) brightness(0.7) sepia(0.2); transition: filter .25s;
        }
        .fmd-corp-card:hover img { filter: grayscale(0) brightness(1) sepia(0); }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48, padding: '0 28px' }}>
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
          Our Publishing Partners
        </span>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
            fontWeight: 900,
            color: '#504B38',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          Trusted by Nigeria's
          <span style={{ color: '#B9B28A' }}> top media outlets.</span>
        </h2>
      </div>

      {/* Marquee */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="fmd-corp-fade-l" />
        <div className="fmd-corp-fade-r" />
        <div style={{ padding: '8px 0', overflow: 'hidden' }}>
          <div className="fmd-corp-track">
            {TRACK.map((logo, i) => (
              <div key={i} className="fmd-corp-card">
                <img src={logo.src} alt={logo.name} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div
        style={{
          maxWidth: 680,
          margin: '52px auto 0',
          padding: '0 28px',
        }}
      >
        <div
          style={{
            background: '#F8F3D9',
            border: '1.5px solid #B9B28A',
            borderRadius: 16,
            padding: '24px 32px',
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          {[
            { val: '9+', label: 'Partner Publications' },
            { val: 'National', label: 'Coverage' },
            { val: 'Daily', label: 'Publication Slots' },
          ].map((s, i, arr) => (
            <div
              key={s.label}
              style={{
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: 24,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 28,
                    fontWeight: 900,
                    color: '#504B38',
                    lineHeight: 1,
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#B9B28A',
                    marginTop: 6,
                    letterSpacing: '0.04em',
                  }}
                >
                  {s.label}
                </div>
              </div>
              {i < arr.length - 1 && (
                <div style={{ width: 1, height: 36, background: '#EBE5C2' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CorporateClient;
