// src/shared/Social/Social.tsx
import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ||
  'http://localhost:4040/api';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''; // mirror your .env

declare global {
  interface Window {
    google?: any;
  }
}

export default function Social() {
  const buttonRef = React.useRef<HTMLDivElement | null>(null);

  const handleCredential = async (response: { credential: string }) => {
    try {
      // Send Google ID token to your backend
      const res = await axios.post(`${API_BASE}/auth/google`, {
        idToken: response.credential,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role || 'user');
      localStorage.setItem('userName', res.data.user.name);
      localStorage.setItem('userEmail', res.data.user.email);

      toast.success('Signed in with Google');
      window.location.href = '/'; // or use navigate("/")
    } catch (e) {
      console.error(e);
      toast.error('Google sign-in failed');
    }
  };

  React.useEffect(() => {
    if (!window.google || !GOOGLE_CLIENT_ID) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredential,
      auto_select: false,
      ux_mode: 'popup',
    });

    if (buttonRef.current) {
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'pill',
        text: 'signin_with',
        logo_alignment: 'left',
      });
    }
  }, []);

  return (
    <div className="mt-6">
      <div ref={buttonRef} />
    </div>
  );
}
