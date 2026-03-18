import React, { useRef, useState } from 'react';
import { saveBannerImage } from '../../db/firebase';
import { getCompanyName, getCompanyAddressesByHost } from '../../utils/utils';

export const EditBannerModule = () => {
  const [selectedImage, setSelectedImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedUrl, setSavedUrl] = useState('');
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const company = getCompanyName(getCompanyAddressesByHost(window.location.host)[0]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
      setSelectedImage(URL.createObjectURL(event.target.files[0]));
      setSavedUrl('');
    }
  };

  const handleSave = async () => {
    if (!imageFile) return;
    setSaving(true);
    const url = await saveBannerImage(company, imageFile);
    if (url) setSavedUrl(url);
    setSaving(false);
  };

  return (
    <div className="bg-white p-4 md:p-8 mb-6 rounded-b-lg">
      <h2 className="text-lg font-semibold mb-4">Banner de {company}</h2>
      <div className="flex flex-col items-center gap-6">
        <div
          className="w-full max-w-xl border-2 border-dashed border-amber-400 rounded-lg flex items-center justify-center cursor-pointer h-40 overflow-hidden bg-amber-50"
          onClick={() => hiddenFileInput.current?.click()}
        >
          {selectedImage ? (
            <img src={selectedImage} alt="banner preview" className="object-contain h-full w-full" />
          ) : (
            <p className="text-amber-700 text-sm">Haz clic para seleccionar imagen de banner</p>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={hiddenFileInput}
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={!imageFile || saving}
        >
          {saving ? 'Guardando...' : 'Guardar Banner'}
        </button>
        {savedUrl && (
          <p className="text-green-600 text-sm">Banner actualizado correctamente.</p>
        )}
      </div>
    </div>
  );
};
