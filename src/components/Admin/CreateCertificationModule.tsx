import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from "react-i18next";
import { getCertifications, saveCertificationData, uploadCertificationImage } from '../../db/firebase';
import Loading from "../Loading";

const getCompany = () => {
  const host = window.location.host;
  if (host.match('commovel')) return 'COMMOVEL';
  if (host.match('copracnil')) return 'COPRACNIL';
  if (host.match('comsa')) return 'COMSA';
  if (host.match('proexo')) return 'PROEXO';
  if (host.match('cafepsa')) return 'CAFEPSA';
  return 'PROEXO';
};

export const CreateCertificationModule = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [certList, setCertList] = useState<Array<{ name: string; imageUrl?: string }>>([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const company = getCompany();

  const loadCerts = async () => {
    const data = await getCertifications(company);
    const list = data.map((doc: any) => {
      const d = doc.data();
      return { name: d.certification, imageUrl: d.imageUrl };
    });
    setCertList(list);
  };

  useEffect(() => { loadCerts(); }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Ingresa el nombre del certificado'); return; }
    setError('');
    setLoading(true);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadCertificationImage(name.trim(), imageFile);
      }
      await saveCertificationData(name.trim(), company, imageUrl);
      setName('');
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadCerts();
    } catch (e) {
      setError('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading label={t('loading').concat('...')} className="loading-wrapper" />;

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-3xl mx-auto">
      <h2 className="text-lg font-bold text-amber-700 uppercase tracking-widest mb-6">
        Certificaciones
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Form */}
        <div className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Nombre del certificado</span></label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="ej. Fairtrade"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Imagen (opcional)</span></label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <img src={imagePreview} alt="preview" className="mt-3 h-24 w-24 object-contain rounded border" />
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button className="btn btn-primary w-fit" onClick={handleSubmit}>
            Agregar Certificado
          </button>
        </div>

        {/* List */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">
            Lista de Certificados ({certList.length})
          </h3>
          {certList.length === 0 ? (
            <p className="text-sm text-gray-400">Sin certificados aún.</p>
          ) : (
            <ul className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
              {certList.map(cert => (
                <li key={cert.name} className="flex items-center gap-3 p-2 rounded-lg border border-gray-100 bg-gray-50">
                  {cert.imageUrl ? (
                    <img src={cert.imageUrl} alt={cert.name} className="h-10 w-10 object-contain rounded" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">N/A</div>
                  )}
                  <span className="text-sm font-medium text-gray-800">{cert.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
