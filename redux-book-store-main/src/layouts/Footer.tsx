import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from 'react-icons/fa';
import { FiFileText, FiArrowRight } from 'react-icons/fi';

const Footer = () => {
  const [date] = useState(new Date());

  return (
    <footer
      style={{
        background: '#504B38',
        color: '#EBE5C2',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .fmd-foot-link {
          color: #B9B28A; font-size: 13.5px; text-decoration: none;
          transition: color .15s; display: inline-block;
        }
        .fmd-foot-link:hover { color: #F4991A; }
        .fmd-foot-social {
          width: 36px; height: 36px; border-radius: 9px;
          background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1);
          display: flex; align-items: center; justify-content: center;
          color: #B9B28A; font-size: 14px; text-decoration: none;
          transition: all .15s; flex-shrink: 0;
        }
        .fmd-foot-social:hover {
          background: rgba(244,153,26,.15);
          border-color: rgba(244,153,26,.3);
          color: #F4991A;
        }
        .fmd-foot-newsletter-input {
          flex: 1; background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 9px; padding: 9px 14px;
          font-size: 13px; color: #EBE5C2; outline: none;
          transition: border-color .15s;
        }
        .fmd-foot-newsletter-input::placeholder { color: rgba(235,229,194,.4); }
        .fmd-foot-newsletter-input:focus { border-color: rgba(244,153,26,.5); }
        .fmd-foot-newsletter-btn {
          background: #F4991A; color: #fff; border: none;
          border-radius: 9px; padding: 9px 16px;
          font-size: 13px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; gap: 6px;
          transition: background .2s; flex-shrink: 0;
          white-space: nowrap;
        }
        .fmd-foot-newsletter-btn:hover { background: #e08810; }
        .fmd-foot-divider { height: 1px; background: rgba(255,255,255,.08); }
        .fmd-foot-bottom { background: rgba(0,0,0,.2); }
      `}</style>

      {/* Decorative top line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background:
            'linear-gradient(90deg, transparent, #F4991A, transparent)',
        }}
      />

      {/* Main grid */}
      <div
        style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 28px 48px' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 48,
          }}
        >
          {/* Brand col */}
          <div>
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: '#F4991A',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FiFileText size={17} color="#fff" strokeWidth={2.5} />
              </div>
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 19,
                  fontWeight: 900,
                  color: '#F8F3D9',
                  letterSpacing: '-.4px',
                }}
              >
                form<span style={{ color: '#F4991A' }}>ida</span>
              </span>
            </div>

            <p
              style={{
                color: '#B9B28A',
                fontSize: 13.5,
                lineHeight: 1.75,
                maxWidth: 280,
                marginBottom: 28,
              }}
            >
              Nigeria's trusted platform for legal publications — change of
              name, court affidavits, lost documents, and more. Fast, compliant,
              and verified.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <a href="#" className="fmd-foot-social" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" className="fmd-foot-social" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="fmd-foot-social" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" className="fmd-foot-social" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Navigate */}
          <div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#F8F3D9',
                marginBottom: 20,
              }}
            >
              Navigate
            </h3>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {[
                { to: '/', label: 'Home' },
                { to: '/notice', label: 'Submit Notice' },
                { to: '/status', label: 'Check Status' },
                { to: '/publications', label: 'Publications' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="fmd-foot-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#F8F3D9',
                marginBottom: 20,
              }}
            >
              Help
            </h3>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {[
                { to: '/contact', label: 'Contact Us' },
                { to: '/support', label: 'Support Centre' },
                { to: '/faq', label: 'FAQs' },
                { to: '/vendor/login', label: 'Vendor Portal' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="fmd-foot-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#F8F3D9',
                marginBottom: 20,
              }}
            >
              Legal
            </h3>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {[
                { to: '/privacy-policy', label: 'Privacy Policy' },
                { to: '/terms-conditions', label: 'Terms & Conditions' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="fmd-foot-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div style={{ marginTop: 32 }}>
              <p
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#F8F3D9',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 12,
                }}
              >
                Stay Updated
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="fmd-foot-newsletter-input"
                />
                <button className="fmd-foot-newsletter-btn">
                  <FiArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="fmd-foot-divider" />

      {/* Bottom bar */}
      <div className="fmd-foot-bottom" style={{ padding: '18px 28px' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 12.5, color: '#B9B28A' }}>
            © {date.getFullYear()}{' '}
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                color: '#F8F3D9',
              }}
            >
              Formida
            </span>
            . All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link
              to="/privacy-policy"
              className="fmd-foot-link"
              style={{ fontSize: 12 }}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-conditions"
              className="fmd-foot-link"
              style={{ fontSize: 12 }}
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
