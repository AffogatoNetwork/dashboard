import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MaterialReactTable,
  MRT_ColumnDef,
} from 'material-react-table';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { MRT_Localization_DE } from 'material-react-table/locales/de';
import { MRT_Localization_FR } from 'material-react-table/locales/fr';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import QRCode from 'react-qr-code';
import ReactHTMLTableToExcel from 'react-html-table-to-xlsx';
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEdit,
  FaCertificate,
  FaDownload,
  FaShieldAlt,
  FaExternalLinkAlt,
  FaUserCheck,
  FaSyncAlt,
  FaSearch,
  FaUsers,
  FaLayerGroup,
  FaTable,
  FaThLarge,
} from 'react-icons/fa';
import {
  getAllFarmers,
  getAllFarmsByCompany,
  getCertifications,
  toggleFarmerCertification,
  updateFarmerCertifications,
  bulkUpdateFarmersCertifications,
  canEdit,
} from '../../db/firebase';
import { notifyUser, errorNotification } from '../../utils/utils';
import { LinkIcon } from '../icons/link';

// Fallback high-resolution logos for well-known standards
const CERT_FALLBACKS: Record<string, string> = {
  'Fairtrade': require('../../assets/certificaciones/2_Fair Trade.png'),
  'Comercio Justo': require('../../assets/certificaciones/2_Fair Trade.png'),
  'Fair Trade': require('../../assets/certificaciones/2_Fair Trade.png'),
  'Fairtrade USA': require('../../assets/certificaciones/2_Fair Trade.png'),
  'Orgánico': require('../../assets/certificaciones/1_USDA Organic.png'),
  'Organico': require('../../assets/certificaciones/1_USDA Organic.png'),
  'Organico USDA': require('../../assets/certificaciones/1_USDA Organic.png'),
  'USDA Organic': require('../../assets/certificaciones/1_USDA Organic.png'),
  'USDA': require('../../assets/certificaciones/1_USDA Organic.png'),
  'EU Orgánico': require('../../assets/certificaciones/10_EU Organic.png'),
  'Rainforest Alliance': require('../../assets/certificaciones/3_Rainforest Alliance.png'),
  'Rainforest': require('../../assets/certificaciones/3_Rainforest Alliance.png'),
  'Con Manos de Mujer': require('../../assets/certificaciones/5_ConManosdeMujer.png'),
  'Manos de Mujer': require('../../assets/certificaciones/5_ConManosdeMujer.png'),
  'ROC': require('../../assets/certificaciones/16_ROC.jpeg'),
  'Pequeños Productores': require('../../assets/certificaciones/7_Pequeños_Productores.png'),
  'SPP': require('../../assets/certificaciones/7_Pequeños_Productores.png'),
  'Bird Friendly': require('../../assets/certificaciones/15_Bird Friendly.png'),
  'C.A.F.E. Practices': require('../../assets/certificaciones/12_C.A.F.E. Practices.png'),
  'JAS': require('../../assets/certificaciones/13_JAS.png'),
  'Fair for Life': require('../../assets/certificaciones/14_Fair_Life.png'),
  'DO Marcala': require('../../assets/certificaciones/4_DO Marcala.png'),
};

export type ValidityStatus = 'valid' | 'renewal' | 'expired';

export interface CertDetail {
  name: string;
  imageUrl?: string;
  active?: boolean;
}

export interface FarmerRow {
  address: string;
  fullname: string;
  farmerId: string;
  gender: string;
  village: string;
  village2: string;
  region: string;
  country: string;
  farmName: string;
  area: number | string;
  qrCode: string;
  farmDocId?: string;
  // Normalized list of active certification names
  certList: string[];
  // Quick boolean map: certName -> true / false
  certMapStatus: Record<string, boolean>;
  certValidity: Record<string, { status: ValidityStatus; validUntil?: string; note?: string }>;
  raw: any;
}

// Normalize strings for matching
const normalizeCertName = (name: string): string =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

// Check if a certName is active in a list of certs
const checkCertActive = (certList: string[], certName: string): boolean => {
  const target = normalizeCertName(certName);
  return certList.some((c) => {
    const norm = normalizeCertName(c);
    if (norm === target) return true;
    if (target.includes('fairtrade') && (norm.includes('fairtrade') || norm.includes('comercio justo'))) {
      if (target.includes('usa') && !norm.includes('usa')) return false;
      return true;
    }
    if (target.includes('organico') && norm.includes('organico')) {
      if (target.includes('usda') && !norm.includes('usda')) return false;
      return true;
    }
    if (target.includes('manos') && norm.includes('manos')) return true;
    if (target.includes('rainforest') && norm.includes('rainforest')) return true;
    if (target === 'roc' && norm === 'roc') return true;
    if ((target.includes('spp') || target.includes('pequeno')) && (norm.includes('spp') || norm.includes('pequeno'))) return true;
    return false;
  });
};

