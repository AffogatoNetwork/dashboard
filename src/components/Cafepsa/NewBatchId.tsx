import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import Loading from '../Loading';
import { getBatch, getFarmer, canEdit, updateBatchFarmerWeights, updateBatchData } from '../../db/firebase';
import NotFound from '../common/NotFound';
import { LinkIcon } from '../icons/link';

// ── Certification logos ───────────────────────────────────────────────────────
const CERT_ICONS: Record<string, string> = {
  'Fairtrade':           require('../../assets/certificaciones/2_Fair Trade.png'),
  'Orgánico':            require('../../assets/certificaciones/10_EU Organic.png'),
  'Rainforest Alliance': require('../../assets/certificaciones/3_Rainforest Alliance.png'),
  'Con Manos de Mujer':  require('../../assets/certificaciones/5_ConManosdeMujer.png'),
  'ROC':                 require('../../assets/certificaciones/16_ROC.jpeg'),
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const safeFloat = (v: any): string => {
  const n = parseFloat(v);
  return isNaN(n) ? '—' : n.toFixed(2);
};

const nonEmpty = (v: any): string =>
  v !== undefined && v !== null && v !== '' ? String(v) : '';

// ── Sub-components ────────────────────────────────────────────────────────────
const StatCell = ({
  value,
  label,
  onChange,
}: {
  value: string;
  label: string;
  onChange?: (v: string) => void;
}) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-amber-100 bg-amber-50 py-4 px-2 text-center">
    {onChange ? (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-center text-sm font-bold text-amber-900 border-b border-amber-300 focus:outline-none placeholder-amber-300"
        placeholder="—"
      />
    ) : (
      <span className="text-lg font-bold text-amber-900 leading-tight">{value || '—'}</span>
    )}
    <span className="mt-1 text-xs text-amber-700/70 uppercase tracking-wide">{label}</span>
  </div>
);

