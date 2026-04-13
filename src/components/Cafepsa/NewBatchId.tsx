import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import Loading from '../Loading';
import { getBatch, getFarmer } from '../../db/firebase';
import NotFound from '../common/NotFound';
import { LinkIcon } from '../icons/link';

// ── Certification logos (same canonical names as FarmerProfile) ───────────────
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

const StatCell = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-amber-100 bg-amber-50 py-4 px-2 text-center">
    <span className="text-lg font-bold text-amber-900 leading-tight">
      {value || '—'}
    </span>
    <span className="mt-1 text-xs text-amber-700/70 uppercase tracking-wide">
      {label}
    </span>
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

  useEffect(() => {
    if (!batchId) return;

    getBatch(batchId)
      .then((result) => {
        if (!result) { setLoading(false); return; }

        // Normalize image URL
        if (result.image && !result.image.includes('https://firebasestorage')) {
          result.image = 'https://affogato.mypinata.cloud/ipfs/' + result.image;
        }
        setBatch(result);

        const farmerAddresses: any[] = result.Farmer || [];
        if (farmerAddresses.length > 0) {
          Promise.all(farmerAddresses.map((addr: any) => getFarmer(addr)))
            .then((f) => { setFarmers(f.filter(Boolean)); setLoading(false); })
            .catch(() => setLoading(false));
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [batchId]);

  if (loading) return <Loading label={t('loading')} className="loading-wrapper" />;
  if (!batch) return <NotFound msg={`${batchId} — ${t('not_tasted')}`} />;

  const certs: string[] = (batch.wetMill?.certifications || '')
    .split(',')
    .map((c: string) => c.trim())
    .filter(Boolean);

  const cupStats = [
    { key: 'acidity', val: nonEmpty(batch.Profile?.acidity) },
    { key: 'aftertaste', val: nonEmpty(batch.Profile?.aftertaste) },
    { key: 'aroma', val: nonEmpty(batch.Profile?.aroma) },
    { key: 'body', val: nonEmpty(batch.Profile?.body) },
    { key: 'flavor', val: nonEmpty(batch.Profile?.flavor) },
    { key: 'sweetness', val: nonEmpty(batch.Profile?.sweetness) },
    { key: 'note', val: nonEmpty(batch.Profile?.note) },
  ].filter(s => s.val);

  return (
    <div className="min-h-screen bg-stone-100">


      <div className="mx-auto max-w-2xl space-y-4 px-4 pb-12 pt-2">

        {/* Batch identity */}
        <div className="flex flex-col gap-6 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <p className="mb-1 flex items-baseline gap-2 text-xs font-medium uppercase tracking-widest text-amber-700">
              {t('batch-id')}
              <span className="break-all font-mono text-[10px] font-normal normal-case tracking-normal text-gray-400">
                {batch.ipfsHash || batchId}
              </span>
            </p>

            {batch.Description && (
              <p className="mt-2 text-sm text-gray-600">{batch.Description}</p>
            )}

            {nonEmpty(batch.wetMill?.variety || batch.dryMill?.variety) && (
              <div className="mt-4">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                  {batch.wetMill?.variety || batch.dryMill?.variety}
                </span>
              </div>
            )}
          </div>

          <div className="relative shrink-0 self-center sm:self-auto">
            <img
              src={batch.image || 'https://gateway.pinata.cloud/ipfs/' + (batch.ipfsHash || '')}
              alt={batch.Name || t('batch')}
              className="relative z-10 h-48 w-32 object-contain sm:h-56 sm:w-40"
            />
            <div className="absolute top-2 bottom-2 left-2 right-2 z-0 border-2 border-yellow-600/30 opacity-80" />
          </div>
        </div>

        {/* Certifications */}
        {certs.filter(c => CERT_ICONS[c]).length > 0 && (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-amber-700">
              {t('certifications')}
            </p>
            <div className="flex flex-wrap gap-6">
              {certs.filter(c => CERT_ICONS[c]).map(c => (
                <div key={c} className="flex flex-col items-center gap-1">
                  <img src={CERT_ICONS[c]} alt={c} className="h-16 w-16 object-contain" />
                  <span className="text-xs text-gray-500 text-center max-w-[72px] leading-tight">{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Farmers */}
        {farmers.length > 0 && (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-amber-700">
              {t('farmers')}
            </p>
            <ul className="space-y-2">
              {farmers.filter((farmer: any) => farmer?.address || farmer?.fullname).map((farmer: any, i: number) => (
                <li key={i}>
                  <a
                    href={`/farmer/${farmer?.address}`}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-amber-50 active:bg-amber-100"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
                      {(farmer?.fullname || '?')[0].toUpperCase()}
                    </span>
                    {farmer?.fullname || farmer?.address}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cup profile */}
        {cupStats.length > 0 && (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <SectionHeader label={t('cup-profile')} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {cupStats.map(({ key, val }) => (
                <StatCell key={key} value={val} label={t(key)} />
              ))}
            </div>
            {batch.Profile?.general_description && (
              <p className="mt-3 text-sm text-gray-600">
                {batch.Profile.general_description}
              </p>
            )}
          </div>
        )}

        {/* Production */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <SectionHeader label={t('production')} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {nonEmpty(batch.wetMill?.process) && (
              <StatCell value={batch.wetMill.process} label={t('process')} />
            )}
            {nonEmpty(batch.wetMill?.drying_type) && (
              <StatCell value={batch.wetMill.drying_type} label={t('drying-type')} />
            )}
            {nonEmpty(batch.wetMill?.drying_hours) && (
              <StatCell value={batch.wetMill.drying_hours} label={t('drying-hours')} />
            )}
            {nonEmpty(batch.wetMill?.weight) && (
              <StatCell value={`${batch.wetMill.weight} qq`} label={t('weight')} />
            )}
            {nonEmpty(batch.wetMill?.date) && (
              <StatCell value={batch.wetMill.date} label={t('date')} />
            )}
            {nonEmpty(batch.wetMill?.facility) && (
              <StatCell value={batch.wetMill.facility} label={t('facility')} />
            )}
          </div>
        </div>

        {/* Dry mill */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <SectionHeader label={t('dry-mill')} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {nonEmpty(batch.dryMill?.prep_type) && (
              <StatCell value={batch.dryMill.prep_type} label={t('prep-type')} />
            )}
            {nonEmpty(batch.dryMill?.threshing_yield) && (
              <StatCell value={safeFloat(batch.dryMill.threshing_yield)} label={t('threshing-yield')} />
            )}
            {nonEmpty(batch.dryMill?.damage_percent) && (
              <StatCell value={`${safeFloat(batch.dryMill.damage_percent)} %`} label={t('damage-percent')} />
            )}
            {nonEmpty(batch.dryMill?.weight) && (
              <StatCell value={`${batch.dryMill.weight} qq`} label={t('weight')} />
            )}
            {nonEmpty(batch.dryMill?.buyer) && (
              <StatCell value={batch.dryMill.buyer} label={t('buyer')} />
            )}
            {nonEmpty(batch.dryMill?.facility) && (
              <StatCell value={batch.dryMill.facility} label={t('facility')} />
            )}
          </div>
        </div>

        {/* Roasting */}
        {(nonEmpty(batch.Roasting?.roast_type) || nonEmpty(batch.Roasting?.roast_date)) && (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <SectionHeader label={t('production')} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {nonEmpty(batch.Roasting?.roast_type) && (
                <StatCell value={batch.Roasting.roast_type} label={t('roast-type')} />
              )}
              {nonEmpty(batch.Roasting?.roast_date) && (
                <StatCell value={batch.Roasting.roast_date} label={t('roast-date')} />
              )}
              {nonEmpty(batch.Roasting?.grind_type) && (
                <StatCell value={batch.Roasting.grind_type} label={t('grind-type')} />
              )}
              {nonEmpty(batch.Roasting?.packaging) && (
                <StatCell value={batch.Roasting.packaging} label={t('packaging')} />
              )}
              {nonEmpty(batch.Roasting?.bag_size) && (
                <StatCell value={`${batch.Roasting.bag_size} g`} label={t('bag-size')} />
              )}
            </div>
          </div>
        )}

        {/* External links */}
        {(nonEmpty(batch.urlCatacion) || nonEmpty(batch.urlTrilla) || nonEmpty(batch.dryMill?.cupping_url) || nonEmpty(batch.Profile?.scaa_url)) && (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-amber-700">
              {t('services')}
            </p>
            <div className="flex flex-col gap-3">
              {nonEmpty(batch.urlCatacion || batch.dryMill?.cupping_url) && (
                <a
                  href={batch.urlCatacion || batch.dryMill?.cupping_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-amber-800 px-4 py-3 text-sm font-semibold text-white active:bg-amber-900"
                >
                  <LinkIcon />
                  {t('cupping_profile')}
                </a>
              )}
              {nonEmpty(batch.urlTrilla) && (
                <a
                  href={batch.urlTrilla}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-amber-800 px-4 py-3 text-sm font-semibold text-amber-800 active:bg-amber-50"
                >
                  <LinkIcon />
                  {t('threshing-process')}
                </a>
              )}
              {nonEmpty(batch.Profile?.scaa_url) && (
                <a
                  href={batch.Profile.scaa_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-amber-800 px-4 py-3 text-sm font-semibold text-amber-800 active:bg-amber-50"
                >
                  <LinkIcon />
                  {t('scaa-url')}
                </a>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default NewBatchId;
