import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/Toast';
import {
  FiCheck,
  FiFileText,
  FiAlertCircle,
  FiArrowRight,
  FiArrowLeft,
  FiInfo,
} from 'react-icons/fi';

type TabKey = 'Change of Name' | 'Lost Document' | 'Court Affidavit';
type Rule = { type: string; newspaper?: string; amount: number };
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

type Errors = Record<string, string>;

const TAB_ICONS: Record<TabKey, string> = {
  'Change of Name': '📝',
  'Lost Document': '🔍',
  'Court Affidavit': '⚖️',
};
const TAB_DESC: Record<TabKey, string> = {
  'Change of Name': 'Update your official identity across all records',
  'Lost Document': 'Announce a lost card or certificate to the public',
  'Court Affidavit': 'Affirm a statement for official legal processes',
};

const css = `
  .fmd-sn-page { background: #F8F3D9; min-height: 100vh; padding: 40px 0 80px; }
  .fmd-sn-container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
  .fmd-sn-header {
    background: #fff; border: 1.5px solid #EBE5C2;
    border-radius: 20px; padding: 32px 32px 28px;
    margin-bottom: 28px;
    box-shadow: 0 2px 16px rgba(80,75,56,.06);
  }
  .fmd-sn-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(244,153,26,.08); border: 1px solid rgba(244,153,26,.2);
    border-radius: 999px; padding: 4px 14px;
    font-size: 11px; font-weight: 700; letter-spacing: .12em;
    text-transform: uppercase; color: #F4991A;
  }
  .fmd-sn-step-bar { display: flex; align-items: center; gap: 0; margin-top: 28px; }
  .fmd-sn-step {
    display: flex; align-items: center; gap: 10px;
    flex: 1;
  }
  .fmd-sn-step-circle {
    width: 32px; height: 32px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 800;
    font-family: 'Syne', sans-serif;
    flex-shrink: 0; transition: all .2s;
  }
  .fmd-sn-step-circle.done { background: #F4991A; color: #fff; }
  .fmd-sn-step-circle.active { background: #504B38; color: #fff; }
  .fmd-sn-step-circle.idle { background: #EBE5C2; color: #B9B28A; }
  .fmd-sn-step-label { font-size: 13px; font-weight: 500; white-space: nowrap; }
  .fmd-sn-step-label.done { color: #F4991A; font-weight: 600; }
  .fmd-sn-step-label.active { color: #504B38; font-weight: 700; }
  .fmd-sn-step-label.idle { color: #B9B28A; }
  .fmd-sn-step-line { flex: 1; height: 1.5px; background: #EBE5C2; margin: 0 12px; }
  .fmd-sn-step-line.done { background: #F4991A; }
  .fmd-sn-card {
    background: #fff; border: 1.5px solid #EBE5C2; border-radius: 18px;
    padding: 28px; box-shadow: 0 2px 16px rgba(80,75,56,.05);
  }
  .fmd-sn-tab-card {
    border: 1.5px solid #EBE5C2; border-radius: 14px;
    padding: 18px; cursor: pointer; transition: all .2s;
    background: #F8F3D9; text-align: left;
  }
  .fmd-sn-tab-card:hover { border-color: #F4991A; background: #fff; }
  .fmd-sn-tab-card.active {
    border-color: #F4991A; background: #fff;
    box-shadow: 0 4px 16px rgba(244,153,26,.15);
  }
  .fmd-sn-label { display: block; font-size: 13px; font-weight: 600; color: #504B38; margin-bottom: 6px; }
  .fmd-sn-input {
    width: 100%; border: 1.5px solid #EBE5C2; border-radius: 10px;
    background: #F8F3D9; padding: 10px 14px;
    font-size: 13.5px; color: #504B38; outline: none;
    transition: border-color .15s, background .15s;
    font-family: inherit;
  }
  .fmd-sn-input::placeholder { color: #B9B28A; }
  .fmd-sn-input:focus { border-color: #F4991A; background: #fff; box-shadow: 0 0 0 3px rgba(244,153,26,.1); }
  .fmd-sn-input.error { border-color: #c0392b; }
  .fmd-sn-error { font-size: 12px; color: #c0392b; margin-top: 4px; display: flex; align-items: center; gap: 5px; }
  .fmd-sn-help { font-size: 12px; color: #B9B28A; margin-top: 5px; }
  .fmd-sn-price-box {
    background: #F8F3D9; border: 1.5px solid #EBE5C2;
    border-radius: 12px; padding: 18px 20px;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
  }
  .fmd-sn-btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    background: #F4991A; color: #fff; font-weight: 700; font-size: 13.5px;
    padding: 11px 24px; border-radius: 10px; border: none;
    cursor: pointer; transition: all .2s;
  }
  .fmd-sn-btn-primary:hover { background: #e08810; box-shadow: 0 4px 16px rgba(244,153,26,.35); }
  .fmd-sn-btn-primary:disabled { opacity: .6; cursor: not-allowed; }
  .fmd-sn-btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: #504B38; font-weight: 600; font-size: 13.5px;
    padding: 11px 20px; border-radius: 10px;
    border: 1.5px solid #B9B28A; cursor: pointer; transition: all .2s;
  }
  .fmd-sn-btn-ghost:hover { background: #EBE5C2; border-color: #504B38; }
  .fmd-sn-btn-success {
    display: inline-flex; align-items: center; gap: 8px;
    background: #2e7d5f; color: #fff; font-weight: 700; font-size: 13.5px;
    padding: 11px 24px; border-radius: 10px; text-decoration: none;
    transition: all .2s;
  }
  .fmd-sn-btn-success:hover { background: #235f49; }
  .fmd-sn-preview-box {
    background: #F8F3D9; border: 1.5px solid #EBE5C2;
    border-radius: 12px; padding: 20px;
  }
  .fmd-sn-aside {
    background: #fff; border: 1.5px solid #EBE5C2; border-radius: 18px;
    padding: 24px; box-shadow: 0 2px 16px rgba(80,75,56,.05);
    position: sticky; top: 24px;
  }
  .fmd-sn-guide-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid #EBE5C2; }
  .fmd-sn-guide-item:last-child { border-bottom: none; }
  .fmd-sn-guide-dot { width: 7px; height: 7px; border-radius: 50%; background: #F4991A; flex-shrink: 0; margin-top: 5px; }
  .fmd-sn-success-box {
    background: rgba(46,125,95,.06); border: 1.5px solid rgba(46,125,95,.2);
    border-radius: 14px; padding: 20px; text-align: center;
  }
`;

