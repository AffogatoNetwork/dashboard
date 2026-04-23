import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import Loading from '../Loading';
import NotFound from '../common/NotFound';
import { getFarmer, getFarmerFarms, getImageUrl, getBannerUrl, canEdit, updateFarmByAddress, updateFarmerPnud, updateFarmerPersonalInfo } from '../../db/firebase';
import { Select, MenuItem, Checkbox, ListItemText, OutlinedInput } from '@mui/material';
import NewMap from '../common/NewMap';
import proexoLogo from '../../assets/proexo.png';
import QRCode from 'react-qr-code';

// Keys are the canonical certification names stored in the `certifications` field
const CERT_ICONS: Record<string, { img: string }> = {
  'Fairtrade':           { img: require('../../assets/certificaciones/2_Fair Trade.png') },
  'Orgánico':            { img: require('../../assets/certificaciones/10_EU Organic.png') },
  'Rainforest Alliance': { img: require('../../assets/certificaciones/3_Rainforest Alliance.png') },
  'Con Manos de Mujer':  { img: require('../../assets/certificaciones/5_ConManosdeMujer.png') },
  'ROC':                 { img: require('../../assets/certificaciones/16_ROC.jpeg') },
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditingCerts, setIsEditingCerts] = useState(false);
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [isEditingFarm, setIsEditingFarm] = useState(false);
  const [editFarmData, setEditFarmData] = useState<any>({});
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [editPersonalData, setEditPersonalData] = useState<any>({});

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

        // Check Admin
        try {
          const emailStr = localStorage.getItem('email');
          if (emailStr) {
            const email = JSON.parse(emailStr);
            if (email && typeof email === 'string') {
              const companyName = farmer?.company || 'PROEXO';
              const permResult = await canEdit(email, companyName);
              for (let i = 0; i < permResult.length; i += 1) {
                const data = permResult[i].data();
                if (data.user?.includes(email)) {
                  setIsAdmin(true);
                }
              }
            }
          }
        } catch (e) {
        }
      } catch (error) {
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

  const handleSaveCertifications = async () => {
    if (!farms) return;
    setLoading(true);
    const certStr = selectedCerts.join(', ');
    await updateFarmByAddress(farmerData.address, { certifications: certStr });
    setFarms({ ...farms, certifications: certStr });
    setIsEditingCerts(false);
    setLoading(false);
  };

  const handleEditClick = () => {
    const current = farms?.certifications
      ? farms.certifications.split(',').map((s: string) => s.trim()).filter((s: string) => s in CERT_ICONS)
      : [];
    setSelectedCerts(current);
    setIsEditingCerts(true);
  };

  const handleEditPersonalClick = () => {
    setEditPersonalData({
      gender: farmerData.gender || '',
      country: farmerData.country || '',
      region: farmerData.region || farms?.region || '',
      village2: farmerData.village2 || farms?.village2 || '',
      village: farmerData.village || farms?.village || '',
    });
    setIsEditingPersonal(true);
  };

  const handleSavePersonal = async () => {
    setLoading(true);
    await updateFarmerPersonalInfo(farmerData.address, editPersonalData);
    if (farms) await updateFarmByAddress(farmerData.address, { village: editPersonalData.village });
    setFarmerData({ ...farmerData, ...editPersonalData });
    if (farms) setFarms({ ...farms, village: editPersonalData.village });
    setIsEditingPersonal(false);
    setLoading(false);
  };

  const handleEditFarmClick = () => {
    setEditFarmData({
      name: farms?.name || farms?.bio || farmName || '',
      height: farms?.height || '',
      area: farms?.area || '',
      varieties: farms?.varieties || '',
      shadow: farms?.shadow || '',
      familyMembers: farms?.familyMembers || '',
    });
    setIsEditingFarm(true);
  };

  const handleSaveFarm = async () => {
    if (!farms) return;
    setLoading(true);
    const updated = {
      ...farms,
      name: editFarmData.name,
      height: editFarmData.height,
      area: editFarmData.area,
      varieties: editFarmData.varieties,
      shadow: editFarmData.shadow,
      familyMembers: editFarmData.familyMembers,
    };
    await updateFarmByAddress(farmerData.address, updated);
    setFarms(updated);
    setFarmName(editFarmData.name);
    setIsEditingFarm(false);
    setLoading(false);
  };

  if (!farmerData) {
    return <NotFound msg={t('errors.farmer-not-found')} />;
  }

  const certList = farms?.certifications
    ? farms.certifications.split(',').map((s: string) => s.trim())
    : [];
  const activeCerts = Object.entries(CERT_ICONS).filter(([key]) => certList.includes(key));

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
                  {!isAdmin && farmerData.pnud && (
                    <span className="rounded-full bg-blue-100 border border-blue-300 px-3 py-0.5 text-xs font-semibold text-blue-800">
                      PNUD
                    </span>
                  )}
                  {isAdmin && (
                    <span className="rounded-full bg-red-100 border border-red-300 px-3 py-0.5 text-xs font-semibold text-red-800 flex items-center gap-1 shadow-sm">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      {t('admin-view', 'VISTA DE ADMINISTRADOR')}
                    </span>
                  )}
                  {isAdmin && (
                    <label className="cursor-pointer label inline-flex items-center gap-2 bg-blue-50 px-3 py-0.5 rounded-full border border-blue-200 ml-1">
                      <span className="label-text text-xs font-semibold text-blue-800">Socio PNUD</span>
                      <input 
                        type="checkbox" 
                        className="toggle toggle-info toggle-xs" 
                        checked={farmerData.pnud || false} 
                        onChange={async (e) => {
                          const val = e.target.checked;
                          setFarmerData({...farmerData, pnud: val});
                          await updateFarmerPnud(farmerData.address, val);
                        }}
                      />
                    </label>
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700">
                  {t('personal-info')}
                </h2>
                {isAdmin && !isEditingPersonal && (
                  <button
                    className="btn btn-sm btn-outline btn-warning"
                    onClick={handleEditPersonalClick}
                  >
                    Editar
                  </button>
                )}
              </div>

              {isEditingPersonal ? (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label"><span className="label-text text-amber-700 font-bold uppercase text-xs">{t('gender')}</span></label>
                      <select
                        className="select select-bordered select-sm w-full"
                        value={editPersonalData.gender}
                        onChange={e => setEditPersonalData({ ...editPersonalData, gender: e.target.value })}
                      >
                        <option value="">—</option>
                        <option value="male">{t('male')}</option>
                        <option value="female">{t('female')}</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text text-amber-700 font-bold uppercase text-xs">{t('country')}</span></label>
                      <input type="text" className="input input-bordered input-sm w-full" value={editPersonalData.country} onChange={e => setEditPersonalData({ ...editPersonalData, country: e.target.value })} />
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text text-amber-700 font-bold uppercase text-xs">{t('region')}</span></label>
                      <input type="text" className="input input-bordered input-sm w-full" value={editPersonalData.region} onChange={e => setEditPersonalData({ ...editPersonalData, region: e.target.value })} />
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text text-amber-700 font-bold uppercase text-xs">{t('village')}</span></label>
                      <input type="text" className="input input-bordered input-sm w-full" value={editPersonalData.village2} onChange={e => setEditPersonalData({ ...editPersonalData, village2: e.target.value })} />
                    </div>
                    <div className="form-control">
                      <label className="label"><span className="label-text text-amber-700 font-bold uppercase text-xs">{t('village2')}</span></label>
                      <input type="text" className="input input-bordered input-sm w-full" value={editPersonalData.village} onChange={e => setEditPersonalData({ ...editPersonalData, village: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-sm btn-primary" onClick={handleSavePersonal}>Guardar</button>
                    <button className="btn btn-sm" onClick={() => setIsEditingPersonal(false)}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <InfoItem label={t('gender')} value={t(farmerData.gender)} />
                  <InfoItem label={t('country')} value={farmerData.country} />
                  <InfoItem label={t('region')} value={farmerData.region || farms?.region} />
                  <InfoItem label={t('village')} value={farmerData.village2 || farms?.village2} />
                  <InfoItem label={t('village2')} value={farmerData.village || farms?.village} />
                </div>
              )}
            </div>


            {/* Farm details */}
            {farms && (
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700">
                    {t('farm-details')}
                  </h2>
                  {isAdmin && !isEditingFarm && (
                    <button
                      className="btn btn-sm btn-outline btn-warning"
                      onClick={handleEditFarmClick}
                    >
                      Editar
                    </button>
                  )}
                </div>

                {isEditingFarm ? (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label"><span className="label-text text-amber-700 font-bold uppercase text-xs">{t('farm-name')}</span></label>
                        <input type="text" className="input input-bordered input-sm w-full" value={editFarmData.name} onChange={e => setEditFarmData({ ...editFarmData, name: e.target.value })} />
                      </div>
                      <div className="form-control">
                        <label className="label"><span className="label-text text-amber-700 font-bold uppercase text-xs">{t('height')} (msnm)</span></label>
                        <input type="text" className="input input-bordered input-sm w-full" value={editFarmData.height} onChange={e => setEditFarmData({ ...editFarmData, height: e.target.value })} />
                      </div>
                      <div className="form-control">
                        <label className="label"><span className="label-text text-amber-700 font-bold uppercase text-xs">{t('area')} (ha)</span></label>
                        <input type="text" className="input input-bordered input-sm w-full" value={editFarmData.area} onChange={e => setEditFarmData({ ...editFarmData, area: e.target.value })} />
                      </div>
                      <div className="form-control">
                        <label className="label"><span className="label-text text-amber-700 font-bold uppercase text-xs">{t('variety')}</span></label>
                        <input type="text" className="input input-bordered input-sm w-full" value={editFarmData.varieties} onChange={e => setEditFarmData({ ...editFarmData, varieties: e.target.value })} />
                      </div>
                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4 inline-flex mt-6">
                          <span className="label-text text-amber-700 font-bold uppercase text-xs">{t('shadow', 'Sombra')}</span>
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary toggle-sm" 
                            checked={!!editFarmData.shadow} 
                            onChange={e => setEditFarmData({ ...editFarmData, shadow: e.target.checked })} 
                          />
                        </label>
                      </div>
                      <div className="form-control">
                        <label className="label"><span className="label-text text-amber-700 font-bold uppercase text-xs">{t('family-members')}</span></label>
                        <input type="text" className="input input-bordered input-sm w-full" value={editFarmData.familyMembers} onChange={e => setEditFarmData({ ...editFarmData, familyMembers: e.target.value })} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-primary" onClick={handleSaveFarm}>Guardar</button>
                      <button className="btn btn-sm" onClick={() => setIsEditingFarm(false)}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <InfoItem label={t('farm-name')} value={farms.name || farms.bio || farmName} />
                    <InfoItem label={t('height')} value={farms.height ? `${farms.height} msnm` : undefined} />
                    <InfoItem label={t('area')} value={farms.area ? `${farms.area} ha` : undefined} />
                    <InfoItem label={t('variety')} value={farms.varieties} />
                    <InfoItem label={t('shadow')} value={farms.shadow} />
                    <InfoItem label={t('family-members')} value={farms.familyMembers} />
                  </div>
                )}
              </div>
            )}

            {/* Certifications */}
            {farms && (
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-amber-700">
                    {t('certificates')}
                  </h2>
                  {isAdmin && !isEditingCerts && (
                    <button
                      className="btn btn-sm btn-outline btn-warning"
                      onClick={handleEditClick}
                    >
                      Editar
                    </button>
                  )}
                </div>

                {isEditingCerts ? (
                  <div className="flex flex-col gap-4">
                    <Select
                      multiple
                      value={selectedCerts}
                      onChange={(e) => setSelectedCerts(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                      input={<OutlinedInput label={t('certifications')} />}
                      renderValue={(selected) => selected.join(', ')}
                      className="w-full max-w-sm"
                      displayEmpty
                    >
                      {Object.keys(CERT_ICONS).map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={selectedCerts.indexOf(name) > -1} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-primary" onClick={handleSaveCertifications}>Guardar</button>
                      <button className="btn btn-sm" onClick={() => setIsEditingCerts(false)}>Cancelar</button>
                    </div>
                  </div>
                ) : activeCerts.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {activeCerts.map(([name, cert]) => (
                      <div key={name} className="flex flex-col items-center gap-1">
                        <img src={cert.img} alt={name} className="h-16 w-16 object-contain" />
                        <span className="text-xs text-gray-500 text-center max-w-[72px] leading-tight">
                          {name}
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
