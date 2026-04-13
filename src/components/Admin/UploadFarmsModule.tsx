import React, { useCallback, useEffect, useState } from 'react';
import { ExcelRenderer } from 'react-excel-renderer';
import { useDropzone } from 'react-dropzone';
import { FaSearchPlus, FaTimes, FaDownload } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { saveFarms } from '../../db/firebase';
import { getCompanyName, getCompanyAddressesByHost } from '../../utils/utils';
import { FarmType } from '../common/types';
import Loading from '../Loading';

/**
 * Excel column layout (0-indexed). Rows 0–1 are headers; data starts at row 2.
 *   0  Dirección (0x)      → farmerAddress
 *   1  Código              → farmerId
 *   6  Latitud
 *   7  Longitud
 *   8  Departamento        → region
 *   9  Municipio           → village2
 *  10  Comunidad           → village
 *  11  Superficie (Ha.)    → area
 *  12  Nombre Finca        → name
 *  13  Altura (msnm)       → height
 *  14  Variedad            → varieties
 *  15  Comercio Justo      → cert X (Fairtrade)
 *  16  Orgánico            → cert X
 *  17  Rainforest Alliance → cert X
 *  18  Con Manos de Mujer  → cert X
 *  19  ROC                 → cert X
 */

const CERT_NAMES = ['Fairtrade', 'Orgánico', 'Rainforest Alliance', 'Con Manos de Mujer', 'ROC'];

// ── Inner dropzone component — keyed by parent so it fully re-mounts on clear ─
interface DropzoneAreaProps {
  onFile: (file: File) => void;
  t: (key: string, opts?: any) => string;
}

const DropzoneArea = ({ onFile, t }: DropzoneAreaProps) => {
  const [fileName, setFileName] = useState('');

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) {
      setFileName(accepted[0].name);
      onFile(accepted[0]);
    }
  }, [onFile]);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
    maxFiles: 1,
  });

  if (fileName) {
    return (
      <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
        <span className="flex-1 text-sm font-medium">{fileName}</span>
      </div>
    );
  }

  return (
    <>
      <div {...getRootProps({ className: 'border-2 border-dashed border-base-300 rounded-lg p-10 text-center cursor-pointer hover:border-primary transition-colors' })}>
        <input {...getInputProps()} />
        <FaSearchPlus className="mx-auto text-3xl text-base-300 mb-2" />
        <p className="text-base-content/60">{t('create-batches.drag-drop')}</p>
        <p className="text-xs text-base-content/40 mt-1">.xlsx</p>
      </div>
      {fileRejections.length > 0 && (
        <div className="alert alert-error mt-2 text-sm">
          {t('errors.file-invalid-type', { name: fileRejections[0].file.name })}
        </div>
      )}
    </>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

export const UploadFarmsModule = () => {
  const { t } = useTranslation();
  const [parsed, setParsed] = useState<FarmType[]>([]);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [companyName, setCompanyName] = useState('PROEXO');
  const [dropKey, setDropKey] = useState(0);

  useEffect(() => {
    const address = getCompanyAddressesByHost(window.location.host)[0];
    setCompanyName(getCompanyName(address));
  }, []);

  const handleFile = useCallback((file: File) => {
    setDone(false);
    setError('');
    ExcelRenderer(file, (err: any, resp: any) => {
      if (err) {
        setError(t('errors.file-load-failed', { name: file.name }));
        return;
      }
      const rawRows: any[] = resp.rows;
      const farms: FarmType[] = [];

      for (let i = 2; i < rawRows.length; i++) {
        const r = rawRows[i];
        if (!r || r.length === 0) continue;
        const address = String(r[0] || '').trim();
        const farmName = String(r[12] || '').trim();
        if (!address || !farmName) continue;

        const isX = (col: number) => String(r[col] || '').trim().toUpperCase() === 'X';

        farms.push({
          farmerAddress: address,
          farmerId: String(r[1] || '').trim(),
          company: companyName,
          name: farmName,
          height: String(r[13] || ''),
          area: String(r[11] || ''),
          certifications: CERT_NAMES.filter((_, idx) => isX(15 + idx)).join(', '),
          latitude: String(r[6] || ''),
          longitude: String(r[7] || ''),
          bio: '',
          country: '',
          region: String(r[8] || ''),
          village2: String(r[9] || ''),
          village: String(r[10] || ''),
          varieties: String(r[14] || ''),
          shadow: '',
          familyMembers: '',
          ethnicGroup: '',
        });
      }
      setParsed(farms);
    });
  }, [companyName, t]);

  const clearFiles = () => {
    setParsed([]);
    setDone(false);
    setError('');
    setDropKey(k => k + 1); // forces DropzoneArea to re-mount, resetting its state
  };

  const handleUpload = async () => {
    if (parsed.length === 0) return;
    setSaving(true);
    setError('');
    try {
      await saveFarms(parsed);
      setDone(true);
    } catch (e: any) {
      setError(e?.message || t('errors.missing-data'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{t('upload-farms.title')}</h2>
        <a
          href="/proexo-farms-template.xlsx"
          download
          className="btn btn-sm btn-outline gap-2"
        >
          <FaDownload /> {t('upload-farms.download-template')}
        </a>
      </div>

      {saving ? (
        <Loading label={t('upload-farms.saving')} className="loading-wrapper" />
      ) : done ? (
        <div className="alert alert-success">
          <span>{t('upload-farms.success', { count: parsed.length })}</span>
          <button className="btn btn-sm ml-4" onClick={clearFiles}>
            {t('upload-farms.upload-another')}
          </button>
        </div>
      ) : (
        <>
          {/* key forces full re-mount of DropzoneArea (including its useDropzone) on clear */}
          <DropzoneArea key={dropKey} onFile={handleFile} t={t as any} />

          {error && <div className="alert alert-error mt-2 text-sm">{error}</div>}

          {parsed.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">
                {t('upload-farms.preview', { count: parsed.length })}
              </p>
              <div className="overflow-auto max-h-72 border rounded-lg">
                <table className="table table-xs table-pin-rows w-full">
                  <thead>
                    <tr>
                      <th>Dirección (0x)</th>
                      <th>Código</th>
                      <th>{t('farm-name')}</th>
                      <th>{t('height')}</th>
                      <th>{t('area')}</th>
                      <th>{t('village')}</th>
                      <th>{t('village2')}</th>
                      <th>{t('certifications')}</th>
                      <th>{t('tables.coffee-varieties')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.map((f, idx) => (
                      <tr key={idx}>
                        <td className="font-mono text-xs max-w-[140px] truncate">{f.farmerAddress}</td>
                        <td>{f.farmerId}</td>
                        <td>{f.name}</td>
                        <td>{f.height}</td>
                        <td>{f.area}</td>
                        <td>{f.village}</td>
                        <td>{f.village2}</td>
                        <td>{f.certifications}</td>
                        <td>{f.varieties}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex gap-3">
                <button className="btn btn-primary" onClick={handleUpload}>
                  {t('upload-farms.save', { count: parsed.length })}
                </button>
                <button className="btn btn-ghost gap-1" onClick={clearFiles}>
                  <FaTimes /> {t('remove')}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