const SectionHeader = ({ label }: { label: string }) => (
  <div className="mb-3 rounded-lg bg-amber-800 px-4 py-2 text-center text-sm font-semibold uppercase tracking-wider text-white">
    {label}
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
const NewBatchId = () => {
  const { t } = useTranslation();
  const { batchId } = useParams();
  const [loading, setLoading] = useState(true);
  const [batch, setBatch] = useState<any>(null);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [farmersOpen, setFarmersOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [weights, setWeights] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!batchId) return;

    getBatch(batchId)
      .then(async (result) => {
        if (!result) { setLoading(false); return; }

        if (result.image && !result.image.includes('https://firebasestorage')) {
          result.image = 'https://affogato.mypinata.cloud/ipfs/' + result.image;
        }
        setBatch(result);

        if (result.farmerWeights) {
          const s: Record<string, string> = {};
          for (const [k, v] of Object.entries(result.farmerWeights)) s[k] = String(v);
          setWeights(s);
        }

        try {
          const emailRaw = localStorage.getItem('email');
          if (emailRaw) {
            const email = JSON.parse(emailRaw);
            const permResult = await canEdit(email, result.parentId || '');
            for (let i = 0; i < permResult.length; i++) {
              if (permResult[i].data().user?.includes(email)) { setIsAdmin(true); break; }
            }
          }
        } catch (_) {}

        const raw = result.Farmer || result.Farmers;
        const addrs: string[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
        if (addrs.length > 0) {
          Promise.all(addrs.map(async (addr: string) => {
            const f = await getFarmer(addr);
            return f ? { ...f, address: addr } : { address: addr };
          }))
            .then((f) => { setFarmers(f); setLoading(false); })
            .catch(() => setLoading(false));
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [batchId]);

  if (loading) return <Loading label={t('loading')} className="loading-wrapper" />;
  if (!batch) return <NotFound msg={`${batchId} — ${t('not_tasted')}`} />;

  const isEditable = isAdmin && batch.createdAt && (Date.now() - batch.createdAt) < 24 * 60 * 60 * 1000;

  // ── Edit helpers ─────────────────────────────────────────────────────────────
  const startEditing = () => {
    setEditData({
      Description: batch.Description || '',
      wetMill: { ...(batch.wetMill || {}) },
      dryMill: { ...(batch.dryMill || {}) },
      Profile: { ...(batch.Profile || {}) },
      Roasting: { ...(batch.Roasting || {}) },
      urlCatacion: batch.urlCatacion || '',
      urlTrilla: batch.urlTrilla || '',
    });
    setIsEditing(true);
  };

  const cancelEditing = () => { setIsEditing(false); setEditData(null); };

  const gf = (path: string): string => {
    if (!editData) return '';
    const [a, b] = path.split('.');
    return b ? (editData[a]?.[b] ?? '') : (editData[a] ?? '');
  };

  const sf = (path: string, val: string) => {
    const [a, b] = path.split('.');
    if (b) {
      setEditData((p: any) => ({ ...p, [a]: { ...p[a], [b]: val } }));
    } else {
      setEditData((p: any) => ({ ...p, [a]: val }));
    }
  };

  const handleSave = async () => {
    if (!batchId || !editData) return;
    setSaving(true);
    try {
      await updateBatchData(batchId, editData);
      setBatch((prev: any) => ({
        ...prev,
        Description: editData.Description,
        wetMill: { ...prev.wetMill, ...editData.wetMill },
        dryMill: { ...prev.dryMill, ...editData.dryMill },
        Profile: { ...prev.Profile, ...editData.Profile },
        Roasting: { ...prev.Roasting, ...editData.Roasting },
        urlCatacion: editData.urlCatacion,
        urlTrilla: editData.urlTrilla,
      }));
      setIsEditing(false);
      setEditData(null);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWeights = async () => {
    if (!batchId) return;
    setSaving(true);
    try {
      const parsed: Record<string, number> = {};
      for (const [addr, val] of Object.entries(weights)) {
        const n = parseFloat(val);
        if (!isNaN(n)) parsed[addr] = n;
      }
      await updateBatchFarmerWeights(batchId, parsed);
    } finally {
      setSaving(false);
    }
  };

  const certs: string[] = (
    isEditing ? gf('wetMill.certifications') : (batch.wetMill?.certifications || '')
  ).split(',').map((c: string) => c.trim()).filter(Boolean);

  const validFarmers = farmers.filter((f: any) => f?.address);

  const hasCupData = ['acidity','aftertaste','aroma','body','flavor','sweetness','note']
    .some(k => nonEmpty((batch.Profile as any)?.[k]));
  const hasRoasting = nonEmpty(batch.Roasting?.roast_type) || nonEmpty(batch.Roasting?.roast_date);
  const hasLinks = nonEmpty(batch.urlCatacion) || nonEmpty(batch.urlTrilla) ||
    nonEmpty(batch.dryMill?.cupping_url) || nonEmpty(batch.Profile?.scaa_url);

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="mx-auto max-w-5xl px-4 pb-12 pt-2">

        {/* Save / Cancel bar – full width */}
        {isEditing && (
          <div className="mb-4 flex gap-2 rounded-2xl bg-white p-3 shadow-sm">
            <button
              onClick={cancelEditing}
              className="flex-1 rounded-xl border border-amber-800 py-2 text-sm font-semibold text-amber-800 active:bg-amber-50"
            >
              {t('back')}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 rounded-xl bg-amber-800 py-2 text-sm font-semibold text-white disabled:opacity-50 active:bg-amber-900"
            >
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        )}

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Batch identity — hero: 2 cols on md */}
          <div className="rounded-2xl bg-white p-5 shadow-sm md:col-span-2">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <p className="flex flex-wrap items-baseline gap-2 text-xs font-medium uppercase tracking-widest text-amber-700">
                    {t('batch-id')}
                    <span className="break-all font-mono text-[10px] font-normal normal-case tracking-normal text-gray-400">
                      {batch.ipfsHash || batchId}
                    </span>
                  </p>
                  {isEditable && !isEditing && (
                    <button
                      onClick={startEditing}
                      className="rounded-lg p-1.5 text-amber-700 hover:bg-amber-50"
                      title="Editar"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
                      </svg>
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <textarea
                    value={gf('Description')}
                    onChange={(e) => sf('Description', e.target.value)}
                    rows={2}
                    placeholder={t('description')}
                    className="mt-2 w-full rounded-lg border border-amber-200 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none"
                  />
                ) : (
                  batch.Description && (
                    <p className="mt-2 text-sm text-gray-600">{batch.Description}</p>
                  )
                )}

                <div className="mt-4">
                  {isEditing ? (
                    <input
                      value={gf('wetMill.variety')}
                      onChange={(e) => sf('wetMill.variety', e.target.value)}
                      placeholder={t('variety')}
                      className="w-full rounded-full border border-amber-200 px-3 py-1 text-xs font-medium text-amber-800 focus:border-amber-500 focus:outline-none"
                    />
                  ) : (
                    nonEmpty(batch.wetMill?.variety || batch.dryMill?.variety) && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                        {batch.wetMill?.variety || batch.dryMill?.variety}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="relative shrink-0 self-center">
                <img
                  src={batch.image || 'https://gateway.pinata.cloud/ipfs/' + (batch.ipfsHash || '')}
                  alt={batch.Name || t('batch')}
                  className="relative z-10 h-48 w-32 object-contain sm:h-56 sm:w-40"
                />
                <div className="absolute top-2 bottom-2 left-2 right-2 z-0 border-2 border-yellow-600/30 opacity-80" />
              </div>
            </div>
          </div>

          {/* Certifications — 1 col on md */}
          {isEditing ? (
            <div className="rounded-2xl bg-white p-5 shadow-sm md:col-span-1">
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-amber-700">
                {t('certifications')}
              </p>
              <input
                value={gf('wetMill.certifications')}
                onChange={(e) => sf('wetMill.certifications', e.target.value)}
                placeholder="Fairtrade, Orgánico…"
                className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-400">Separar con comas</p>
            </div>
          ) : (
            certs.filter(c => CERT_ICONS[c]).length > 0 && (
              <div className="rounded-2xl bg-white p-5 shadow-sm md:col-span-1">
                <p className="mb-4 text-xs font-medium uppercase tracking-widest text-amber-700">
                  {t('certifications')}
                </p>
                <div className="flex flex-wrap gap-4">
                  {certs.filter(c => CERT_ICONS[c]).map(c => (
                    <div key={c} className="flex flex-col items-center gap-1">
                      <img src={CERT_ICONS[c]} alt={c} className="h-14 w-14 object-contain" />
                      <span className="text-xs text-gray-500 text-center max-w-[64px] leading-tight">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* Farmers accordion — 1 col on md */}
          {validFarmers.length > 0 && (
            <div className="rounded-2xl bg-white shadow-sm overflow-hidden md:col-span-1">
              <button
                onClick={() => setFarmersOpen(o => !o)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-xs font-medium uppercase tracking-widest text-amber-700">
                  {t('farmers')} ({validFarmers.length})
                </span>
                <svg
                  className={`h-4 w-4 text-amber-700 transition-transform duration-200 ${farmersOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {farmersOpen && (
                <ul className="border-t border-amber-50 px-5 pb-4 pt-2 space-y-1">
                  {validFarmers.map((farmer: any, i: number) => (
                    <li key={i}>
                      <a
                        href={`/farmer/${farmer.address}`}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-amber-50 active:bg-amber-100"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
                          {(farmer?.fullname || farmer.address || '?')[0].toUpperCase()}
                        </span>
                        {farmer?.fullname || farmer.address}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Cup profile — 2 cols on md */}
          {(isEditing || hasCupData) && (
            <div className="rounded-2xl bg-white p-5 shadow-sm md:col-span-2">
              <SectionHeader label={t('cup-profile')} />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {(['acidity','aftertaste','aroma','body','flavor','sweetness','note'] as const).map((key) => {
                  const val = isEditing ? gf(`Profile.${key}`) : nonEmpty((batch.Profile as any)?.[key]);
                  if (!isEditing && !val) return null;
                  return (
                    <StatCell
                      key={key}
                      value={val}
                      label={t(key)}
                      onChange={isEditing ? (v) => sf(`Profile.${key}`, v) : undefined}
                    />
                  );
                })}
              </div>
              {isEditing ? (
                <textarea
                  value={gf('Profile.general_description')}
                  onChange={(e) => sf('Profile.general_description', e.target.value)}
                  rows={3}
                  placeholder={t('general-description')}
                  className="mt-3 w-full rounded-lg border border-amber-200 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none"
                />
              ) : (
                batch.Profile?.general_description && (
                  <p className="mt-3 text-sm text-gray-600">{batch.Profile.general_description}</p>
                )
              )}
            </div>
          )}

          {/* Production (wet mill) — 1 col on md */}
          <div className="rounded-2xl bg-white p-5 shadow-sm md:col-span-1">
            <SectionHeader label={t('production')} />
            <div className="grid grid-cols-2 gap-3">
              {(['process','drying_type','drying_hours','weight','date','facility'] as const).map((key) => {
                const raw = (batch.wetMill as any)?.[key];
                const val = isEditing ? gf(`wetMill.${key}`) : nonEmpty(raw);
                const display = (!isEditing && key === 'weight' && val) ? `${val} qq` : val;
                if (!isEditing && !val) return null;
                return (
                  <StatCell
                    key={key}
                    value={isEditing ? gf(`wetMill.${key}`) : display}
                    label={t(key === 'drying_type' ? 'drying-type' : key === 'drying_hours' ? 'drying-hours' : key)}
                    onChange={isEditing ? (v) => sf(`wetMill.${key}`, v) : undefined}
                  />
                );
              })}
            </div>
          </div>

          {/* Dry mill — 1 col on md */}
          <div className="rounded-2xl bg-white p-5 shadow-sm md:col-span-1">
            <SectionHeader label={t('dry-mill')} />
            <div className="grid grid-cols-2 gap-3">
              {([
                { key: 'prep_type',       label: 'prep-type'       },
                { key: 'threshing_yield', label: 'threshing-yield' },
                { key: 'damage_percent',  label: 'damage-percent'  },
                { key: 'weight',          label: 'weight'          },
                { key: 'buyer',           label: 'buyer'           },
                { key: 'facility',        label: 'facility'        },
              ] as const).map(({ key, label }) => {
                const raw = (batch.dryMill as any)?.[key];
                if (!isEditing) {
                  if (!nonEmpty(raw)) return null;
                  const display =
                    key === 'threshing_yield' ? safeFloat(raw) :
                    key === 'damage_percent'  ? `${safeFloat(raw)} %` :
                    key === 'weight'          ? `${raw} qq` : String(raw);
                  return <StatCell key={key} value={display} label={t(label)} />;
                }
                return (
                  <StatCell
                    key={key}
                    value={gf(`dryMill.${key}`)}
                    label={t(label)}
                    onChange={(v) => sf(`dryMill.${key}`, v)}
                  />
                );
              })}
            </div>
          </div>

          {/* Roasting — 1 col on md */}
          {(isEditing || hasRoasting) && (
            <div className="rounded-2xl bg-white p-5 shadow-sm md:col-span-1">
              <SectionHeader label={t('roast-type')} />
              <div className="grid grid-cols-2 gap-3">
                {([
                  { key: 'roast_type', label: 'roast-type' },
                  { key: 'roast_date', label: 'roast-date' },
                  { key: 'grind_type', label: 'grind-type' },
                  { key: 'packaging',  label: 'packaging'  },
                  { key: 'bag_size',   label: 'bag-size'   },
                ] as const).map(({ key, label }) => {
                  const raw = (batch.Roasting as any)?.[key];
                  if (!isEditing) {
                    if (!nonEmpty(raw)) return null;
                    const display = key === 'bag_size' ? `${raw} g` : String(raw);
                    return <StatCell key={key} value={display} label={t(label)} />;
                  }
                  return (
                    <StatCell
                      key={key}
                      value={gf(`Roasting.${key}`)}
                      label={t(label)}
                      onChange={(v) => sf(`Roasting.${key}`, v)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* External links — full width */}
          {(isEditing || hasLinks) && (
            <div className="rounded-2xl bg-white p-5 shadow-sm md:col-span-3">
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-amber-700">
                {t('services')}
              </p>
              {isEditing ? (
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { field: 'urlCatacion', label: t('cupping_profile') },
                    { field: 'urlTrilla',   label: t('threshing-process') },
                  ].map(({ field, label }) => (
                    <div key={field}>
                      <label className="mb-1 block text-xs text-gray-500">{label}</label>
                      <input
                        value={gf(field)}
                        onChange={(e) => sf(field, e.target.value)}
                        placeholder="https://…"
                        className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">{t('scaa-url')}</label>
                    <input
                      value={gf('Profile.scaa_url')}
                      onChange={(e) => sf('Profile.scaa_url', e.target.value)}
                      placeholder="https://…"
                      className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {nonEmpty(batch.urlCatacion || batch.dryMill?.cupping_url) && (
                    <a href={batch.urlCatacion || batch.dryMill?.cupping_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl bg-amber-800 px-4 py-3 text-sm font-semibold text-white active:bg-amber-900">
                      <LinkIcon />{t('cupping_profile')}
                    </a>
                  )}
                  {nonEmpty(batch.urlTrilla) && (
                    <a href={batch.urlTrilla} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-amber-800 px-4 py-3 text-sm font-semibold text-amber-800 active:bg-amber-50">
                      <LinkIcon />{t('threshing-process')}
                    </a>
                  )}
                  {nonEmpty(batch.Profile?.scaa_url) && (
                    <a href={batch.Profile.scaa_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-amber-800 px-4 py-3 text-sm font-semibold text-amber-800 active:bg-amber-50">
                      <LinkIcon />{t('scaa-url')}
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Admin: qq per farmer — full width */}
          {isEditable && validFarmers.length > 0 && (
            <div className="rounded-2xl bg-white p-5 shadow-sm md:col-span-3">
              <SectionHeader label="Asignar QQ por productor" />
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {validFarmers.map((farmer: any) => (
                  <div key={farmer.address} className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2">
                    <span className="flex-1 truncate text-sm text-gray-700">
                      {farmer.fullname || farmer.address}
                    </span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={weights[farmer.address] ?? ''}
                        onChange={(e) => setWeights((prev) => ({ ...prev, [farmer.address]: e.target.value }))}
                        className="w-20 rounded-lg border border-amber-200 bg-white px-2 py-1 text-right text-sm focus:border-amber-500 focus:outline-none"
                        placeholder="0.00"
                      />
                      <span className="text-xs text-gray-500">qq</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSaveWeights}
                disabled={saving}
                className="mt-4 w-full rounded-xl bg-amber-800 py-3 text-sm font-semibold text-white disabled:opacity-50 active:bg-amber-900"
              >
                {saving ? 'Guardando…' : 'Guardar QQ'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default NewBatchId;
