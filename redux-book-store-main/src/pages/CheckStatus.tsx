import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/Toast';

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

const badge = (status: Notice['status']) =>
  status === 'approved'
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : status === 'rejected'
    ? 'bg-rose-50 text-rose-700 border-rose-200'
    : 'bg-amber-50 text-amber-700 border-amber-200';

export default function CheckStatus() {
  const { addToast } = useToast();
  const [ref, setRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const onCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    if (!ref.trim()) {
      addToast('error', 'Enter your reference ID.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/notices/status/${encodeURIComponent(ref.trim())}`
      );
      setNotice(res.data);
      addToast('success', 'Status loaded.');
    } catch (err: any) {
      addToast('error', err?.response?.data?.message || 'No record found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border bg-white shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Check Publication Status
        </h1>
        <p className="mt-1 text-gray-600">
          Enter your reference ID to view the current status.
        </p>

        <form
          onSubmit={onCheck}
          className="mt-5 flex flex-col gap-3 sm:flex-row"
        >
          <input
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="e.g., REF-2A9X8K"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Checking…' : 'Check Status'}
          </button>
        </form>

        {notice && (
          <div className="mt-6 rounded-xl border border-gray-200 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Reference:
              </span>
              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-sm text-gray-800">
                {notice.referenceId}
              </span>
              <span
                className={`rounded-md border px-2 py-0.5 text-sm ${badge(
                  notice.status
                )}`}
              >
                {notice.status.toUpperCase()}
              </span>
              <span
                className={`rounded-md border px-2 py-0.5 text-sm ${
                  notice.paid
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {notice.paid ? 'PAID' : 'UNPAID'}
              </span>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-gray-700">
              <div>
                <span className="font-medium">Type:</span>{' '}
                {notice.type?.replace('-', ' ')}
              </div>
              {notice.newspaper && (
                <div>
                  <span className="font-medium">Newspaper:</span>{' '}
                  {notice.newspaper}
                </div>
              )}
              {notice.price != null && (
                <div>
                  <span className="font-medium">Price:</span> ₦
                  {Number(notice.price).toLocaleString()}
                </div>
              )}
              {notice.publishAt && (
                <div>
                  <span className="font-medium">Publish Date:</span>{' '}
                  {new Date(notice.publishAt).toDateString()}
                </div>
              )}
              {notice.content && (
                <div className="rounded-lg border bg-gray-50 p-3 text-gray-800 whitespace-pre-wrap">
                  {notice.content}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to={`/notice/preview/${notice.referenceId}`}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-gray-800 hover:bg-gray-50"
              >
                Preview Notice
              </Link>
              {!notice.paid && (
                <Link
                  to={`/pay/${notice.referenceId}`}
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-white hover:bg-emerald-700"
                >
                  Proceed to Payment
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
