import React, { useEffect, useState } from 'react';
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import { FaSearchPlus, FaTimes } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import '../../styles/create.scss';
import { useAuthContext } from '../../states/AuthContext';
import { saveBatch, saveFarms, getAllFarmers } from '../../db/firebase';
import { apiUrl } from '../../utils/constants';
import {
  getCompanyName,
  getCompanyAddressesByHost,
  errorNotification,
  notifyUser,
} from '../../utils/utils';
import { FarmType } from '../common/types';
import Loading from '../Loading';
import { use } from 'i18next';

export const Create = () => {
  const { t } = useTranslation();
  const { authState } = useAuthContext();
  const [state] = authState;
  const [rows, setRows] = useState(null);
  const [cols, setCols] = useState(null);
  const [saving, setSaving] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState('');
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      accept: {
        file: ['.xlsx'],
      },
      maxFiles: 1,
    });

  const clearFiles = () => {
    setRows(null);
    setCols(null);
    setRows(null);
    setCols(null);
    acceptedFiles.slice(0, -1);
  };

  const files = acceptedFiles.map((file, index) => (
    <div key={index} className="file-accepted">
      <span>
        <>{t('remove', { 'file-name': file.name })}</>
      </span>
      <button className="remove" onClick={() => clearFiles()}>
        <>
          <FaTimes /> {t('remove')}
        </>
      </button>
    </div>
  ));

  useEffect(() => {
    const loadProvider = async () => {
      const user = localStorage.getItem('addres');
      if (user !== '') {
        setCurrentUser(user);
      } else {
        setCurrentUser('0xfa474d1e6d83c6ba0591117981d56dbf08c774af');
      }
      const address = getCompanyAddressesByHost(window.location.host)[0];
      setOwnerAddress(address);
    };
    loadProvider();

    if (acceptedFiles.length > 0) {
      ExcelRenderer(acceptedFiles[0], (err: any, resp: any) => {
        if (err) {
        } else {
          setRows(resp.rows);
          setCols(resp.cols);
        }
      });
    }
  }, [acceptedFiles, state.provider]);

  const fileError = (file: File, errors: any) => {
    if (errors.code === 'file-invalid-type') {
      return <span>{t('errors.file-invalid-type', { name: file.name })}</span>;
    }
    if (errors.code === 'file-too-big') {
      return <span>{t('errors.file-too-big', { name: file.name, size: file.size })}</span>;
    }
    return <span>{t('errors.file-load-failed', { name: file.name })}</span>;
  };

  const fileRejectionItems = fileRejections.map(({ file, errors }, index) => (
    <div key={index} className="file-errors">
      {errors.map((e) => fileError(file, e))}
    </div>
  ));

  const saveFarmsToDB = async () => {
    const farms = new Array<FarmType>();
    const companyName = getCompanyName(ownerAddress);

    // Build cooperativeId → eth address lookup
    const coopToAddress: Record<string, string> = {};
    try {
      const farmerDocs = await getAllFarmers(companyName);
      farmerDocs.forEach((d) => {
        const data = d.data();
        if (data.cooperativeId && data.address) {
          coopToAddress[data.cooperativeId.toUpperCase()] = data.address;
        }
      });
    } catch (_) {}

    if (rows !== null) {
      // @ts-ignore
      for (let i = 4; i < rows.length; i += 1) {
        // Rows 0-3: company header, blank, main headers, sub-headers — skip
        try {
          // @ts-ignore
          if (rows[i] !== null && rows[i].length > 0) {
            // Need at least Código (col 1) and Nombre Finca (col 12)
            // @ts-ignore
            if (rows[i][1] !== '' && rows[i][12] !== '') {
              // @ts-ignore
              const cooperativeId = String(rows[i][1] || '').trim();
              const ethAddress = coopToAddress[cooperativeId.toUpperCase()] || cooperativeId;
              // @ts-ignore
              const isX = (col: number) => String(rows![i][col] || '').trim().toUpperCase() === 'X';
              farms.push({
                farmerAddress: ethAddress,
                farmerId: cooperativeId,
                company: companyName,
                // @ts-ignore
                name: String(rows[i][12] || ''),         // M Nombre Finca
                // @ts-ignore
                height: String(rows[i][13] || ''),       // N Altura (msnm)
                // @ts-ignore
                area: String(rows[i][11] || ''),         // L Superficie (Ha.)
                certifications: [
                  isX(15) ? 'Fairtrade' : '',
                  isX(16) ? 'Orgánico' : '',
                  isX(17) ? 'Rainforest Alliance' : '',
                  isX(18) ? 'Con Manos de Mujer' : '',
                  isX(19) ? 'ROC' : '',
                ].filter(Boolean).join(', '),
                // @ts-ignore
                latitude: rows[i][6] || '',              // G Latitud
                // @ts-ignore
                longitude: rows[i][7] || '',             // H Longitud
                bio: '',
                country: '',
                // @ts-ignore
                region: String(rows[i][8] || ''),        // I Departamento
                // @ts-ignore
                village: String(rows[i][10] || ''),      // K Comunidad
                // @ts-ignore
                village2: String(rows[i][9] || ''),      // J Municipio
                // @ts-ignore
                varieties: String(rows[i][14] || ''),    // O Variedad
                shadow: '',
                familyMembers: '',
                ethnicGroup: '',
              });
            }
          }
        } catch (error) {}
      }

      if (farms.length > 0) {
        await saveFarms(farms);
      }
    }
  };

  const createBatches = () => {
    if (acceptedFiles.length === 1) {
      setSaving(true);
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      const url = apiUrl.concat(`submit?coop_address=${ownerAddress}`);
      fetch(url, {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: formData,
      })
        .then((res) => res.json())
        .then((json) => {
          notifyUser(t('create-batches.success'));
          setSaving(false);
          clearFiles();
          saveFarmsToDB();
        })
        .catch((error) => {
          // errorNotification("Error inesperado.");
          notifyUser(t('errors.creating-batch'));
          setSaving(false);
          clearFiles();
        });
    } else {
      errorNotification(t('errors.no-file'));
    }
  };

  return (
    <div className="new-batch">
      {currentUser ? (
        <div className="card create-card shadow-xl">
          <div className="card-body">
            <h2 className="py-4">
              <>{t('create-batches.title')}</>
            </h2>
            {saving ? (
              <Loading
                label={t('create-batches.creating')}
                className="loading-wrapper"
              />
            ) : (
              <>
                <h4 className="text-light text-stone-400">
                  <>{t('create-batches.explanation')}</>
                </h4>
                <div className="dnd-container">
                  {acceptedFiles.length === 0 ||
                  rows === null ||
                  cols === null ? (
                    <div {...getRootProps({ className: 'dropzone p-6' })}>
                      <input {...getInputProps()} />
                      <FaSearchPlus className="icon" />
                      <p>
                        <>{t('create-batches.drag-drop')}</>
                      </p>
                    </div>
                  ) : (
                    <div className="excel-container">
                      <OutTable
                        data={rows}
                        columns={cols}
                        tableClassName="excel"
                        tableHeaderRowclassName="heading"
                      />
                    </div>
                  )}
                  {files}
                  {fileRejectionItems}
                </div>
              </>
            )}
          </div>
          <div className="card-footer">
            <button
              className="btn btn-secondary"
              onClick={() => createBatches()}
              disabled={saving}
            >
              <>{t('create-batches.menu')}</>
            </button>
          </div>
        </div>
      ) : (
        <h1> Not logged in</h1>
      )}
    </div>
  );
};
