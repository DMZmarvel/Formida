// src/pages/Publications.tsx
import React from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/Toast';

type PubNotice = {
  _id: string;
  referenceId: string;
  type: string;
  content: string;
  publishAt?: string;
  newspaper?: string;
  price?: number;
  createdAt?: string;
};

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ||
  'http://localhost:4040/api';

export default function Publications() {
  const { addToast } = useToast();

  const [search, setSearch] = React.useState('');
  const [debounced, setDebounced] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  // NEW: scope + sorting
  const [scope, setScope] = React.useState<'published' | 'confirmed'>(
    'confirmed'
  );
  const [sortBy, setSortBy] = React.useState<
    'publishAt' | 'createdAt' | 'price'
  >('publishAt');
  const [order, setOrder] = React.useState<'desc' | 'asc'>('desc');

  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<PubNotice[]>([]);
  const [total, setTotal] = React.useState(0);

  // Debounce search input
  React.useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setDebounced(search.trim());
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchNotices = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/notices/published`, {
        params: { search: debounced, page, limit, scope, sortBy, order },
      });

      const payload = res.data;
      let list: PubNotice[] = [];
      let count = 0;

      if (Array.isArray(payload)) {
        list = payload;
        count = payload.length;
      } else if (payload && Array.isArray(payload.data)) {
        list = payload.data;
        count =
          typeof payload.total === 'number'
            ? payload.total
            : payload.data.length;
      }

      setItems(list);
      setTotal(count);
    } catch (err) {
      addToast('error', 'Failed to load publications.');
    } finally {
      setLoading(false);
    }
  }, [debounced, page, limit, scope, sortBy, order, addToast]);

  React.useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-2xl border bg-white shadow-sm p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Public Notices</h1>
            <p className="mt-1 text-gray-600">
              Search by name, reference ID, or type. Use filters to change scope
              and sorting.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={scope}
              onChange={(e) => {
                setPage(1);
                setScope(e.target.value as any);
              }}
              className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
              title="Scope"
            >
              <option value="confirmed">All Confirmed (past + future)</option>
              <option value="published">Published Only (up to today)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => {
                setPage(1);
                setSortBy(e.target.value as any);
              }}
              className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
              title="Sort by"
            >
              <option value="publishAt">Publish Date</option>
              <option value="createdAt">Created Date</option>
              <option value="price">Price</option>
            </select>

            <select
              value={order}
              onChange={(e) => {
                setPage(1);
                setOrder(e.target.value as any);
              }}
              className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
              title="Order"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>

            <select
              value={limit}
              onChange={(e) => {
                setPage(1);
                setLimit(Number(e.target.value));
              }}
              className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
              title="Items per page"
            >
              {[10, 20, 30, 50].map((n) => (
                <option key={n} value={n}>
                  {n}/page
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g., change-of-name, REF-ABC123, Mariam…"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <button
            onClick={() => {
              setPage(1);
              setDebounced(search.trim());
            }}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-white text-sm hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {loading ? (
          <div className="mt-6 text-sm text-gray-600">Loading…</div>
        ) : items.length === 0 ? (
          <div className="mt-6 text-sm text-gray-600">No notices found.</div>
        ) : (
          <div className="mt-6 grid gap-4">
            {items.map((n) => (
              <article
                key={n._id}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Ref:
                  </span>
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-sm text-gray-800">
                    {n.referenceId}
                  </span>
                  <span className="rounded border px-2 py-0.5 text-xs text-gray-700">
                    {n.type?.replace('-', ' ')}
                  </span>
                  {n.newspaper && (
                    <span className="rounded border px-2 py-0.5 text-xs text-gray-700">
                      {n.newspaper}
                    </span>
                  )}
                </div>

                <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                  {n.content}
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {scope === 'published' ? 'Published:' : 'Publish date:'}{' '}
                    {n.publishAt ? new Date(n.publishAt).toDateString() : '—'}
                  </span>
                  {n.price != null && (
                    <span>₦{Number(n.price).toLocaleString()}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Page {page} of {Math.max(1, Math.ceil(total / limit))} • {total}{' '}
            total
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-800 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={page >= Math.max(1, Math.ceil(total / limit))}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