export default function SubmitNotice() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [rules, setRules] = React.useState<Rule[]>([]);
  const [price, setPrice] = useState<number>(0);
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
  const [submitting, setSubmitting] = useState(false);
  const [refId, setRefId] = useState<string>('');

  React.useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/pricing`);
        setRules(res.data?.data ?? []);
      } catch {
        setRules([]);
      }
    })();
  }, []);

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
    if (type === 'change-of-name')
      setTouched({
        oldName: true,
        newName: true,
        newspaper: true,
        price: true,
      });
    else if (type === 'lost-document')
      setTouched({ docType: true, description: true, price: true });
    else setTouched({ fullName: true, purpose: true, price: true });
  };

  const nextStep = () => {
    const e = validate();
    setErrors(e);
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      if (Object.keys(e).length > 0) {
        markAllTouched();
        addToast('error', 'Please fix the form errors.');
        return;
      }
      setStep(3);
    }
  };

  const computePrice = React.useCallback(
    (typeSlug: string, newspaper?: string) => {
      if (newspaper) {
        const hit = rules.find(
          (r) => r.type === typeSlug && (r.newspaper || '') === newspaper
        );
        if (hit) return hit.amount;
      }
      const typeOnly = rules.find((r) => r.type === typeSlug && !r.newspaper);
      if (typeOnly) return typeOnly.amount;
      return 0;
    },
    [rules]
  );

  React.useEffect(() => {
    const type = TYPE_SLUG[activeTab];
    if (type === 'change-of-name')
      setPrice(computePrice(type, changeOfName.newspaper || undefined));
    else setPrice(computePrice(type));
  }, [activeTab, changeOfName.newspaper, computePrice]);

  const prevStep = () => setStep((s) => (s === 1 ? 1 : ((s - 1) as Step)));

  const previewHtml = useMemo(() => {
    if (activeTab === 'Change of Name') {
      const { oldName, newName } = changeOfName;
      if (!oldName || !newName)
        return 'Your change‑of‑name text will appear here…';
      return `I, formerly known and addressed as <strong>${escapeHtml(oldName)}</strong>, now wish to be known and addressed as <strong>${escapeHtml(newName)}</strong>. All former documents remain valid.`;
    }
    if (activeTab === 'Lost Document') {
      const { docType, description } = lostDoc;
      if (!docType || !description)
        return 'Describe the lost document to preview…';
      return `I hereby notify the general public of the loss of my <strong>${escapeHtml(docType)}</strong>. ${escapeHtml(description)}`;
    }
    const { fullName, purpose } = affidavit;
    if (!fullName || !purpose)
      return 'State your full name and purpose to preview…';
    return `I, <strong>${escapeHtml(fullName)}</strong>, do solemnly affirm the purpose of this affidavit is to <strong>${escapeHtml(purpose)}</strong>.`;
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
      payload = {
        ...payload,
        docType: lostDoc.docType,
        content: stripHtml(previewHtml),
      };
    } else {
      payload = {
        ...payload,
        fullName: affidavit.fullName,
        content: stripHtml(previewHtml),
      };
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

  const stepStates = [1, 2, 3].map((n) =>
    step > n ? 'done' : step === n ? 'active' : 'idle'
  );

  return (
    <>
      <style>{css}</style>
      <div className="fmd-sn-page">
        <div className="fmd-sn-container">
          {/* Header */}
          <div className="fmd-sn-header">
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
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: '#F4991A',
                      borderRadius: 11,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FiFileText size={18} color="#fff" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h1
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 'clamp(1.4rem,3vw,1.9rem)',
                        fontWeight: 900,
                        color: '#504B38',
                        lineHeight: 1.1,
                      }}
                    >
                      Submit a Public Notice
                    </h1>
                    <p
                      style={{ color: '#B9B28A', fontSize: 13.5, marginTop: 3 }}
                    >
                      Create a legally publishable announcement and track its
                      status.
                    </p>
                  </div>
                </div>
              </div>
              <div className="fmd-sn-badge">✦ Secure · Fast · Verified</div>
            </div>

            {/* Step bar */}
            <div className="fmd-sn-step-bar">
              {[
                { id: 1, label: 'Select Type' },
                { id: 2, label: 'Fill Details' },
                { id: 3, label: 'Review & Submit' },
              ].map((s, i) => {
                const state = stepStates[i];
                return (
                  <React.Fragment key={s.id}>
                    <div className="fmd-sn-step">
                      <div className={`fmd-sn-step-circle ${state}`}>
                        {state === 'done' ? (
                          <FiCheck size={13} strokeWidth={3} />
                        ) : (
                          s.id
                        )}
                      </div>
                      <span className={`fmd-sn-step-label ${state}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div
                        className={`fmd-sn-step-line ${stepStates[i] === 'done' ? 'done' : ''}`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Grid */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 320px',
              gap: 24,
              alignItems: 'start',
            }}
          >
            {/* Left panel */}
            <div className="fmd-sn-card">
              {/* STEP 1 */}
              {step === 1 && (
                <div>
                  <p
                    style={{
                      color: '#B9B28A',
                      fontSize: 13.5,
                      marginBottom: 20,
                    }}
                  >
                    Choose the notice type you want to publish.
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3,1fr)',
                      gap: 12,
                      marginBottom: 24,
                    }}
                  >
                    {TABS.map((tab) => (
                      <button
                        type="button"
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`fmd-sn-tab-card ${activeTab === tab ? 'active' : ''}`}
                      >
                        <div style={{ fontSize: 24, marginBottom: 10 }}>
                          {TAB_ICONS[tab]}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Syne', sans-serif",
                            fontWeight: 700,
                            fontSize: 13,
                            color: '#504B38',
                            marginBottom: 5,
                          }}
                        >
                          {tab}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: '#B9B28A',
                            lineHeight: 1.5,
                          }}
                        >
                          {TAB_DESC[tab]}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Price preview */}
                  <div
                    className="fmd-sn-price-box"
                    style={{ marginBottom: 24 }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: 13,
                          fontWeight: 700,
                          color: '#504B38',
                        }}
                      >
                        Estimated Price
                      </div>
                      <div
                        style={{ fontSize: 12, color: '#B9B28A', marginTop: 2 }}
                      >
                        Based on selected notice type
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 22,
                        fontWeight: 900,
                        color: '#F4991A',
                      }}
                    >
                      ₦{computePrice(TYPE_SLUG[activeTab]).toLocaleString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="fmd-sn-btn-primary"
                    >
                      Continue <FiArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
                >
                  {TYPE_SLUG[activeTab] === 'change-of-name' && (
                    <>
                      <div>
                        <label className="fmd-sn-label">
                          Old / Former Name
                        </label>
                        <input
                          className={`fmd-sn-input${touched.oldName && errors.oldName ? ' error' : ''}`}
                          name="oldName"
                          value={changeOfName.oldName}
                          onBlur={() =>
                            setTouched((t) => ({ ...t, oldName: true }))
                          }
                          onChange={onChange(setChangeOfName)}
                          placeholder="e.g., Chukwuemeka John Okeke"
                        />
                        {touched.oldName && errors.oldName && (
                          <p className="fmd-sn-error">
                            <FiAlertCircle size={12} />
                            {errors.oldName}
                          </p>
                        )}
                        <p className="fmd-sn-help">
                          Enter your current / previously used full name.
                        </p>
                      </div>
                      <div>
                        <label className="fmd-sn-label">
                          New / Desired Name
                        </label>
                        <input
                          className={`fmd-sn-input${touched.newName && errors.newName ? ' error' : ''}`}
                          name="newName"
                          value={changeOfName.newName}
                          onBlur={() =>
                            setTouched((t) => ({ ...t, newName: true }))
                          }
                          onChange={onChange(setChangeOfName)}
                          placeholder="e.g., Chukwuemeka John Nwosu"
                        />
                        {touched.newName && errors.newName && (
                          <p className="fmd-sn-error">
                            <FiAlertCircle size={12} />
                            {errors.newName}
                          </p>
                        )}
                        <p className="fmd-sn-help">
                          Ensure spelling matches your supporting documents.
                        </p>
                      </div>
                      <div>
                        <label className="fmd-sn-label">
                          Preferred Newspaper
                        </label>
                        <select
                          className={`fmd-sn-input${touched.newspaper && errors.newspaper ? ' error' : ''}`}
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
                          <p className="fmd-sn-error">
                            <FiAlertCircle size={12} />
                            {errors.newspaper}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {TYPE_SLUG[activeTab] === 'lost-document' && (
                    <>
                      <div>
                        <label className="fmd-sn-label">Document Type</label>
                        <input
                          className={`fmd-sn-input${touched.docType && errors.docType ? ' error' : ''}`}
                          name="docType"
                          value={lostDoc.docType}
                          onBlur={() =>
                            setTouched((t) => ({ ...t, docType: true }))
                          }
                          onChange={onChange(setLostDoc)}
                          placeholder="e.g., National ID, Voter's Card, Birth Certificate"
                        />
                        {touched.docType && errors.docType && (
                          <p className="fmd-sn-error">
                            <FiAlertCircle size={12} />
                            {errors.docType}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="fmd-sn-label">
                          Brief Description
                        </label>
                        <textarea
                          className={`fmd-sn-input${touched.description && errors.description ? ' error' : ''}`}
                          name="description"
                          rows={4}
                          value={lostDoc.description}
                          onBlur={() =>
                            setTouched((t) => ({ ...t, description: true }))
                          }
                          onChange={onChange(setLostDoc)}
                          placeholder="Where/when it was lost, and any useful detail."
                        />
                        {touched.description && errors.description && (
                          <p className="fmd-sn-error">
                            <FiAlertCircle size={12} />
                            {errors.description}
                          </p>
                        )}
                        <p className="fmd-sn-help">
                          Avoid sensitive numbers if not necessary.
                        </p>
                      </div>
                    </>
                  )}

                  {TYPE_SLUG[activeTab] === 'court-affidavit' && (
                    <>
                      <div>
                        <label className="fmd-sn-label">Full Name</label>
                        <input
                          className={`fmd-sn-input${touched.fullName && errors.fullName ? ' error' : ''}`}
                          name="fullName"
                          value={affidavit.fullName}
                          onBlur={() =>
                            setTouched((t) => ({ ...t, fullName: true }))
                          }
                          onChange={onChange(setAffidavit)}
                          placeholder="e.g., Mariam A. Balogun"
                        />
                        {touched.fullName && errors.fullName && (
                          <p className="fmd-sn-error">
                            <FiAlertCircle size={12} />
                            {errors.fullName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="fmd-sn-label">
                          Purpose of Affidavit
                        </label>
                        <textarea
                          className={`fmd-sn-input${touched.purpose && errors.purpose ? ' error' : ''}`}
                          name="purpose"
                          rows={4}
                          value={affidavit.purpose}
                          onBlur={() =>
                            setTouched((t) => ({ ...t, purpose: true }))
                          }
                          onChange={onChange(setAffidavit)}
                          placeholder="State why you're swearing the affidavit."
                        />
                        {touched.purpose && errors.purpose && (
                          <p className="fmd-sn-error">
                            <FiAlertCircle size={12} />
                            {errors.purpose}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Price row */}
                  <div className="fmd-sn-price-box">
                    <div>
                      <div
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: 13,
                          fontWeight: 700,
                          color: '#504B38',
                        }}
                      >
                        Estimated Price
                      </div>
                      <div
                        style={{ fontSize: 12, color: '#B9B28A', marginTop: 2 }}
                      >
                        NGN · incl. publication fee
                      </div>
                    </div>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      <input
                        type="number"
                        className="fmd-sn-input"
                        style={{ width: 110, textAlign: 'right' }}
                        value={price}
                        min={0}
                        onChange={(e) => setPrice(Number(e.target.value || 0))}
                      />
                    </div>
                  </div>
                  {touched.price && errors.price && (
                    <p className="fmd-sn-error">
                      <FiAlertCircle size={12} />
                      {errors.price}
                    </p>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: 4,
                    }}
                  >
                    <button
                      type="button"
                      onClick={prevStep}
                      className="fmd-sn-btn-ghost"
                    >
                      <FiArrowLeft size={14} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="fmd-sn-btn-primary"
                    >
                      Continue <FiArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
                >
                  {/* Preview */}
                  <div className="fmd-sn-preview-box">
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#B9B28A',
                        textTransform: 'uppercase',
                        letterSpacing: '.12em',
                        marginBottom: 12,
                      }}
                    >
                      Notice Preview
                    </div>
                    <div
                      style={{
                        color: '#504B38',
                        fontSize: 14,
                        lineHeight: 1.75,
                      }}
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: 12,
                        paddingTop: 12,
                        borderTop: '1px solid #EBE5C2',
                        fontSize: 12,
                        color: '#B9B28A',
                      }}
                    >
                      <span>{charCount} characters</span>
                      <span>Auto-formatted for publication</span>
                    </div>
                  </div>

                  {/* Price summary */}
                  <div className="fmd-sn-price-box">
                    <div>
                      <div
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: 13,
                          fontWeight: 700,
                          color: '#504B38',
                        }}
                      >
                        Total Amount
                      </div>
                      <div
                        style={{ fontSize: 12, color: '#B9B28A', marginTop: 2 }}
                      >
                        Final amount may vary with newspaper availability
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 22,
                        fontWeight: 900,
                        color: '#F4991A',
                      }}
                    >
                      ₦{price.toLocaleString()}
                    </div>
                  </div>

                  {!refId ? (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: 4,
                      }}
                    >
                      <button
                        type="button"
                        onClick={prevStep}
                        className="fmd-sn-btn-ghost"
                      >
                        <FiArrowLeft size={14} /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="fmd-sn-btn-primary"
                      >
                        {submitting ? 'Submitting…' : 'Submit Notice'}{' '}
                        {!submitting && <FiArrowRight size={14} />}
                      </button>
                    </div>
                  ) : (
                    <div className="fmd-sn-success-box">
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: '#2e7d5f',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <FiCheck size={14} color="#fff" strokeWidth={2.5} />
                        </span>
                        <span
                          style={{
                            fontFamily: "'Syne', sans-serif",
                            fontWeight: 800,
                            color: '#2e7d5f',
                            fontSize: 15,
                          }}
                        >
                          Notice Submitted!
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 12,
                          color: '#B9B28A',
                          marginBottom: 16,
                        }}
                      >
                        Reference:{' '}
                        <strong style={{ color: '#504B38' }}>{refId}</strong>
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          gap: 10,
                          justifyContent: 'center',
                          flexWrap: 'wrap',
                        }}
                      >
                        <Link
                          to={`/notice/preview/${refId}`}
                          className="fmd-sn-btn-ghost"
                          style={{ fontSize: 13 }}
                        >
                          Preview Notice
                        </Link>
                        <Link
                          to={`/pay/${refId}`}
                          className="fmd-sn-btn-success"
                        >
                          Proceed to Payment <FiArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right aside */}
            <aside className="fmd-sn-aside">
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
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    background: 'rgba(244,153,26,.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FiInfo size={15} color="#F4991A" />
                </div>
                <h2
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 15,
                    fontWeight: 800,
                    color: '#504B38',
                  }}
                >
                  Guidelines
                </h2>
              </div>
              {[
                'Use full legal names as they appear on official documents.',
                'Keep descriptions factual; avoid sensitive IDs unless required.',
                "You'll receive a reference ID and email updates after submission.",
                'Publication typically occurs 3–7 business days after payment.',
                'All notices are reviewed before publication for compliance.',
              ].map((tip, i) => (
                <div key={i} className="fmd-sn-guide-item">
                  <div className="fmd-sn-guide-dot" />
                  <p
                    style={{ fontSize: 13, color: '#B9B28A', lineHeight: 1.65 }}
                  >
                    {tip}
                  </p>
                </div>
              ))}

              {/* Price reference */}
              <div
                style={{
                  marginTop: 20,
                  padding: '14px 16px',
                  background: '#F8F3D9',
                  border: '1.5px solid #EBE5C2',
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#504B38',
                    textTransform: 'uppercase',
                    letterSpacing: '.1em',
                    marginBottom: 10,
                  }}
                >
                  Base Prices (NGN)
                </div>
                {Object.entries(DEFAULT_PRICES).map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '5px 0',
                      borderBottom: '1px solid #EBE5C2',
                      fontSize: 12,
                    }}
                  >
                    <span
                      style={{ color: '#B9B28A', textTransform: 'capitalize' }}
                    >
                      {key.replace(/-/g, ' ')}
                    </span>
                    <span
                      style={{
                        color: '#F4991A',
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                      }}
                    >
                      ₦{val.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </aside>
          </form>
        </div>
      </div>
    </>
  );
}

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
