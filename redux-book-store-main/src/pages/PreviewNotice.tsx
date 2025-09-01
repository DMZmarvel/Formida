import React from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/components/ui/Toast';

type PreviewModel = {
  referenceId: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  paid: boolean;
  publishAt?: string;
  content?: string;
  newspaper?: string;
  price?: number;
  user?: { name: string; email: string };
};

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ||
  'http://localhost:4040/api';

export default function PreviewNotice() {
  const { ref } = useParams();
  const { addToast } = useToast();

  const [loading, setLoading] = React.useState(true);
  const [paying, setPaying] = React.useState(false);
  const [notice, setNotice] = React.useState<PreviewModel | null>(null);

  const load = React.useCallback(async () => {
    if (!ref) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/notices/preview/${encodeURIComponent(ref)}`
      );
      setNotice(res.data);
    } catch (err: any) {
      addToast('error', 'Failed to load notice preview.');
    } finally {
      setLoading(false);
    }
  }, [ref, addToast]);

  React.useEffect(() => {
    load();
  }, [load]);

  const mockPay = async () => {
    if (!ref) return;
    setPaying(true);
    try {
      const res = await axios.patch(
        `${API_BASE}/notices/mark-paid/${encodeURIComponent(ref)}`
      );
      setNotice(res.data?.notice ?? notice);
      addToast('success', 'Marked as paid.');
    } catch (err: any) {
      addToast('error', 'Payment action failed.');
    } finally {
      setPaying(false);
    }
  };

  const gatewayVerify = async () => {
    if (!ref) return;
    setPaying(true);
    try {
      await axios.post(`${API_BASE}/notices/payment-success`, {
        referenceId: ref,
        transactionRef: `TEST-${Date.now()}`,
      });
      addToast('success', 'Payment verified.');
      await load();
    } catch (err: any) {
      addToast('error', 'Verification failed.');
    } finally {
      setPaying(false);
    }
  };

  if (loading)
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-sm text-gray-600">
        Loading preview…
      </div>
    );
  if (!notice)
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-sm text-gray-600">
        Notice not found.
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border bg-white shadow-sm p-6 print:shadow-none print:border-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Notice Preview</h1>
          <span className="rounded bg-gray-100 px-2 py-0.5 text-sm text-gray-800">
            Ref: {notice.referenceId}
          </span>
          <span
            className={`rounded border px-2 py-0.5 text-xs ${
              notice.status === 'approved'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : notice.status === 'rejected'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {notice.status.toUpperCase()}
          </span>
          <span
            className={`rounded border px-2 py-0.5 text-xs ${
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
              <span className="font-medium">Newspaper:</span> {notice.newspaper}
            </div>
          )}
          {notice.price != null && (
            <div>
              <span className="font-medium">Amount:</span> ₦
              {Number(notice.price).toLocaleString()}
            </div>
          )}
          {notice.publishAt && (
            <div>
              <span className="font-medium">Estimated Publish:</span>{' '}
              {new Date(notice.publishAt).toDateString()}
            </div>
          )}
        </div>

        <hr className="my-4" />

        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {notice.content}
        </div>

        <hr className="my-4" />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => window.print()}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50"
          >
            Print
          </button>

          {!notice.paid ? (
            <>
              <button
                onClick={mockPay}
                disabled={paying}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {paying ? 'Confirming…' : 'Confirm Payment (Mock)'}
              </button>
              <button
                onClick={gatewayVerify}
                disabled={paying}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50 disabled:opacity-60"
              >
                Simulate Gateway Verify
              </button>
            </>
          ) : (
            <Link
              to="/publications"
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm text-white hover:bg-blue-700"
            >
              Go to Publications
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
