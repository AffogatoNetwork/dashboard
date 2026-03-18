import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import Loading from '../Loading';
import NotFound from '../common/NotFound';
import { getFarmer, getFarmerFarms, getImageUrl, getBannerUrl } from '../../db/firebase';
import NewMap from '../common/NewMap';
import proexoLogo from '../../assets/proexo.png';
import QRCode from 'react-qr-code';

const CERT_ICONS: Record<string, { img: string; label: string }> = {
  fairtrade: { img: require('../../assets/certificaciones/2_Fair Trade.png'), label: 'Fair Trade' },
  organico: { img: require('../../assets/certificaciones/10_EU Organic.png'), label: 'Orgánico' },
  rainforest: { img: require('../../assets/certificaciones/3_Rainforest Alliance.png'), label: 'Rainforest Alliance' },
  manosdemujer: { img: require('../../assets/certificaciones/5_ConManosdeMujer.png'), label: 'Con Manos de Mujer' },
  roc: { img: require('../../assets/certificaciones/16_ROC.jpeg'), label: 'ROC' },
};

const InfoItem = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium uppercase tracking-wide text-amber-700">{label}</span>
    <span className="text-sm font-semibold text-gray-800">{value || '—'}</span>
  </div>
);

export const FarmerProfileModule = () => {
  const { t } = useTranslation();
  const { newfarmerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [farmerData, setFarmerData] = useState<any>(null);
  const [farms, setFarms] = useState<any>(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [farmName, setFarmName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!newfarmerId) return;
      setLoading(true);
      try {
        const farmer = await getFarmer(newfarmerId);
        setFarmerData(farmer);

        if (farmer) {
          const farmList = await getFarmerFarms(farmer.address);
          if (farmList && farmList.length > 0) {
            setFarmName(farmList[0].name);
            setLatitude(farmList[0].latitude);
            setLongitude(farmList[0].longitude);
            setFarms(farmList[0]);
          }
          const banner = await getBannerUrl(farmer.company || 'PROEXO');
          if (banner) setBannerUrl(banner);
        }

        const url = await getImageUrl(newfarmerId);
        setImageUrl(url);
      } catch (error) {
        console.error('Error loading farmer profile:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line
  }, [newfarmerId]);

  if (loading) {
    return <Loading label={t('loading').concat('...')} className="loading-wrapper" />;
  }

  if (!farmerData) {
    return <NotFound msg={t('errors.farmer-not-found')} />;
  }

  const activeCerts = Object.entries(CERT_ICONS).filter(
    ([key]) => farms?.[key] === 'X'
  );

  return (
    <>
      {/* Photo modal */}
      <input type="checkbox" id="image-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <label
            htmlFor="image-modal"
            className="btn-sm btn-circle btn absolute right-2 top-2 bg-red-500 text-white hover:bg-red-700"
          >✕</label>
          <div className="m-6 flex justify-center">
            {imageUrl && <img alt="profile" src={imageUrl} className="rounded-lg max-h-80 object-contain" />}
          </div>
        </div>
      </div>

      {/* Page wrapper with tiled watermark */}
      <div className="relative min-h-screen bg-stone-50">
        {/* Tiled watermark */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${proexoLogo})`,
            backgroundRepeat: 'repeat',
            backgroundSize: '140px',
            opacity: 0.04,
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-3xl px-4 py-6">

          {/* Banner */}
          {bannerUrl && (
            <div className="mb-4 overflow-hidden rounded-xl shadow">
              <img src={bannerUrl} alt="banner" className="w-full max-h-36 object-cover" />
            </div>
          )}

          {/* Card */}
          <div className="rounded-2xl bg-white shadow-lg overflow-hidden">

            {/* Header stripe */}
            <div className="bg-amber-800 px-6 py-3 flex items-center justify-between">
              <span className="text-white font-semibold tracking-wide text-sm uppercase">
                {t('farmer-id-card')}
              </span>
              <span className="text-amber-200 text-xs font-mono">
                {farmerData.farmerId || farmerData.cooperativeId || ''}
              </span>
            </div>

            {/* Profile hero */}
            <div className="flex flex-col sm:flex-row gap-5 p-6 border-b border-gray-100">
              {/* Avatar */}
              <label htmlFor="image-modal" className="cursor-pointer flex-shrink-0 self-start">
                <div className="h-24 w-24 rounded-full border-4 border-amber-800 overflow-hidden bg-gray-100">
                  {imageUrl
                    ? <img src={imageUrl} alt="profile" className="h-full w-full object-cover" />
                    : <div className="h-full w-full flex items-center justify-center text-3xl text-amber-800 font-bold">
                      {farmerData.fullname?.[0] ?? '?'}
                    </div>
                  }
                </div>
              </label>

              {/* Name + company */}
              <div className="flex flex-col justify-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                  {farmerData.fullname}
                </h1>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="rounded-full bg-amber-800 px-3 py-0.5 text-xs font-semibold text-white">
                    {farmerData.company}
                  </span>
                  {farmerData.cooperativeId && (
                    <span className="rounded-full border border-amber-300 px-3 py-0.5 text-xs text-amber-800">
                      {t('cooperative-id')}: {farmerData.farmerId}
                    </span>
                  )}
                  {farmerData.pnud && (
                    <span className="rounded-full bg-blue-100 border border-blue-300 px-3 py-0.5 text-xs font-semibold text-blue-800">
                      PNUD
                    </span>
                  )}
                </div>
                {farmerData.pnud && (
                  <p className="mt-1 text-sm text-gray-500">
                    Realiza proceso de secado solar con apoyo técnico de PNUD.
                  </p>
                )}

              </div>
            </div>


            {/* Personal info */}
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-amber-700">
                {t('personal-info')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <InfoItem label={t('gender')} value={t(farmerData.gender)} />
                <InfoItem label={t('country')} value={farmerData.country} />
                <InfoItem label={t('region')} value={farmerData.region || farms?.region} />
                <InfoItem label={t('village')} value={farmerData.village2 || farms?.village2} />
                <InfoItem label={t('village2')} value={farmerData.village || farms?.village} />
              </div>
            </div>


            {/* Farm details */}
            {farms && (
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-amber-700">
                  {t('farm-details')}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <InfoItem label={t('farm-name')} value={farms.bio || farmName} />
                  <InfoItem label={t('height')} value={farms.height ? `${farms.height} msnm` : undefined} />
                  <InfoItem label={t('area')} value={farms.area ? `${farms.area} ha` : undefined} />
                  <InfoItem label={t('variety')} value={farms.varieties} />
                  <InfoItem label={t('shadow')} value={farms.shadow} />
                  <InfoItem label={t('family-members')} value={farms.familyMembers} />
                </div>
              </div>
            )}

            {/* Certifications */}
            {farms && (
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-amber-700">
                  {t('certificates')}
                </h2>
                {activeCerts.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {activeCerts.map(([key, cert]) => (
                      <div key={key} className="flex flex-col items-center gap-1">
                        <img src={cert.img} alt={cert.label} className="h-16 w-16 object-contain" />
                        <span className="text-xs text-gray-500 text-center max-w-[72px] leading-tight">
                          {cert.label}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">{t('no-data')}</p>
                )}
              </div>
            )}

            {/* Map */}
            {latitude && longitude && (
              <div className="px-6 py-5">
                <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-amber-700">
                  {t('location')}
                </h2>
                <div className="overflow-hidden rounded-xl">
                  <NewMap
                    latitude={latitude}
                    longitude={longitude}
                    addressLine={farmName}
                    zoomLevel={9}
                    className="google-map"
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 bg-gray-50 border-t border-gray-100">
              <a
                href="/farmers"
                className="text-sm font-medium text-amber-800 hover:text-amber-600 underline-offset-2 hover:underline"
              >
                ← {t('back')}
              </a>

              <img src={proexoLogo} alt="PROEXO" className="h-7 opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