export const CertificationsModule = () => {
  const saveSvgAsPng = require('save-svg-as-png');
  const { t, i18n } = useTranslation();
  const mrtLocale =
    ({
      es: MRT_Localization_ES,
      en: MRT_Localization_EN,
      de: MRT_Localization_DE,
      fr: MRT_Localization_FR,
    } as Record<string, any>)[i18n.language] ?? MRT_Localization_ES;

  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState<FarmerRow[]>([]);
  const [coopCertList, setCoopCertList] = useState<CertDetail[]>([]);
  const [certLogos, setCertLogos] = useState<Record<string, string>>(CERT_FALLBACKS);
  const [company, setCompany] = useState<string>('PROEXO');
  const [isAdmin, setIsAdmin] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null);

  // View Mode: 'matrix' (columns with true/false toggles) or 'badges' (compact badge view)
  const [viewMode, setViewMode] = useState<'matrix' | 'badges'>('matrix');

  // Filters
  const [selectedCertFilter, setSelectedCertFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // QR Modal
  const [qrModalData, setQrModalData] = useState<string | null>(null);
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);

  // Edit Modal for Single Farmer
  const [editingFarmer, setEditingFarmer] = useState<FarmerRow | null>(null);
  const [modalCerts, setModalCerts] = useState<string[]>([]);
  const [modalValidity, setModalValidity] = useState<
    Record<string, { status: ValidityStatus; validUntil?: string; note?: string }>
  >({});
  const [isSavingFarmer, setIsSavingFarmer] = useState(false);

  // Bulk Actions
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [bulkCert, setBulkCert] = useState<string>('');
  const [isBulkSaving, setIsBulkSaving] = useState(false);

  // Track toggling state per farmer + cert to prevent race conditions
  const [togglingKeys, setTogglingKeys] = useState<Record<string, boolean>>({});

  // Detect company from host
  const detectCompany = useCallback(() => {
    const url = window.location.host.toString().toLowerCase();
    if (url.includes('commovel')) return 'COMMOVEL';
    if (url.includes('copracnil')) return 'COPRACNIL';
    if (url.includes('comsa')) return 'COMSA';
    if (url.includes('proexo')) return 'PROEXO';
    if (url.includes('cafepsa')) return 'CAFEPSA';
    return 'PROEXO';
  }, []);

  // Check Admin permission
  const checkAdminStatus = useCallback(async (comp: string) => {
    try {
      const superAdmins = [
        'antonioalx66@gmail.com',
        'antonio@affogato.co',
        'robert@affogato.co',
      ];
      const emailStr = localStorage.getItem('email');
      if (!emailStr) {
        setIsAdmin(false);
        return;
      }
      let email = '';
      try {
        email = JSON.parse(emailStr);
      } catch {
        email = emailStr;
      }
      if (typeof email === 'string' && email.trim()) {
        const cleanEmail = email.trim().toLowerCase();
        if (superAdmins.includes(cleanEmail)) {
          setIsAdmin(true);
          return;
        }
        const permDocs = await canEdit(cleanEmail, comp);
        for (let i = 0; i < permDocs.length; i += 1) {
          const pdata = permDocs[i].data();
          if (pdata.user && Array.isArray(pdata.user) && pdata.user.includes(cleanEmail)) {
            setIsAdmin(true);
            return;
          }
        }
      }
      setIsAdmin(false);
    } catch {
      setIsAdmin(false);
    }
  }, []);

  // Main Data Loader
  const loadData = useCallback(async () => {
    setLoading(true);
    const comp = detectCompany();
    setCompany(comp);

    const userAddr = localStorage.getItem('address') || '';
    if (userAddr) setOwnerAddress(userAddr);

    await checkAdminStatus(comp);

    try {
      // 1. Fetch dynamic certifications created for this cooperative
      const dynamicLogos: Record<string, string> = { ...CERT_FALLBACKS };
      const fetchedCerts: CertDetail[] = [];
      try {
        const certDocs = await getCertifications(comp);
        certDocs.forEach((doc: any) => {
          const d = doc.data();
          if (d.certification) {
            const certName = d.certification.trim();
            fetchedCerts.push({
              name: certName,
              imageUrl: d.imageUrl,
              active: d.active !== false,
            });
            if (d.imageUrl) {
              dynamicLogos[certName] = d.imageUrl;
            }
          }
        });
      } catch (err) {
        console.warn('Error fetching dynamic certifications:', err);
      }

      // If database has specific certifications, prioritize them; also include any standard ones
      const defaultKnown = [
        'Orgánico',
        'Fairtrade',
        'Rainforest Alliance',
        'Con Manos de Mujer',
        'ROC',
      ];
      defaultKnown.forEach((name) => {
        if (!fetchedCerts.some((c) => normalizeCertName(c.name) === normalizeCertName(name))) {
          fetchedCerts.push({
            name,
            imageUrl: CERT_FALLBACKS[name],
            active: true,
          });
        }
      });

      setCoopCertList(fetchedCerts);
      setCertLogos(dynamicLogos);
      if (fetchedCerts.length > 0 && !bulkCert) {
        setBulkCert(fetchedCerts[0].name);
      }

      // 2. Fetch all farmers and farms for the cooperative
      const [farmersDocs, farmsDocs] = await Promise.all([
        getAllFarmers(comp),
        getAllFarmsByCompany(comp).catch(() => []),
      ]);

      // Group all farms by farmerAddress (handling multiple farms per farmer)
      const farmsByFarmer: Record<string, any[]> = {};
      farmsDocs.forEach((fDoc: any) => {
        const fdata = { ...fDoc.data(), _docId: fDoc.id };
        if (fdata.farmerAddress) {
          const lowerAddr = fdata.farmerAddress.toLowerCase();
          if (!farmsByFarmer[lowerAddr]) {
            farmsByFarmer[lowerAddr] = [];
          }
          farmsByFarmer[lowerAddr].push(fdata);
        }
        // Also map direct doc ID if it's an address
        const directId = fDoc.id.toLowerCase();
        if (directId.startsWith('0x')) {
          if (!farmsByFarmer[directId]) {
            farmsByFarmer[directId] = [];
          }
          if (!farmsByFarmer[directId].some((f) => f._docId === fDoc.id)) {
            farmsByFarmer[directId].push(fdata);
          }
        }
      });

      // 3. Build FarmerRow list
      const rows: FarmerRow[] = [];
      farmersDocs.forEach((fDoc: any) => {
        const d = fDoc.data();
        const address = d.address || fDoc.id;
        const lowerAddr = address.toLowerCase();
        const farmerFarms = farmsByFarmer[lowerAddr] || [];

        // Parse certifications from ALL related farms and farmer document
        const certSet = new Set<string>();

        const extractCerts = (field: any) => {
          if (!field) return;
          if (Array.isArray(field)) {
            field.forEach((item) => typeof item === 'string' && item.trim() && certSet.add(item.trim()));
          } else if (typeof field === 'string') {
            field.split(',').forEach((item) => item.trim() && certSet.add(item.trim()));
          } else if (typeof field === 'object') {
            Object.keys(field).forEach((k) => field[k] && certSet.add(k.trim()));
          }
        };

        // Extract certs across ALL farms of this farmer
        // If one farm has "" and another has certifications, this collects all of them!
        let primaryFarm: any = null;
        farmerFarms.forEach((farm) => {
          extractCerts(farm.certifications);
          if (!primaryFarm) {
            primaryFarm = farm;
          } else if (farm.certifications && !primaryFarm.certifications) {
            primaryFarm = farm;
          }
        });

        // Certifications from farmer document
        extractCerts(d.certifications);
        extractCerts(d.certList);

        // Legacy numeric flags
        if (d.usda === 1) certSet.add('Orgánico');
        if (d.fairtrade === 1) certSet.add('Fairtrade');
        if (d.manosdemujer === 1) certSet.add('Con Manos de Mujer');
        if (d.spp === 1) certSet.add('Pequeños Productores');
        if (d.roc === 1) certSet.add('ROC');

        const certList = Array.from(certSet);

        // Build boolean map for each certification in coopCertList
        const certMapStatus: Record<string, boolean> = {};
        fetchedCerts.forEach((c) => {
          certMapStatus[c.name] = checkCertActive(certList, c.name);
        });

        // Build validity map from all farms or farmer
        let storedValidity: any = { ...(d.certValidity || {}) };
        farmerFarms.forEach((f) => {
          if (f.certValidity) {
            storedValidity = { ...storedValidity, ...f.certValidity };
          }
        });

        const certValidity: Record<
          string,
          { status: ValidityStatus; validUntil?: string; note?: string }
        > = {};

        certList.forEach((cert) => {
          certValidity[cert] = storedValidity[cert] || { status: 'valid', validUntil: '' };
        });

        // Calculate farm name and area from multiple farms
        let farmName = d.farm || '—';
        if (farmerFarms.length > 0) {
          const namesWithCerts = farmerFarms.filter((f) => f.certifications && f.name).map((f) => f.name);
          if (namesWithCerts.length > 0) {
            farmName = Array.from(new Set(namesWithCerts)).join(', ');
          } else if (primaryFarm?.name) {
            farmName = primaryFarm.name;
          } else {
            farmName = farmerFarms.map((f) => f.name).filter(Boolean).join(', ') || '—';
          }
        }

        let areaVal: number | string = d.area || primaryFarm?.area || '—';
        let totalFarmArea = 0;
        let hasValidArea = false;
        farmerFarms.forEach((f) => {
          const parsed = parseFloat(String(f.area || '').trim());
          if (!isNaN(parsed) && parsed > 0) {
            totalFarmArea += parsed;
            hasValidArea = true;
          }
        });
        if (hasValidArea) {
          areaVal = Math.round(totalFarmArea * 100) / 100;
        }

        const qrCode = `${window.location.origin}/farmer/${address}`;

        rows.push({
          address,
          fullname: d.fullname || primaryFarm?.fullname || 'Sin Nombre',
          farmerId: d.farmerId || primaryFarm?.farmerId || '',
          gender: d.gender || primaryFarm?.gender || '',
          village: primaryFarm?.village || d.village || '',
          village2: primaryFarm?.village2 || d.village2 || '',
          region: primaryFarm?.region || d.region || '',
          country: primaryFarm?.country || d.country || 'Honduras',
          farmName,
          area: areaVal,
          qrCode,
          farmDocId: primaryFarm?._docId || address,
          certList,
          certMapStatus,
          certValidity,
          raw: d,
        });
      });

      setFarmers(rows);
    } catch (err) {
      console.error('Error loading certifications module data:', err);
      errorNotification('Error al cargar datos de certificaciones');
    } finally {
      setLoading(false);
    }
  }, [detectCompany, checkAdminStatus, bulkCert]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Quick Toggle for Admin (True / False switch) ────────────────────
  const handleToggleCertValue = async (
    farmer: FarmerRow,
    certName: string,
    newValue: boolean
  ) => {
    if (!isAdmin) return;
    const toggleKey = `${farmer.address}_${certName}`;
    setTogglingKeys((prev) => ({ ...prev, [toggleKey]: true }));

    // Optimistic UI update
    setFarmers((prev) =>
      prev.map((f) => {
        if (f.address === farmer.address) {
          const updatedMap = { ...f.certMapStatus, [certName]: newValue };
          let updatedList = [...f.certList];
          if (newValue) {
            if (!updatedList.includes(certName)) updatedList.push(certName);
          } else {
            updatedList = updatedList.filter((c) => normalizeCertName(c) !== normalizeCertName(certName));
          }
          return { ...f, certMapStatus: updatedMap, certList: updatedList };
        }
        return f;
      })
    );

    try {
      await toggleFarmerCertification(farmer.address, certName, newValue);
      notifyUser(
        `${certName}: ${newValue ? 'ACTIVADA (true)' : 'DESACTIVADA (false)'} para ${farmer.fullname}`
      );
    } catch (err: any) {
      errorNotification(err?.message || 'Error al actualizar certificación');
      // Revert on error
      loadData();
    } finally {
      setTogglingKeys((prev) => {
        const copy = { ...prev };
        delete copy[toggleKey];
        return copy;
      });
    }
  };

  // Open Edit Modal for Single Farmer
  const handleOpenEdit = (farmer: FarmerRow) => {
    setEditingFarmer(farmer);
    setModalCerts([...farmer.certList]);
    setModalValidity({ ...farmer.certValidity });
  };

  // Toggle certification in modal
  const handleModalToggleCert = (certName: string) => {
    if (modalCerts.some((c) => normalizeCertName(c) === normalizeCertName(certName))) {
      setModalCerts(modalCerts.filter((c) => normalizeCertName(c) !== normalizeCertName(certName)));
    } else {
      setModalCerts([...modalCerts, certName]);
      if (!modalValidity[certName]) {
        setModalValidity({
          ...modalValidity,
          [certName]: { status: 'valid', validUntil: '' },
        });
      }
    }
  };

  // Update validity status in modal
  const handleModalValidityChange = (
    certName: string,
    field: 'status' | 'validUntil' | 'note',
    value: string
  ) => {
    const current = modalValidity[certName] || { status: 'valid', validUntil: '', note: '' };
    setModalValidity({
      ...modalValidity,
      [certName]: {
        ...current,
        [field]: value,
      },
    });
  };

  // Save Farmer Certifications from Modal
  const handleSaveFarmer = async () => {
    if (!editingFarmer) return;
    setIsSavingFarmer(true);
    try {
      await updateFarmerCertifications(editingFarmer.address, modalCerts, modalValidity);
      notifyUser(`Certificaciones guardadas para ${editingFarmer.fullname}`);

      // Optimistic update in state
      setFarmers((prev) =>
        prev.map((f) => {
          if (f.address === editingFarmer.address) {
            const updatedMap: Record<string, boolean> = {};
            coopCertList.forEach((c) => {
              updatedMap[c.name] = checkCertActive(modalCerts, c.name);
            });
            return {
              ...f,
              certList: modalCerts,
              certMapStatus: updatedMap,
              certValidity: modalValidity,
            };
          }
          return f;
        })
      );
      setEditingFarmer(null);
    } catch (err: any) {
      errorNotification(err?.message || 'Error al guardar certificaciones');
    } finally {
      setIsSavingFarmer(false);
    }
  };

  // Bulk Apply Action
  const handleBulkApply = async (action: 'add' | 'remove') => {
    const selectedIndices = Object.keys(rowSelection).filter((k) => rowSelection[k]);
    if (selectedIndices.length === 0) {
      errorNotification('Selecciona al menos un productor');
      return;
    }
    if (!bulkCert) {
      errorNotification('Selecciona una certificación');
      return;
    }

    const selectedAddresses = selectedIndices
      .map((idx) => filteredFarmers[parseInt(idx, 10)]?.address)
      .filter(Boolean);

    if (selectedAddresses.length === 0) return;

    setIsBulkSaving(true);
    try {
      await bulkUpdateFarmersCertifications(selectedAddresses, action, bulkCert);
      notifyUser(
        `Actualizados ${selectedAddresses.length} productores (${action === 'add' ? 'Asignada' : 'Removida'} ${bulkCert})`
      );
      setRowSelection({});
      await loadData();
    } catch (err: any) {
      errorNotification(err?.message || 'Error en actualización masiva');
    } finally {
      setIsBulkSaving(false);
    }
  };

  // QR Downloader
  const handleDownloadQr = () => {
    saveSvgAsPng.saveSvgAsPng(document.getElementById('qr-farmer-code'), 'qr-certificado', {
      scale: 10,
      backgroundColor: 'white',
    });
  };

  const getStatusBadge = (status?: ValidityStatus) => {
    if (status === 'renewal') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
          <FaClock className="h-2.5 w-2.5 text-amber-600" /> Renovación
        </span>
      );
    }
    if (status === 'expired') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-800">
          <FaTimesCircle className="h-2.5 w-2.5 text-red-600" /> Vencida
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
        <FaCheckCircle className="h-2.5 w-2.5 text-emerald-600" /> Vigente
      </span>
    );
  };

  // Metrics
  const totalFarmers = farmers.length;
  const certifiedFarmersCount = useMemo(
    () => farmers.filter((f) => f.certList.length > 0).length,
    [farmers]
  );
  const totalArea = useMemo(() => {
    let sum = 0;
    farmers.forEach((f) => {
      const parsed = parseFloat(String(f.area));
      if (!isNaN(parsed)) sum += parsed;
    });
    return Math.round(sum * 100) / 100;
  }, [farmers]);

  const certCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    coopCertList.forEach((c) => {
      counts[c.name] = 0;
    });
    farmers.forEach((f) => {
      coopCertList.forEach((c) => {
        if (f.certMapStatus[c.name]) {
          counts[c.name] = (counts[c.name] || 0) + 1;
        }
      });
    });
    return counts;
  }, [coopCertList, farmers]);

  // Filtered farmers
  const filteredFarmers = useMemo(() => {
    return farmers.filter((f) => {
      if (globalSearch.trim()) {
        const query = globalSearch.toLowerCase();
        const matchName = f.fullname.toLowerCase().includes(query);
        const matchVillage = f.village.toLowerCase().includes(query);
        const matchVillage2 = f.village2.toLowerCase().includes(query);
        const matchFarm = f.farmName.toLowerCase().includes(query);
        const matchAddr = f.address.toLowerCase().includes(query);
        if (!matchName && !matchVillage && !matchVillage2 && !matchFarm && !matchAddr) {
          return false;
        }
      }

      if (selectedCertFilter !== 'all') {
        if (!f.certMapStatus[selectedCertFilter]) return false;
      }

      if (selectedStatusFilter !== 'all') {
        if (selectedStatusFilter === 'certified') {
          if (f.certList.length === 0) return false;
        } else if (selectedStatusFilter === 'uncertified') {
          if (f.certList.length > 0) return false;
        }
      }

      return true;
    });
  }, [farmers, globalSearch, selectedCertFilter, selectedStatusFilter]);

  // ── Dynamic Table Columns (True/False Matrix & Badges) ─────────────
  const columns = useMemo<MRT_ColumnDef<FarmerRow>[]>(() => {
    const baseCols: MRT_ColumnDef<FarmerRow>[] = [
      {
        accessorKey: 'fullname',
        header: t('tables.name-farmer') || 'Productor',
        size: 200,
        Cell: ({ row }) => {
          const f = row.original;
          return (
            <div className="flex flex-col py-0.5">
              <span className="font-bold text-gray-900 text-sm">{f.fullname}</span>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                {f.farmName && f.farmName !== '—' && (
                  <span className="bg-amber-50 text-amber-900 px-1.5 py-0.2 rounded border border-amber-200">
                    🏡 {f.farmName}
                  </span>
                )}
                {f.gender && <span>({f.gender})</span>}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'village',
        header: 'Comunidad',
        size: 140,
        Cell: ({ row }) => {
          const f = row.original;
          return (
            <div className="text-xs text-gray-700">
              <div className="font-medium text-gray-900">{f.village || '—'}</div>
              <div className="text-gray-500 text-[11px]">{f.village2 || f.region || ''}</div>
            </div>
          );
        },
      },
      {
        accessorKey: 'area',
        header: 'Área (Ha)',
        size: 85,
        Cell: ({ cell }) => (
          <div className="font-semibold text-center text-xs text-gray-800">
            {cell.getValue() !== '—' ? `${cell.getValue()} Ha` : '—'}
          </div>
        ),
      },
    ];

    // If Matrix View: render individual columns for each cooperative certification
    if (viewMode === 'matrix') {
      coopCertList.forEach((cert) => {
        const img = certLogos[cert.name] || cert.imageUrl;
        baseCols.push({
          id: `cert_${cert.name}`,
          header: cert.name,
          size: 110,
          Header: () => (
            <div className="flex flex-col items-center justify-center p-1 text-center min-w-[70px]">
              {img ? (
                <img
                  src={img}
                  alt={cert.name}
                  className="w-7 h-7 object-contain mb-1 rounded shadow-xs"
                />
              ) : (
                <FaCertificate className="w-5 h-5 text-amber-600 mb-1" />
              )}
              <span className="text-[11px] font-bold leading-tight line-clamp-2 max-w-[80px]">
                {cert.name}
              </span>
            </div>
          ),
          Cell: ({ row }) => {
            const f = row.original;
            const isCertActive = Boolean(f.certMapStatus[cert.name]);
            const toggleKey = `${f.address}_${cert.name}`;
            const isToggling = Boolean(togglingKeys[toggleKey]);

            // If Admin: show interactive true/false toggle switch
            if (isAdmin) {
              return (
                <div className="flex flex-col items-center justify-center py-1">
                  <input
                    type="checkbox"
                    className={`toggle toggle-sm ${isCertActive ? 'toggle-success bg-emerald-600' : 'bg-gray-300'
                      }`}
                    checked={isCertActive}
                    disabled={isToggling}
                    onChange={(e) => handleToggleCertValue(f, cert.name, e.target.checked)}
                    title={`${cert.name}: ${isCertActive ? 'Activo (true)' : 'Inactivo (false)'} - Clic para cambiar`}
                  />
                  <span
                    className={`text-[10px] font-bold mt-1 ${isCertActive ? 'text-emerald-700' : 'text-gray-400'
                      }`}
                  >
                    {isCertActive ? 'true' : 'false'}
                  </span>
                </div>
              );
            }

            // If Public: display clean checkmark badge if true, or dash if false
            return (
              <div className="flex justify-center items-center py-1">
                {isCertActive ? (
                  <span
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-xs"
                    title={`${cert.name}: Certificado`}
                  >
                    <FaCheckCircle className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="text-gray-300 text-base font-light select-none">—</span>
                )}
              </div>
            );
          },
        });
      });
    } else {
      // Badges View Mode
      baseCols.push({
        id: 'certifications_badges',
        header: 'Certificaciones Activas',
        size: 320,
        Cell: ({ row }) => {
          const f = row.original;
          if (!f.certList || f.certList.length === 0) {
            return (
              <span className="text-xs italic text-gray-400 bg-gray-50 px-2 py-1 rounded border border-dashed border-gray-200">
                Sin certificaciones
              </span>
            );
          }

          return (
            <div className="flex flex-wrap gap-1.5 py-1">
              {f.certList.map((cert) => {
                const img = certLogos[cert] || CERT_FALLBACKS[cert];
                const detail = f.certValidity[cert] || { status: 'valid' };
                return (
                  <div
                    key={cert}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-medium bg-emerald-50 border-emerald-200 text-emerald-900"
                  >
                    {img ? (
                      <img src={img} alt={cert} className="w-4 h-4 object-contain rounded-xs" />
                    ) : (
                      <FaCertificate className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span className="font-semibold">{cert}</span>
                    {getStatusBadge(detail.status)}
                  </div>
                );
              })}
            </div>
          );
        },
      });
    }

    // Actions Column
    baseCols.push({
      id: 'actions',
      header: 'Acciones',
      size: 110,
      enableSorting: false,
      Cell: ({ row }) => {
        const f = row.original;
        return (
          <div className="flex items-center gap-1">
            <Tooltip title="Ver perfil público">
              <button
                onClick={() => window.open(`/farmer/${f.address}`, '_blank')}
                className="btn btn-ghost btn-xs text-amber-700 hover:bg-amber-50"
              >
                <FaExternalLinkAlt className="w-3.5 h-3.5" />
              </button>
            </Tooltip>

            <Tooltip title="Código QR">
              <button
                onClick={() => {
                  setQrModalData(f.qrCode);
                  setQrModalUrl(`/farmer/${f.address}`);
                }}
                className="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50"
              >
                <FaShieldAlt className="w-3.5 h-3.5" />
              </button>
            </Tooltip>

            {isAdmin && (
              <Tooltip title="Editar detalles de vigencia">
                <button
                  onClick={() => handleOpenEdit(f)}
                  className="btn btn-ghost btn-xs text-gray-700 hover:bg-gray-100"
                >
                  <FaEdit className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            )}
          </div>
        );
      },
    });

    return baseCols;
  }, [viewMode, coopCertList, certLogos, isAdmin, togglingKeys, t]);

  const selectedCount = Object.keys(rowSelection).filter((k) => rowSelection[k]).length;

  return (
    <div className="w-full max-w-[2460px] mx-auto p-2 sm:p-6 space-y-6">


      {/* ── Certifications Filter Pills ─────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {t('certifications-filter.coop-standards') || 'Normas de la Cooperativa'} ({coopCertList.length}):
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('matrix')}
              className={`btn btn-xs gap-1.5 font-bold ${viewMode === 'matrix' ? 'btn-primary text-white shadow-xs' : 'btn-ghost text-gray-600'
                }`}
            >
              <FaTable /> {t('certifications-filter.matrix-view') || 'Matriz'}
            </button>
            <button
              onClick={() => setViewMode('badges')}
              className={`btn btn-xs gap-1.5 font-bold ${viewMode === 'badges' ? 'btn-primary text-white shadow-xs' : 'btn-ghost text-gray-600'
                }`}
            >
              <FaThLarge /> {t('certifications-filter.compact-view') || 'Vista Compacta'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCertFilter('all')}
            className={`btn btn-xs rounded-full px-3 font-semibold transition-all ${selectedCertFilter === 'all'
              ? 'btn-neutral text-white shadow-sm'
              : 'btn-ghost bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {t('certifications-filter.all-standards') || 'Todas'} ({totalFarmers})
          </button>
          {coopCertList.map((c) => {
            const count = certCounts[c.name] || 0;
            const img = certLogos[c.name] || c.imageUrl;
            const isSelected = selectedCertFilter === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setSelectedCertFilter(isSelected ? 'all' : c.name)}
                className={`btn btn-xs rounded-full px-3 gap-1.5 font-medium transition-all ${isSelected
                  ? 'btn-accent text-white shadow-sm'
                  : 'btn-ghost bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                  }`}
              >
                {img ? (
                  <img src={img} alt={c.name} className="w-3.5 h-3.5 object-contain" />
                ) : (
                  <FaCertificate className="w-3 h-3 text-amber-600" />
                )}
                <span>{c.name}</span>
                <span className="badge badge-xs bg-white text-gray-800 border-none font-bold">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Search & Filter Controls ─────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3.5 top-3 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={t('certifications-filter.search-placeholder') || 'Buscar por productor, finca, comunidad...'}
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="input input-bordered input-sm w-full pl-9 pr-4 rounded-lg text-sm focus:outline-amber-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">
              {t('certifications-filter.filter-by') || 'Filtrar:'}
            </span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="select select-bordered select-sm text-xs rounded-lg font-medium"
            >
              <option value="all">
                {t('certifications-filter.all') || 'Todos los productores'}
              </option>
              <option value="certified">
                {t('certifications-filter.certified') || 'Con certificaciones'}
              </option>
              <option value="uncertified">
                {t('certifications-filter.uncertified') || 'Sin certificaciones'}
              </option>
            </select>
          </div>

          <span className="text-xs text-gray-400">
            {t('certifications-filter.showing', { count: filteredFarmers.length, total: totalFarmers }) ||
              `Mostrando ${filteredFarmers.length} de ${totalFarmers}`}
          </span>
        </div>
      </div>

      {/* ── Bulk Actions Bar (Admin Only) ────────────────────────────── */}
      {isAdmin && selectedCount > 0 && (
        <div className="sticky top-4 z-40 bg-gray-900/95 backdrop-blur-md text-white border border-gray-700 shadow-2xl rounded-2xl p-4 transition-all animate-in fade-in">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="bg-amber-500 text-black px-2.5 py-0.5 rounded-full text-xs font-black">
                {selectedCount}
              </span>
              <span className="text-sm font-semibold">
                {t('certifications-filter.selected-producers') || 'Productores seleccionados'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={bulkCert}
                onChange={(e) => setBulkCert(e.target.value)}
                className="select select-sm bg-gray-800 border-gray-600 text-white text-xs rounded-lg"
              >
                {coopCertList.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleBulkApply('add')}
                disabled={isBulkSaving}
                className="btn btn-sm bg-emerald-600 hover:bg-emerald-500 text-white border-none text-xs gap-1.5 font-bold"
              >
                <FaCheckCircle /> {t('certifications-filter.activate') || 'Activar (true)'}
              </button>

              <button
                onClick={() => handleBulkApply('remove')}
                disabled={isBulkSaving}
                className="btn btn-sm bg-red-600/80 hover:bg-red-600 text-white border-none text-xs gap-1.5"
              >
                <FaTimesCircle /> {t('certifications-filter.deactivate') || 'Desactivar (false)'}
              </button>

              <button
                onClick={() => setRowSelection({})}
                className="btn btn-sm btn-ghost text-gray-300 hover:bg-gray-800 text-xs"
              >
                {t('certifications-filter.cancel') || 'Cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main MaterialReactTable ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <MaterialReactTable
          columns={columns}
          data={filteredFarmers}
          enableRowSelection={isAdmin}
          onRowSelectionChange={setRowSelection}
          state={{
            rowSelection,
            isLoading: loading,
          }}
          enableHiding={false}
          enableDensityToggle={false}
          enableFullScreenToggle={false}
          enableColumnActions={false}
          enableFilters={false}
          localization={mrtLocale}
          initialState={{
            sorting: [{ id: 'fullname', desc: false }],
            pagination: { pageSize: 25, pageIndex: 0 },
          }}
          muiTablePaperProps={{
            elevation: 0,
            sx: { borderRadius: '1rem', border: 'none' },
          }}
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: '#f8fafc',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: '#475569',
              padding: '10px 12px',
            },
          }}
          muiTableBodyCellProps={{
            sx: {
              padding: '8px 12px',
            },
          }}
        />
      </div>

      {/* Hidden table for Excel export */}
      <table id="farmers-cert-export-table" className="hidden">
        <thead>
          <tr>
            <th>Productor</th>
            <th>Finca</th>
            <th>Comunidad</th>
            <th>Municipio</th>
            <th>Área</th>
            <th>Certificaciones</th>
            {coopCertList.map((c) => (
              <th key={c.name}>{c.name}</th>
            ))}
            <th>Dirección</th>
          </tr>
        </thead>
        <tbody>
          {filteredFarmers.map((f) => (
            <tr key={f.address}>
              <td>{f.fullname}</td>
              <td>{f.farmName}</td>
              <td>{f.village}</td>
              <td>{f.village2}</td>
              <td>{f.area}</td>
              <td>{f.certList.join(', ')}</td>
              {coopCertList.map((c) => (
                <td key={c.name}>{f.certMapStatus[c.name] ? 'SI' : 'NO'}</td>
              ))}
              <td>{f.address}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Edit Modal for Single Farmer ─────────────────────────────── */}
      <Dialog
        open={Boolean(editingFarmer)}
        onClose={() => !isSavingFarmer && setEditingFarmer(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="bg-amber-900 text-white">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-wider text-amber-200 font-semibold">
                Certificaciones de la Finca (/farms/{editingFarmer?.address?.slice(0, 10)}...)
              </div>
              <h2 className="text-xl font-bold">{editingFarmer?.fullname}</h2>
              <div className="text-xs text-amber-100/80">
                🏡 Finca: {editingFarmer?.farmName || '—'} • 📍 {editingFarmer?.village},{' '}
                {editingFarmer?.village2}
              </div>
            </div>
            <button
              onClick={() => setEditingFarmer(null)}
              disabled={isSavingFarmer}
              className="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/20"
            >
              ✕
            </button>
          </div>
        </DialogTitle>

        <DialogContent dividers className="space-y-4 p-6 bg-gray-50/50">
          <p className="text-xs text-gray-500 mb-2">
            Activa (<span className="text-emerald-700 font-semibold">true</span>) o desactiva (
            <span className="text-gray-500 font-semibold">false</span>) cada certificación. Al guardar se
            actualiza directamente el campo <code className="bg-gray-200 px-1 rounded">certifications</code>{' '}
            en la finca y productor asociado.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {coopCertList.map((cert) => {
              const isChecked = modalCerts.some(
                (c) => normalizeCertName(c) === normalizeCertName(cert.name)
              );
              const detail = modalValidity[cert.name] || { status: 'valid', validUntil: '', note: '' };
              const img = certLogos[cert.name] || cert.imageUrl;

              return (
                <div
                  key={cert.name}
                  className={`p-3.5 rounded-xl border transition-all ${isChecked
                    ? 'bg-white border-amber-300 shadow-sm ring-1 ring-amber-400/30'
                    : 'bg-white/60 border-gray-200 opacity-75'
                    }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {img ? (
                        <img
                          src={img}
                          alt={cert.name}
                          className="w-8 h-8 object-contain rounded"
                        />
                      ) : (
                        <FaCertificate className="w-6 h-6 text-amber-600" />
                      )}
                      <div>
                        <div className="font-bold text-sm text-gray-900">{cert.name}</div>
                        <div className="text-[11px] text-gray-500">
                          {isChecked ? 'true (Activa)' : 'false (Inactiva)'}
                        </div>
                      </div>
                    </div>

                    <Switch
                      checked={isChecked}
                      onChange={() => handleModalToggleCert(cert.name)}
                      color="warning"
                    />
                  </div>

                  {isChecked && (
                    <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Vigencia:
                        </label>
                        <Select
                          size="small"
                          fullWidth
                          value={detail.status || 'valid'}
                          onChange={(e) =>
                            handleModalValidityChange(cert.name, 'status', e.target.value)
                          }
                          sx={{ fontSize: '0.75rem', height: '32px' }}
                        >
                          <MenuItem value="valid" sx={{ fontSize: '0.75rem' }}>
                            🟢 Vigente
                          </MenuItem>
                          <MenuItem value="renewal" sx={{ fontSize: '0.75rem' }}>
                            🟡 En Renovación
                          </MenuItem>
                          <MenuItem value="expired" sx={{ fontSize: '0.75rem' }}>
                            🔴 Vencida
                          </MenuItem>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Ciclo / Año:
                        </label>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Ej. 2026/2027"
                          value={detail.validUntil || ''}
                          onChange={(e) =>
                            handleModalValidityChange(cert.name, 'validUntil', e.target.value)
                          }
                          inputProps={{ style: { fontSize: '0.75rem', height: '14px' } }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </DialogContent>

        <DialogActions className="p-4 bg-gray-50 border-t border-gray-200">
          <Button
            onClick={() => setEditingFarmer(null)}
            disabled={isSavingFarmer}
            color="inherit"
            sx={{ fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveFarmer}
            disabled={isSavingFarmer}
            variant="contained"
            sx={{
              backgroundColor: '#b45309',
              '&:hover': { backgroundColor: '#92400e' },
              fontWeight: 700,
              textTransform: 'none',
              px: 3,
            }}
          >
            {isSavingFarmer ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── QR Code Modal ────────────────────────────────────────────── */}
      {qrModalData && (
        <div className="modal modal-open">
          <div className="modal-box relative max-w-sm text-center">
            <button
              onClick={() => setQrModalData(null)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-2">Código QR del Productor</h3>
            <p className="text-xs text-gray-500 mb-4">
              Escanea para verificar el perfil y certificaciones en blockchain.
            </p>

            <div className="flex justify-center p-4 bg-white rounded-xl border border-gray-200 shadow-inner">
              <QRCode value={qrModalData} size={220} id="qr-farmer-code" />
            </div>

            <div className="flex justify-center gap-3 mt-5">
              <button
                onClick={handleDownloadQr}
                className="btn btn-sm btn-outline gap-2 font-semibold"
              >
                <FaDownload /> Descargar QR
              </button>
              {qrModalUrl && (
                <button
                  onClick={() => window.open(qrModalUrl, '_blank')}
                  className="btn btn-sm bg-amber-700 hover:bg-amber-800 text-white gap-2 font-semibold"
                >
                  <LinkIcon /> Abrir Perfil
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
