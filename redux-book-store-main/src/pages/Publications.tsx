import React from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/Toast';
import {
  FiSearch,
  FiFilter,
  FiFileText,
  FiCalendar,
  FiDollarSign,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

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

const TYPE_COLORS: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  'change-of-name': {
    bg: 'rgba(244,153,26,.1)',
    color: '#c47d10',
    border: 'rgba(244,153,26,.25)',
  },
  'lost-document': {
    bg: 'rgba(80,75,56,.08)',
    color: '#504B38',
    border: 'rgba(80,75,56,.2)',
  },
  'court-affidavit': {
    bg: 'rgba(46,125,95,.08)',
    color: '#2e7d5f',
    border: 'rgba(46,125,95,.2)',
  },
};
const getTypeStyle = (type: string) =>
  TYPE_COLORS[type] ?? { bg: '#EBE5C2', color: '#504B38', border: '#B9B28A' };

const css = `
  .pub-page { background: #F8F3D9; min-height: 100vh; padding: 40px 0 80px; }
  .pub-container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
  .pub-header {
    background: #fff; border: 1.5px solid #EBE5C2; border-radius: 20px;
    padding: 28px 32px; margin-bottom: 24px;
    box-shadow: 0 2px 14px rgba(80,75,56,.06); position: relative; overflow: hidden;
  }
  .pub-header-accent {
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, transparent, #F4991A, transparent);
  }
  .pub-filters-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
  .pub-select {
    border: 1.5px solid #EBE5C2; border-radius: 9px;
    background: #F8F3D9; padding: 8px 12px;
    font-size: 13px; color: #504B38; outline: none;
    transition: border-color .15s; font-family: inherit; cursor: pointer;
  }
  .pub-select:focus { border-color: #F4991A; }
  .pub-search-row { display: flex; gap: 10px; margin-top: 16px; }
  .pub-input {
    flex: 1; border: 1.5px solid #EBE5C2; border-radius: 10px;
    background: #F8F3D9; padding: 11px 16px; font-size: 13.5px;
    color: #504B38; outline: none; transition: all .15s; font-family: inherit;
  }
  .pub-input::placeholder { color: #B9B28A; }
  .pub-input:focus { border-color: #F4991A; background: #fff; box-shadow: 0 0 0 3px rgba(244,153,26,.1); }
  .pub-btn {
    display: inline-flex; align-items: center; gap: 7px;
    background: #F4991A; color: #fff; font-weight: 700; font-size: 13px;
    padding: 11px 22px; border-radius: 10px; border: none; cursor: pointer; transition: all .2s;
  }
  .pub-btn:hover { background: #e08810; }
  .pub-list { display: flex; flex-direction: column; gap: 14px; margin-top: 24px; }
  .pub-card {
    background: #fff; border: 1.5px solid #EBE5C2; border-radius: 16px;
    padding: 22px 24px; transition: all .2s;
    position: relative; overflow: hidden;
  }
  .pub-card:hover { border-color: rgba(244,153,26,.4); box-shadow: 0 4px 20px rgba(80,75,56,.08); }
  .pub-card-left-accent {
    position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
    background: #F4991A; border-radius: 3px 0 0 3px;
  }
  .pub-type-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 11px; border-radius: 999px;
    font-size: 11px; font-weight: 700; border: 1.5px solid;
    text-transform: capitalize;
  }
  .pub-ref-chip {
    background: #EBE5C2; color: #504B38; font-size: 12px; font-weight: 600;
    padding: 3px 10px; border-radius: 6px; font-family: monospace;
  }
  .pub-content { color: #504B38; font-size: 13.5px; line-height: 1.75; margin-top: 12px; }
  .pub-meta { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 14px; padding-top: 12px; border-top: 1px solid #F8F3D9; }
  .pub-meta-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #B9B28A; }
  .pub-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 28px; flex-wrap: wrap; gap: 12px; }
  .pub-page-btn {
    display: inline-flex; align-items: center; gap: 5px;
    border: 1.5px solid #EBE5C2; border-radius: 9px;
    background: #fff; color: #504B38; font-size: 13px; font-weight: 600;
    padding: 8px 16px; cursor: pointer; transition: all .15s;
  }
  .pub-page-btn:hover:not(:disabled) { border-color: #F4991A; color: #F4991A; }
  .pub-page-btn:disabled { opacity: .4; cursor: not-allowed; }
  .pub-empty {
    text-align: center; padding: 56px 24px;
    border: 1.5px dashed #B9B28A; border-radius: 16px; margin-top: 24px;
  }
  .pub-loading { display: flex; align-items: center; justify-content: center; padding: 56px; gap: 10px; color: #B9B28A; }
`;

