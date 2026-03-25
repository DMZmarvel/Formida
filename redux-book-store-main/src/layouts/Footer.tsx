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
        background: '#000',
        color: '#B9B28A',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        .fmd-foot-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 64px 24px;
          display: grid;
          /* Desktop: 4 columns | Tablet: 2 columns | Mobile: 1 column */
          grid-template-columns: 2fr 1fr 1fr 1.2fr;
          gap: 40px;
        }

        .fmd-foot-link {
          color: #B9B28A; font-size: 13.5px; text-decoration: none;
          transition: color .15s; display: inline-block;
        }
        .fmd-foot-link:hover { color: #F4991A; }

        .fmd-foot-social {
          width: 36px; height: 36px; border-radius: 9px;
          background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1);
          display: flex; align-items: center; justify-content: center;
          color: #B9B28A; font-size: 14px; text-decoration: none; transition: all .15s;
        }
        .fmd-foot-social:hover { background: rgba(244,153,26,.15); border-color: rgba(244,153,26,.3); color: #F4991A; }

        .fmd-foot-newsletter-wrap { display: flex; gap: 8px; margin-top: 12px; }
        .fmd-foot-newsletter-input {
          flex: 1; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.1);
          border-radius: 9px; padding: 10px 14px; font-size: 13px; color: #EBE5C2; outline: none;
        }
        .fmd-foot-newsletter-btn {
          background: #F4991A; color: #fff; border: none; border-radius: 9px;
          padding: 0 16px; cursor: pointer; transition: background .2s;
        }

        .fmd-foot-bottom-wrap {
          max-width: 1200px; margin: 0 auto; padding: 20px 24px;
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 16px;
        }

        /* RESPONSIVE BREAKPOINTS */
        @media (max-width: 1024px) {
          .fmd-foot-container { grid-template-columns: 1.5fr 1fr 1fr; }
        }

        @media (max-width: 768px) {
          .fmd-foot-container { grid-template-columns: 1fr 1fr; gap: 32px; padding: 48px 24px; }
          .fmd-brand-col { grid-column: span 2; } /* Brand takes full width on tablet */
        }

        @media (max-width: 480px) {
          .fmd-foot-container { grid-template-columns: 1fr; text-align: center; }
          .fmd-brand-col { grid-column: span 1; }
          .fmd-brand-col p { margin: 0 auto 24px; }
          .fmd-foot-social-row { justify-content: center; }
          .fmd-foot-bottom-wrap { justify-content: center; text-align: center; }
        }
      `}</style>

      {/* The Gradient Border Bottom We Fixed Earlier */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background:
            'linear-gradient(90deg, transparent, #F4991A, transparent)',
          opacity: 0.5,
        }}
      />

      <div className="fmd-foot-container">
        {/* Brand Column */}
        <div className="fmd-brand-col">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 16,
              justifyContent: 'inherit',
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                background: '#F4991A',
                borderRadius: 9,
                display: 'flex',
                alignItems: 'center',
                justifySelf: 'center',
                justifyContent: 'center',
              }}
            >
              <FiFileText size={16} color="#fff" />
            </div>
            <span
              style={{
                fontFamily: 'Syne',
                fontSize: 20,
                fontWeight: 900,
                color: '#F8F3D9',
              }}
            >
              form<span style={{ color: '#F4991A' }}>ida</span>
            </span>
          </div>
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.6,
              maxWidth: 300,
              marginBottom: 24,
            }}
          >
            Nigeria's trusted platform for legal publications. Fast, compliant,
            and verified services for all legal notices.
          </p>
          <div
            className="fmd-foot-social-row"
            style={{ display: 'flex', gap: 10 }}
          >
            <a href="#" className="fmd-foot-social">
              <FaFacebookF />
            </a>
            <a href="#" className="fmd-foot-social">
              <FaInstagram />
            </a>
            <a href="#" className="fmd-foot-social">
              <FaTwitter />
            </a>
            <a href="#" className="fmd-foot-social">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Links Column */}
        <div>
          <h4
            style={{
              color: '#F8F3D9',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: 20,
            }}
          >
            Navigate
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link to="/" className="fmd-foot-link">
              Home
            </Link>
            <Link to="/notice" className="fmd-foot-link">
              Submit Notice
            </Link>
            <Link to="/status" className="fmd-foot-link">
              Check Status
            </Link>
            <Link to="/publications" className="fmd-foot-link">
              Publications
            </Link>
          </div>
        </div>

        {/* Support Column */}
        <div>
          <h4
            style={{
              color: '#F8F3D9',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: 20,
            }}
          >
            Support
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link to="/contact" className="fmd-foot-link">
              Contact Us
            </Link>
            <Link to="/faq" className="fmd-foot-link">
              FAQs
            </Link>
            <Link to="/vendor/login" className="fmd-foot-link">
              Vendor Portal
            </Link>
          </div>
        </div>

        {/* Newsletter Column */}
        <div>
          <h4
            style={{
              color: '#F8F3D9',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: 20,
            }}
          >
            Stay Updated
          </h4>
          <p style={{ fontSize: 12, marginBottom: 12 }}>
            Get the latest legal updates.
          </p>
          <div className="fmd-foot-newsletter-wrap">
            <input
              type="email"
              placeholder="Email address"
              className="fmd-foot-newsletter-input"
            />
            <button className="fmd-foot-newsletter-btn">
              <FiArrowRight />
            </button>
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,.05)' }} />

      <div style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="fmd-foot-bottom-wrap">
          <span style={{ fontSize: 12 }}>
            © {date.getFullYear()}{' '}
            <strong style={{ color: '#F8F3D9', fontFamily: 'Syne' }}>
              Formida
            </strong>
            . All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link
              to="/privacy"
              className="fmd-foot-link"
              style={{ fontSize: 12 }}
            >
              Privacy
            </Link>
            <Link
              to="/terms"
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
