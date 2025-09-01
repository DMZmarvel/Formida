import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/Toast';

type TabKey = 'Change of Name' | 'Lost Document' | 'Court Affidavit';
type Step = 1 | 2 | 3;

const TABS: TabKey[] = ['Change of Name', 'Lost Document', 'Court Affidavit'];
const TYPE_SLUG: Record<TabKey, string> = {
  'Change of Name': 'change-of-name',
  'Lost Document': 'lost-document',
  'Court Affidavit': 'court-affidavit',
};
const DEFAULT_PRICES: Record<string, number> = {
  'change-of-name': 15000,
  'lost-document': 12000,
  'court-affidavit': 10000,
};
const NEWSPAPERS = [
  'The Guardian',
  'Punch',
  'Vanguard',
  'ThisDay',
  'The Nation',
];
const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ||
  'http://localhost:4040/api';

// styling helpers
const containerClass = 'mx-auto max-w-6xl px-4 py-8 md:py-10';
const cardClass = 'rounded-2xl border border-gray-200 bg-white shadow-sm';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition';
const helpText = 'text-xs text-gray-500';

type Errors = Record<string, string>;

export default function SubmitNotice() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [step, setStep] = useState<Step>(1);
  const [activeTab, setActiveTab] = useState<TabKey>('Change of Name');

  const [changeOfName, setChangeOfName] = useState({
    oldName: '',
    newName: '',
    newspaper: '',
  });
  const [lostDoc, setLostDoc] = useState({ docType: '', description: '' });
  const [affidavit, setAffidavit] = useState({ fullName: '', purpose: '' });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Errors>({});

  const [price, setPrice] = useState<number>(
    DEFAULT_PRICES[TYPE_SLUG['Change of Name']]
  );
  const [submitting, setSubmitting] = useState(false);
  const [refId, setRefId] = useState<string>('');

  React.useEffect(() => {
    setPrice(DEFAULT_PRICES[TYPE_SLUG[activeTab]]);
    setErrors({});
    setTouched({});
  }, [activeTab]);

  const onChange =
    (setter: React.Dispatch<React.SetStateAction<any>>) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setter((prev: any) => ({ ...prev, [name]: value }));
    };

  // --- validation ---
  const validate = (): Errors => {
    const type = TYPE_SLUG[activeTab];
    const e: Errors = {};
    if (type === 'change-of-name') {
      if (!changeOfName.oldName.trim()) e.oldName = 'Old name is required.';
      if (!changeOfName.newName.trim()) e.newName = 'New name is required.';
      if (!changeOfName.newspaper.trim()) e.newspaper = 'Select a newspaper.';
    } else if (type === 'lost-document') {
      if (!lostDoc.docType.trim()) e.docType = 'Document type is required.';
      if (!lostDoc.description.trim() || lostDoc.description.trim().length < 20)
        e.description = 'Provide at least 20 characters describing the loss.';
    } else {
      if (!affidavit.fullName.trim()) e.fullName = 'Full name is required.';
      if (!affidavit.purpose.trim() || affidavit.purpose.trim().length < 10)
        e.purpose = 'Purpose must be at least 10 characters.';
    }
    if (price < 0) e.price = 'Price cannot be negative.';
    return e;
  };

  const markAllTouched = () => {
    const type = TYPE_SLUG[activeTab];
    if (type === 'change-of-name') {
      setTouched({
        oldName: true,
        newName: true,
        newspaper: true,
        price: true,
      });
    } else if (type === 'lost-document') {
      setTouched({ docType: true, description: true, price: true });
    } else {
      setTouched({ fullName: true, purpose: true, price: true });
    }
  };

  const nextStep = () => {
    const e = validate();
    setErrors(e);
    if (step === 1) {
      // only require type selection (already selected)
      setStep(2);
    } else if (step === 2) {
      // ensure fields OK
      const hasErrors = Object.keys(e).length > 0;
      if (hasErrors) {
        markAllTouched();
        addToast('error', 'Please fix the form errors.');
        return;
      }
      setStep(3);
    }
  };

  const prevStep = () => setStep((s) => (s === 1 ? 1 : ((s - 1) as Step)));

  const previewHtml = useMemo(() => {
    if (activeTab === 'Change of Name') {
      const { oldName, newName } = changeOfName;
      if (!oldName || !newName)
        return 'Your change‑of‑name text will appear here…';
      return `I, formerly known and addressed as <strong>${escapeHtml(
        oldName
      )}</strong>, now wish to be known and addressed as <strong>${escapeHtml(
        newName
      )}</strong>. All former documents remain valid.`;
    }
    if (activeTab === 'Lost Document') {
      const { docType, description } = lostDoc;
      if (!docType || !description)
        return 'Describe the lost document to preview…';
      return `I hereby notify the general public of the loss of my <strong>${escapeHtml(
        docType
      )}</strong>. ${escapeHtml(description)}`;
    }
    const { fullName, purpose } = affidavit;
    if (!fullName || !purpose)
      return 'State your full name and purpose to preview…';
    return `I, <strong>${escapeHtml(
      fullName
    )}</strong>, do solemnly affirm the purpose of this affidavit is to <strong>${escapeHtml(
      purpose
    )}</strong>.`;
  }, [activeTab, changeOfName, lostDoc, affidavit]);

  const charCount = useMemo(() => stripHtml(previewHtml).length, [previewHtml]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length > 0) {
      markAllTouched();
      addToast('error', 'Please fix the form errors.');
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('token');
    if (!token) {
      addToast('error', 'Please login first to submit a notice.');
      setSubmitting(false);
      return;
    }

    const type = TYPE_SLUG[activeTab];
    let payload: Record<string, any> = { type, price };

    if (type === 'change-of-name') {
      const { oldName, newName, newspaper } = changeOfName;
      payload = {
        ...payload,
        oldName,
        newName,
        newspaper,
        content: stripHtml(previewHtml),
      };
    } else if (type === 'lost-document') {
      const { docType, description } = lostDoc;
      payload = { ...payload, docType, content: stripHtml(previewHtml) };
    } else {
      const { fullName, purpose } = affidavit;
      payload = { ...payload, fullName, content: stripHtml(previewHtml) };
    }

    try {
      const res = await axios.post(`${API_BASE}/notices/submit`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ref = res.data?.referenceId as string;
      setRefId(ref);
      addToast('success', `Notice submitted. Reference: ${ref}`);
      setStep(3);
    } catch (err: any) {
      addToast('error', err?.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="mb-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-[1px]">
          <div className="rounded-2xl bg-white/90 p-6 md:p-7 backdrop-blur">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Submit a Public Notice
                </h1>
                <p className="mt-1 text-gray-600">
                  Create a legally publishable announcement and track its
                  status.
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700 border border-emerald-100">
                Secure • Fast • Verified
              </span>
            </div>

            {/* Stepper */}
            <ol className="mt-6 grid grid-cols-3 gap-2 text-sm">
              {[
                { id: 1, label: 'Select Type' },
                { id: 2, label: 'Fill Details' },
                { id: 3, label: 'Review & Submit' },
              ].map((s) => {
                const active = step === (s.id as Step);
                const done = step > (s.id as Step);
                return (
                  <li key={s.id} className="flex items-center gap-2">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-white text-xs ${
                        done
                          ? 'bg-emerald-600'
                          : active
                          ? 'bg-blue-600'
                          : 'bg-gray-300'
                      }`}
                    >
                      {done ? '✓' : s.id}
                    </span>
                    <span
                      className={`${
                        done
                          ? 'text-emerald-700'
                          : active
                          ? 'text-blue-700'
                          : 'text-gray-600'
                      }`}
                    >
                      {s.label}
                    </span>
                    {s.id < 3 && (
                      <span className="ml-2 h-px flex-1 bg-gray-200" />
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      {/* Grid */}
      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
        {/* Left: step content */}
        <div className={`${cardClass} p-5 md:p-6`}>
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Choose the notice type you want to publish.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TABS.map((tab) => {
                  const active = tab === activeTab;
                  return (
                    <button
                      type="button"
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-xl border px-3 py-3 text-sm text-left transition ${
                        active
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{tab}</div>
                      <div className="mt-1 text-xs text-gray-600">
                        {tab === 'Change of Name' &&
                          'Update your official identity across records'}
                        {tab === 'Lost Document' &&
                          'Announce a lost card/certificate to the public'}
                        {tab === 'Court Affidavit' &&
                          'Affirm a statement for official processes'}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Base price: ₦
                  {DEFAULT_PRICES[TYPE_SLUG[activeTab]].toLocaleString()}
                </div>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-white text-sm hover:bg-blue-700"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {TYPE_SLUG[activeTab] === 'change-of-name' && (
                <>
                  <div>
                    <label className={labelClass}>Old/Former Name</label>
                    <input
                      className={inputClass}
                      name="oldName"
                      value={changeOfName.oldName}
                      onBlur={() =>
                        setTouched((t) => ({ ...t, oldName: true }))
                      }
                      onChange={onChange(setChangeOfName)}
                      placeholder="e.g., Chukwuemeka John Okeke"
                    />
                    {touched.oldName && errors.oldName && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.oldName}
                      </p>
                    )}
                    <p className={helpText}>
                      Enter your current/previously used full name.
                    </p>
                  </div>
                  <div>
                    <label className={labelClass}>New/Desired Name</label>
                    <input
                      className={inputClass}
                      name="newName"
                      value={changeOfName.newName}
                      onBlur={() =>
                        setTouched((t) => ({ ...t, newName: true }))
                      }
                      onChange={onChange(setChangeOfName)}
                      placeholder="e.g., Chukwuemeka John Nwosu"
                    />
                    {touched.newName && errors.newName && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.newName}
                      </p>
                    )}
                    <p className={helpText}>
                      Ensure spelling matches your supporting documents.
                    </p>
                  </div>
                  <div>
                    <label className={labelClass}>Preferred Newspaper</label>
                    <select
                      className={inputClass}
                      name="newspaper"
                      value={changeOfName.newspaper}
                      onBlur={() =>
                        setTouched((t) => ({ ...t, newspaper: true }))
                      }
                      onChange={onChange(setChangeOfName)}
                    >
                      <option value="">Select Newspaper</option>
                      {NEWSPAPERS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    {touched.newspaper && errors.newspaper && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.newspaper}
                      </p>
                    )}
                  </div>
                </>
              )}

              {TYPE_SLUG[activeTab] === 'lost-document' && (
                <>
                  <div>
                    <label className={labelClass}>Document Type</label>
                    <input
                      className={inputClass}
                      name="docType"
                      value={lostDoc.docType}
                      onBlur={() =>
                        setTouched((t) => ({ ...t, docType: true }))
                      }
                      onChange={onChange(setLostDoc)}
                      placeholder="e.g., National ID, Voter’s Card, Birth Certificate"
                    />
                    {touched.docType && errors.docType && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.docType}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Brief Description</label>
                    <textarea
                      className={inputClass}
                      name="description"
                      rows={3}
                      value={lostDoc.description}
                      onBlur={() =>
                        setTouched((t) => ({ ...t, description: true }))
                      }
                      onChange={onChange(setLostDoc)}
                      placeholder="Where/when it was lost, and any other detail useful to the public."
                    />
                    {touched.description && errors.description && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.description}
                      </p>
                    )}
                    <p className={helpText}>
                      Avoid sensitive numbers if not necessary.
                    </p>
                  </div>
                </>
              )}

              {TYPE_SLUG[activeTab] === 'court-affidavit' && (
                <>
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      className={inputClass}
                      name="fullName"
                      value={affidavit.fullName}
                      onBlur={() =>
                        setTouched((t) => ({ ...t, fullName: true }))
                      }
                      onChange={onChange(setAffidavit)}
                      placeholder="e.g., Mariam A. Balogun"
                    />
                    {touched.fullName && errors.fullName && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.fullName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Purpose of Affidavit</label>
                    <textarea
                      className={inputClass}
                      name="purpose"
                      rows={3}
                      value={affidavit.purpose}
                      onBlur={() =>
                        setTouched((t) => ({ ...t, purpose: true }))
                      }
                      onChange={onChange(setAffidavit)}
                      placeholder="State why you’re swearing the affidavit."
                    />
                    {touched.purpose && errors.purpose && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.purpose}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Price */}
              <div className="grid gap-2 rounded-xl bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Estimated Price
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className={`${inputClass} w-28 text-right`}
                      value={price}
                      onBlur={() => setTouched((t) => ({ ...t, price: true }))}
                      onChange={(e) => setPrice(Number(e.target.value || 0))}
                      min={0}
                    />
                    <span className="text-sm text-gray-500">NGN</span>
                  </div>
                </div>
                {touched.price && errors.price && (
                  <p className="text-xs text-rose-600">{errors.price}</p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm text-white hover:bg-blue-700"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="mb-2 text-sm text-gray-500">Preview</div>
                <div
                  className="prose prose-sm max-w-none text-gray-800"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>{charCount} characters</span>
                  <span>Auto‑formatted for publication</span>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Estimated Price
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    ₦{price.toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Final amount may vary with newspaper availability and
                  schedule.
                </p>
              </div>

              {!refId ? (
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {submitting ? 'Submitting…' : 'Submit Notice'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Link
                    to={`/notice/preview/${refId}`}
                    className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-center text-gray-800 hover:bg-gray-50"
                  >
                    Preview Notice
                  </Link>
                  <Link
                    to={`/pay/${refId}`}
                    className="rounded-xl bg-emerald-600 px-4 py-2.5 text-center text-white font-medium hover:bg-emerald-700"
                  >
                    Proceed to Payment
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Tips / help box */}
        <aside className={`${cardClass} p-5 md:p-6 md:sticky md:top-6 h-fit`}>
          <h2 className="text-lg font-semibold text-gray-900">Guidelines</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>• Use full legal names as they appear on documents.</li>
            <li>
              • Keep descriptions factual; avoid sensitive IDs unless required.
            </li>
            <li>• You’ll receive a reference ID and email updates.</li>
            <li>
              • Publication typically occurs 3–7 business days after payment.
            </li>
          </ul>
        </aside>
      </form>
    </div>
  );
}

/* utils */
function escapeHtml(str: string) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
function stripHtml(html: string) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

// a public Publications page with search and pagination (consuming /api/notices/published?search=&page=&limit=), or
// Create a minimal AdminNotices table (filters, approve/reject inline) using the same styles.

// lets add them

// and also modify our Publication and