export default function Publications() {
  const { addToast } = useToast();
  const [search, setSearch] = React.useState('');
  const [debounced, setDebounced] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
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
    } catch {
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
    <>
      <style>{css}</style>
      <div className="pub-page">
        <div className="pub-container">
          {/* Header */}
          <div className="pub-header">
            <div className="pub-header-accent" />
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      background: '#F4991A',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FiFileText size={19} color="#fff" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h1
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 'clamp(1.3rem,3vw,1.8rem)',
                        fontWeight: 900,
                        color: '#504B38',
                      }}
                    >
                      Public Notices
                    </h1>
                    <p style={{ color: '#B9B28A', fontSize: 13, marginTop: 2 }}>
                      Search by name, reference ID, or type. Use filters to
                      change scope and sorting.
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    background: 'rgba(244,153,26,.08)',
                    border: '1px solid rgba(244,153,26,.2)',
                    borderRadius: 999,
                    padding: '4px 12px',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#F4991A',
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#F4991A',
                      display: 'inline-block',
                    }}
                  />
                  {total} notices
                </span>
              </div>
            </div>

            {/* Filters */}
            <div className="pub-filters-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FiFilter size={13} color="#B9B28A" />
                <span
                  style={{ fontSize: 12, color: '#B9B28A', fontWeight: 600 }}
                >
                  Filters:
                </span>
              </div>
              <select
                className="pub-select"
                value={scope}
                onChange={(e) => {
                  setPage(1);
                  setScope(e.target.value as any);
                }}
              >
                <option value="confirmed">All Confirmed (past + future)</option>
                <option value="published">Published Only (up to today)</option>
              </select>
              <select
                className="pub-select"
                value={sortBy}
                onChange={(e) => {
                  setPage(1);
                  setSortBy(e.target.value as any);
                }}
              >
                <option value="publishAt">Sort: Publish Date</option>
                <option value="createdAt">Sort: Created Date</option>
                <option value="price">Sort: Price</option>
              </select>
              <select
                className="pub-select"
                value={order}
                onChange={(e) => {
                  setPage(1);
                  setOrder(e.target.value as any);
                }}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
              <select
                className="pub-select"
                value={limit}
                onChange={(e) => {
                  setPage(1);
                  setLimit(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 50].map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="pub-search-row">
              <input
                className="pub-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, reference ID, or notice type…"
              />
              <button
                className="pub-btn"
                onClick={() => {
                  setPage(1);
                  setDebounced(search.trim());
                }}
              >
                <FiSearch size={14} /> Search
              </button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="pub-loading">
              <div
                style={{
                  width: 20,
                  height: 20,
                  border: '2.5px solid #EBE5C2',
                  borderTopColor: '#F4991A',
                  borderRadius: '50%',
                  animation: 'spin .7s linear infinite',
                }}
              />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              <span style={{ fontSize: 13 }}>Loading notices…</span>
            </div>
          ) : items.length === 0 ? (
            <div className="pub-empty">
              <div style={{ fontSize: 36, marginBottom: 14 }}>📋</div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  color: '#504B38',
                  fontSize: 16,
                  marginBottom: 8,
                }}
              >
                No notices found
              </div>
              <p style={{ color: '#B9B28A', fontSize: 13 }}>
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="pub-list">
              {items.map((n) => {
                const ts = getTypeStyle(n.type);
                return (
                  <article key={n._id} className="pub-card">
                    <div className="pub-card-left-accent" />
                    <div style={{ paddingLeft: 12 }}>
                      {/* Top row */}
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 10,
                        }}
                      >
                        <span className="pub-ref-chip">{n.referenceId}</span>
                        <span
                          className="pub-type-badge"
                          style={{
                            background: ts.bg,
                            color: ts.color,
                            borderColor: ts.border,
                          }}
                        >
                          {n.type?.replace(/-/g, ' ')}
                        </span>
                        {n.newspaper && (
                          <span
                            style={{
                              fontSize: 12,
                              color: '#B9B28A',
                              fontWeight: 500,
                            }}
                          >
                            📰 {n.newspaper}
                          </span>
                        )}
                      </div>
                      {/* Content */}
                      <p className="pub-content">{n.content}</p>
                      {/* Meta */}
                      <div className="pub-meta">
                        {n.publishAt && (
                          <span className="pub-meta-item">
                            <FiCalendar size={12} color="#F4991A" />
                            {new Date(n.publishAt).toDateString()}
                          </span>
                        )}
                        {n.price != null && (
                          <span className="pub-meta-item">
                            <FiDollarSign size={12} color="#F4991A" />₦
                            {Number(n.price).toLocaleString()}
                          </span>
                        )}
                        {n.createdAt && (
                          <span className="pub-meta-item">
                            Submitted: {new Date(n.createdAt).toDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && items.length > 0 && (
            <div className="pub-pagination">
              <span style={{ fontSize: 13, color: '#B9B28A' }}>
                Page <strong style={{ color: '#504B38' }}>{page}</strong> of{' '}
                <strong style={{ color: '#504B38' }}>{totalPages}</strong> ·{' '}
                {total} total notices
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="pub-page-btn"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <FiChevronLeft size={14} /> Prev
                </button>
                <button
                  className="pub-page-btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next <FiChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
