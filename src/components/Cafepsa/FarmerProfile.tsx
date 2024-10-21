import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import Loading from '../Loading';
import NotFound from '../common/NotFound';
import {
  getFarmer,
  getFarmerFarms,
  getCafepsaImageUrl,
} from '../../db/firebase';
import NewMap from '../common/NewMap';

export const FarmerProfileModule = () => {
  const { t } = useTranslation();
  const { newfarmerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [farmerData, setFarmerData] = useState<any>();
  const [farms, setFarms] = useState<any>();
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [farmName, setfarmName] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/no_image.jpeg?alt=media&token=0d07fc99-d598-4c9b-9022-c4d018e67881'
  );

  useEffect(() => {
    const load = async () => {
      if (newfarmerId) {
        await getFarmer(newfarmerId).then((result) => {
          setFarmerData(result);
          const firebase = getFarmerFarms(result?.address).then(
            (result: any) => {
              {
                setfarmName(result[0].name);
                setLatitude(result[0].latitude);
                setLongitude(result[0].longitude);
                setFarms(result[0]);
              }
            }
          );
          setLoading(false);
        });
        await getCafepsaImageUrl(newfarmerId).then((result) => {
          setImageUrl(result);
        });
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line
  }, [newfarmerId]);

  if (loading) {
    return (
      <Loading label={t('loading').concat('...')} className="loading-wrapper" />
    );
  }

  if (farmerData === null) {
    return <NotFound msg={t('errors.farmer-not-found')} />;
  }

  return (
    <>
      <input type="checkbox" id="image-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <label
            htmlFor="image-modal"
            className="btn-sm btn-circle btn absolute right-2 top-2 bg-red-500 text-white hover:bg-red-700"
          >
            ✕
          </label>
          <div className="m-6 flex justify-center">
            <img alt="profile photo" src={imageUrl} />
          </div>
        </div>
      </div>

      <section className="card m-2 border p-3">
        <button className="btn-ghost btn  absolute right-2 top-2">
          <a
            className="decoration-sky-500 underline-offset-1 hover:underline"
            href={'/newfarmers-module'}
          >
            {' '}
            <>{t('back')}</>{' '}
          </a>
        </button>
        <h3 className="mb-5 text-2xl font-bold">
          <>{t('tables.name')}:</> {farmerData.fullname}
        </h3>

        <div className="mt-2 flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <div className="rounded border p-2 text-center ">
              <div className="avatar">
                <div className="h-32 w-32 rounded-full border-2 border-amber-900 hover:border-red-700">
                  <div />
                  <label htmlFor="image-modal" className=" ">
                    <img alt="profile photo" src={imageUrl} />
                  </label>
                </div>
              </div>
              <h3 className="mb-5 text-xl">
                <>{t('farmer')}: </>
                {farmerData.fullname}
              </h3>
              <div className="flex flex-col items-center justify-center text-center">
                <p className="rounded-full bg-amber-800 p-2 px-4 text-xs text-white">
                  {farmerData.company}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <div className="rounded border p-5 text-center">
              <p className="flex flex-col">
                <>{t('gender')}:</>
                <span className="font-bold text-black dark:text-white">
                  <>{t(farmerData.gender)}</>
                </span>
              </p>
              <p className="flex flex-col py-2">
                <>{t('location')}:</>
                <span className="font-bold text-black dark:text-white">
                  {farmerData.village} ,{farmerData.village2}
                </span>
              </p>

              <p className="flex flex-col">
                <>{t('country')}:</>
                <span className="font-bold text-black dark:text-white">
                  {farmerData.country},
                </span>
              </p>
            </div>
          </div>
        </div>

        <div>
          {farms ? (
            <div>
              <div className="mt-2 flex flex-col gap-5 lg:flex-row">
                <div className="w-full lg:w-1/2">
                  <div className="rounded bg-amber-800 p-2 text-center text-white">
                    <>{t('farm-name')}</>
                  </div>
                  <div className="mt-2 flex gap-5">
                    <div className="flex-grow rounded border border-gray-300 py-8 text-center">
                      <h2 className="pb-2 text-xl font-bold">
                        {farms?.certifications}
                      </h2>
                      <h4 className="inline text-sm text-gray-500">
                        <>{t('certificates')}</>
                      </h4>
                      <div className="grid grid-cols-4">
                        {farms.manosdemujer !== null && (
                          <div>
                            <img
                              src={require('../../assets/certificaciones/5_ConManosdeMujer.png')}
                              className="h-24 w-24"
                              alt="Con Manos de Mujer"
                            />
                          </div>
                        )}

                        {farms.fairtrade !== null && (
                          <div>
                            <img
                              src={require('../../assets/certificaciones/2_Fair Trade.png')}
                              className="h-24 w-24"
                              alt="Fair Trade"
                            />
                          </div>
                        )}
                        {farms.usda !== null && (
                          <div>
                            <img
                              src={require('../../assets/certificaciones/1_USDA Organic.png')}
                              className="h-24 w-24"
                              alt="USDA Organico"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow rounded border border-gray-300 py-8 text-center">
                      <h2 className="pb-2 text-xl font-bold">
                        {farms?.familyMembers}
                      </h2>
                      <h4 className="inline text-sm text-gray-500">
                        <>{t('family-members')}</>
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-1/2">
                  <div className="rounded bg-amber-800 p-2 text-center text-white">
                    <>{t('production')}</>
                  </div>
                  <div className="mt-2 flex gap-5">
                    <div className="flex-grow rounded border border-gray-300 py-8 text-center">
                      <h2 className="pb-2 text-xl font-bold">
                        {farms?.shadow}
                      </h2>
                      <h4 className="inline text-sm text-gray-500">
                        <>{t('type-production')}</>
                      </h4>
                    </div>
                    <div className="flex-grow rounded border border-gray-300 py-8 text-center">
                      <h2 className="pb-2 text-xl font-bold">
                        {farms?.varieties}
                      </h2>
                      <h4 className="inline text-sm text-gray-500">
                        <>{t('varieties')}</>{' '}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-5 lg:flex-col">
                <div className="flex place-content-center">
                  <div>
                    <NewMap
                      latitude={latitude}
                      longitude={longitude}
                      addressLine={farmName}
                      zoomLevel={9}
                      className="google-map"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {!farms ? (
            <div className="border-t border-gray-200 sm:border-l sm:border-t-0 ">
              <h2 className="m-4 text-xl font-light">Faltan datos de finca</h2>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
};
