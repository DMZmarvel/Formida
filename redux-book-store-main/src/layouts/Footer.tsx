/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from 'react-icons/fa';

const Footer = () => {
  const [date] = useState(new Date());

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 py-12 px-6">
        {/* Brand */}
        <div>
          <h2 className="mb-6 text-lg font-extrabold text-white uppercase">
            Formida
          </h2>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/notice" className="hover:text-blue-400 transition">
                Submit Notice
              </Link>
            </li>
            <li>
              <Link to="/status" className="hover:text-blue-400 transition">
                Check Status
              </Link>
            </li>
            <li>
              <Link
                to="/publications"
                className="hover:text-blue-400 transition"
              >
                Publications
              </Link>
            </li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h2 className="mb-6 text-sm font-semibold text-gray-400 uppercase">
            Help
          </h2>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/contact" className="hover:text-blue-400 transition">
                Contact Us
              </Link>
            </li>
            <li>
              <a href="/support" className="hover:text-blue-400 transition">
                Support Center
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:text-blue-400 transition">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h2 className="mb-6 text-sm font-semibold text-gray-400 uppercase">
            Legal
          </h2>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="/privacy-policy"
                className="hover:text-blue-400 transition"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/terms-conditions"
                className="hover:text-blue-400 transition"
              >
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h2 className="mb-6 text-sm font-semibold text-gray-400 uppercase">
            Follow Us
          </h2>
          <div className="flex space-x-5 text-xl">
            <a href="#" className="hover:text-blue-500">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-pink-500">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-sky-400">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-blue-600">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-gray-800 py-4 px-6 text-center border-t border-gray-700">
        <span className="text-sm text-gray-400">
          © {date.getFullYear()} <span className="font-bold">Formida</span>. All
          rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
