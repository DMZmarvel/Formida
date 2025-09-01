import React from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
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

export default function PayNotice() {
  const { refId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = React.useState(true);
  const [paying, setPaying] = React.useState(false);
  const [notice, setNotice] = React.useState<Notice | null>(null);

  const load = React.useCallback(async () => {
    if (!refId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/notices/status/${encodeURIComponent(refId)}`
      );
      setNotice(res.data);
    } catch (err: any) {
      addToast(
        'error',
        err?.response?.data?.message || 'Could not load notice.'
      );
    } finally {
      setLoading(false);
    }
  }, [refId, addToast]);

  React.useEffect(() => {
    load();
  }, [load]);

  const mockPay = async () => {
    if (!refId) return;
    setPaying(true);
    try {
      // Option A: simpler (uses your mark-paid route)
      const res = await axios.patch(
        `${API_BASE}/notices/mark-paid/${encodeURIComponent(refId)}`
      );
      setNotice(res.data?.notice ?? notice);
      addToast(
        'success',
        'Payment confirmed. Your notice is now marked as paid.'
      );
      // navigate to preview or publications
    } catch (err: any) {
      addToast(
        'error',
        err?.response?.data?.message || 'Payment confirmation failed.'
      );
    } finally {
      setPaying(false);
    }
  };

  const gatewaySuccess = async () => {
    if (!refId) return;
    setPaying(true);
    try {
      // Option B: emulate real verification endpoint
      await axios.post(`${API_BASE}/notices/payment-success`, {
        referenceId: refId,
        transactionRef: `TEST-${Date.now()}`,
      });
      addToast('success', 'Payment verified.');
      await load();
    } catch (err: any) {
      addToast('error', err?.response?.data?.error || 'Verification failed.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border bg-white shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Pay for Your Notice
        </h1>
        <p className="mt-1 text-gray-600">
          Secure payment to schedule your publication.
        </p>

        {loading ? (
          <div className="mt-6 text-sm text-gray-600">Loading notice…</div>
        ) : !notice ? (
          <div className="mt-6 text-sm text-rose-600">Notice not found.</div>
        ) : (
          <>
            <div className="mt-6 rounded-xl border border-gray-200 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Reference:
                </span>
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-sm text-gray-800">
                  {notice.referenceId}
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

              <div className="mt-4 grid gap-2 text-sm text-gray-700">
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
                <div>
                  <span className="font-medium">Amount:</span> ₦
                  {Number(notice.price ?? 0).toLocaleString()}
                </div>
              </div>

              {notice.content && (
                <div className="mt-4 rounded-lg border bg-gray-50 p-3 text-gray-800 whitespace-pre-wrap">
                  {notice.content}
                </div>
              )}
            </div>

            {notice.paid ? (
              <div className="mt-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800">
                Payment confirmed. We’ll schedule publication.{' '}
                {notice.publishAt && (
                  <span className="font-medium">
                    Estimated publish date:{' '}
                    {new Date(notice.publishAt).toDateString()}
                  </span>
                )}
                <div className="mt-3 flex gap-3">
                  <Link
                    to={`/notice/preview/${notice.referenceId}`}
                    className="rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-emerald-700 hover:bg-emerald-50"
                  >
                    View Preview
                  </Link>
                  <Link
                    to="/publications"
                    className="rounded-xl bg-emerald-600 px-4 py-2.5 text-white hover:bg-emerald-700"
                  >
                    Go to Publications
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Replace this block with your real gateway button(s) */}
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={mockPay}
                    disabled={paying}
                    className="rounded-xl bg-emerald-600 px-4 py-2.5 text-white text-sm hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {paying ? 'Confirming…' : 'Confirm Payment (Mock)'}
                  </button>
                  <button
                    onClick={gatewaySuccess}
                    disabled={paying}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50 disabled:opacity-60"
                  >
                    Simulate Gateway Verify
                  </button>
                </div>

                <p className="mt-3 text-xs text-gray-500">
                  In production, replace the mock with Paystack/Flutterwave
                  checkout and call your verification endpoint on success.
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
