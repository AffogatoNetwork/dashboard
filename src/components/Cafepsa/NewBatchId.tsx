import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import Loading from '../Loading';
import { getBatch, getFarmer } from '../../db/firebase';
import NotFound from '../common/NotFound';
import NewMap from '../common/NewMap';
import { LinkIcon } from '../icons/link';
import Farmers from './Farmers';

const NewBatchId = () => {
  const { t } = useTranslation();
  const { batchId } = useParams();
  const [loading, setLoading] = useState(true);
  const [coffeeBatch, setCoffeeBatch] = useState<any>([]);
  const [farmers, setFarmers] = useState<any>([]);

  useEffect(() => {
    const load = () => {
      if (batchId) {
        let farmerDetails: any[] = [];
        getBatch(batchId)
          .then((result) => {
            console.log(result);
            if (result?.image.includes('https://firebasestorage') === true) {
            } else {
              if (result?.image) {
                let url = 'https://affogato.mypinata.cloud/ipfs/';
                result.image = url + result.image;
              }
            }

            setCoffeeBatch(result);
            console.log(result);

            let dataFarmers = result?.Farmer;
            console.log(dataFarmers.length);
            console.log(dataFarmers);
            if (dataFarmers && dataFarmers.length > 0) {
              // Utiliza Promise.all para esperar a que todas las promesas se resuelvan
              Promise.all(dataFarmers.map((element: any) => getFarmer(element)))
                .then((farmers) => {
                  setFarmers(farmers);
                  setLoading(false);
                })
                .catch((error) => {
                  setLoading(false);
                });
            } else {
              setLoading(false);
            }
          })
          .catch((error) => {
            setLoading(false);
          });
      } else {
        <NotFound msg={batchId + 'Not Found'} />;
      }
    };
    load();
  }, [batchId]);

  const openInNewTab = (url: string | null | undefined) => {
    const urlStr = url?.toString();
    window.open(urlStr, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return <Loading label="Cargando..." className="loading-wrapper" />;
  }

  return (
    <>
      <div className="min-w-screen relative flex min-h-screen flex-col items-center overflow-hidden bg-yellow-900 px-5 lg:px-10">
        <div className="relative mx-auto w-full max-w-6xl rounded bg-white p-10 text-gray-800 shadow-xl md:text-left lg:p-20">
          <div className="-mx-10 items-center md:flex">
            <div className="mb-10 w-full px-10 md:mb-0 md:w-1/2">
              <div className="relative">
                <img
                  src={
                    coffeeBatch?.image ||
                    'https://gateway.pinata.cloud/ipfs/' + coffeeBatch?.image
                  }
                  alt="NFT"
                  className="relative z-10 m-auto h-96 w-64"
                />
                <div className="absolute top-10 bottom-10 left-10 right-10 z-0 border-4 border-yellow-700"></div>
              </div>
            </div>
            <div className="w-full px-10 md:w-1/2">
              <div className="mb-10">
                <h1 className="  mb-5 text-2xl">
                  <>{t('batch-id')}</>:
                  <span className="font-bold">
                    {coffeeBatch?.ipfsHash?.substring(0, 6)}.
                  </span>
                </h1>
                <h1 className="mb-5 text-2xl">
                  {' '}
                  <>{t('varieties')}</>:
                  <span className="font-bold">
                    {coffeeBatch?.wetMill?.variety}.
                  </span>
                </h1>
                <h1 className="mb-5 text-2xl">
                  <>{t('certifications')}</>:
                  <span className="font-bold">
                    {coffeeBatch?.wetMill?.certifications}.
                  </span>
                </h1>
              </div>
              <div>
                <div className="mr-5 inline-block align-bottom">
                  {coffeeBatch.Farmer !== undefined && (
                    <>
                      <div>
                        <h1>
                          {' '}
                          <>{t('farmers')}</>: <br />
                          <>
                            <Farmers farmers={farmers} />
                          </>
                        </h1>
                      </div>
                    </>
                  )}
                </div>
                <div className="inline-block align-bottom">
                  {coffeeBatch?.Profile?.note > 0 && (
                    <div className="stat">
                      <div className="stat-title">
                        <>{t('note')}</>
                      </div>
                      <div className="stat-value">
                        {coffeeBatch?.wetMill?.note} %
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-6xl rounded bg-white px-10 pb-5 text-gray-800 shadow-xl md:text-left lg:px-20">
          <div>
            <div className="w-full ">
              <div className="rounded bg-amber-800 p-2 text-center text-white">
                <>{t('production')}</>
              </div>
              <div className="grid-col-3 grid lg:grid-cols-7">
                <div className="flex-grow rounded border border-gray-300 py-8 text-center">
                  <h2 className="text-md pb-2 font-bold">
                    {coffeeBatch?.wetMill?.variety ||
                      coffeeBatch?.dryMill?.variety}
                  </h2>
                  <h4 className="inline text-sm text-gray-500">
                    {' '}
                    <>{t('variety')}</>{' '}
                  </h4>
                </div>
                <div className="flex-grow rounded border border-gray-300 py-8 text-center">
                  <h2 className="text-md pb-2 font-bold">
                    {coffeeBatch?.wetMill?.process}
                  </h2>
                  <h4 className="inline text-sm text-gray-500">
                    {' '}
                    <>{t('process')}</>{' '}
                  </h4>
                </div>
                <div className="flex-grow rounded border border-gray-300 py-8 text-center">
                  <h2 className="text-md pb-2 font-bold">
                    {coffeeBatch?.Profile?.acidity}
                  </h2>
                  <h4 className="inline text-sm text-gray-500">
                    {' '}
                    <>{t('acidity')}</>{' '}
                  </h4>
                </div>
                <div className="flex-grow rounded border border-gray-300 py-8 text-center">
                  <h2 className="text-md pb-2 font-bold">
                    {coffeeBatch?.Profile?.aftertaste}
                  </h2>
                  <h4 className="inline text-sm text-gray-500">
                    {' '}
                    <>{t('aftertaste')}</>{' '}
                  </h4>
                </div>
                <div className="flex-grow rounded border border-gray-300 py-8 text-center">
                  <h2 className="text-md pb-2 font-bold">
                    {coffeeBatch?.Profile?.body}
                  </h2>
                  <h4 className="inline text-sm text-gray-500">
                    {' '}
                    <>{t('body')}</>{' '}
                  </h4>
                </div>
                <div className="flex-grow rounded border border-gray-300 py-8 text-center">
                  <h2 className="text-md pb-2 font-bold">
                    {coffeeBatch?.Profile?.aroma}
                  </h2>
                  <h4 className="inline text-sm text-gray-500">
                    {' '}
                    <>{t('aroma')}</>{' '}
                  </h4>
                </div>
                <div className="flex-grow rounded border border-gray-300 py-8 text-center">
                  <h2 className="text-md pb-2 font-bold">
                    {coffeeBatch?.Profile?.sweetness}
                  </h2>
                  <h4 className="inline text-sm text-gray-500">
                    {' '}
                    <>{t('sweetness')}</>{' '}
                  </h4>
                </div>
              </div>
            </div>
            <div className="mt-2 flex flex-col gap-5 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <div className="rounded bg-amber-800 p-2 text-center text-white">
                  <>{t('wet-mill')}</>
                </div>
                <div className="mt-2 flex gap-5">
                  <div className="flex-grow rounded border border-gray-300 py-8 text-center">
                    <h2 className="text-md pb-2 font-bold">
                      {coffeeBatch?.wetMill?.certifications}
                    </h2>
                    <h4 className="inline text-sm text-gray-500">
                      <>{t('certificates')}</>
                    </h4>
                  </div>
                  <div className="flex-grow rounded border border-gray-300 py-8 text-center">
                    <h2 className="text-md pb-2 font-bold">
                      {coffeeBatch?.wetMill?.drying_hours || 'Aprox. 1200'}{' '}
                    </h2>
                    <h4 className="inline text-sm text-gray-500">
                      {' '}
                      <>{t('drying-hours')}</>{' '}
                    </h4>
                  </div>
                  <div className="flex-grow rounded border border-gray-300 py-8 text-center">
                    <h2 className="text-md pb-2 font-bold">
                      {coffeeBatch?.wetMill?.process}{' '}
                    </h2>
                    <h4 className="inline text-sm text-gray-500">
                      {' '}
                      <>{t('process')}</>{' '}
                    </h4>
                  </div>
                  <div className="flex-grow rounded border border-gray-300 py-8 text-center">
                    <h2 className="text-md pb-2 font-bold">
                      {coffeeBatch?.wetMill?.variety}
                    </h2>
                    <h4 className="inline text-sm text-gray-500">
                      {' '}
                      <>{t('variety')}</>{' '}
                    </h4>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <div className="rounded bg-amber-800 p-2 text-center text-white">
                  <>{t('dry-mill')}</>
                </div>
                <div className="mt-2 flex gap-5">
                  <div className="flex-grow rounded border border-gray-300 py-8 text-center">
                    <h2 className="text-md pb-2 font-bold">
                      {coffeeBatch?.dryMill?.damage_percent}
                    </h2>
                    <h4 className="inline text-sm text-gray-500">
                      {' '}
                      <>{t('damage-percent')}</>{' '}
                    </h4>
                  </div>
                  <div className="flex-grow rounded border border-gray-300 py-8 text-center">
                    <h2 className="text-md pb-2 font-bold">
                      {coffeeBatch?.dryMill?.height || 'Aprox. 1200'}{' '}
                    </h2>
                    <h4 className="inline text-sm text-gray-500">
                      {' '}
                      <>{t('altitude')}</>{' '}
                    </h4>
                  </div>
                  <div className="flex-grow rounded border border-gray-300 py-8 text-center">
                    <button
                      onClick={() => {
                        openInNewTab(coffeeBatch?.dryMill?.cupping_url);
                      }}
                      className="inline-flex items-center rounded bg-black py-2 px-4 font-bold text-white  hover:bg-slate-600"
                    >
                      <LinkIcon></LinkIcon>
                      <>{t('open-link')}</>
                    </button>
                    <br />
                    <h4 className="inline text-sm text-gray-500">
                      {' '}
                      <>{t('cupping_profile')}</>{' '}
                    </h4>
                  </div>
                  <div className="flex-grow rounded border border-gray-300 py-8 text-center">
                    <h2 className="text-md pb-2 font-bold">
                      {parseFloat(
                        coffeeBatch?.dryMill?.threshing_yield
                      ).toFixed(2)}
                    </h2>
                    <h4 className="inline text-sm text-gray-500">
                      {' '}
                      <>{t('threshing-yield')}</>{' '}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-5 lg:flex-col">
              <div className="flex place-content-center"></div>
            </div>
          </div>
        </div>
        <br />
      </div>
    </>
  );
};

export default NewBatchId;
