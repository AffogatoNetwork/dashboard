import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ReactI18NextChild, useTranslation } from 'react-i18next';
import Loading from '../Loading';
import {
  getBatch,
  getFarmer,
  getFarmerFarms,
  getFarms,
} from '../../db/firebase';
import NotFound from '../common/NotFound';

const CoffeeBatchId = () => {
  const { t } = useTranslation();
  const { batchId } = useParams();
  const [loading, setLoading] = useState(true);
  const [coffeeBatch, setCoffeeBatch] = useState<any>([]);
  const [farmers, setFarmers] = useState<any>([]);
  useEffect(() => {
    const load = () => {
      if (batchId) {
        getBatch(batchId).then((result) => {
          if (result?.image.includes('https://firebasestorage') === true) {
          } else {
            if (result?.image) {
              let url = 'https://affogato.mypinata.cloud/ipfs/';
              result.image = url + result.image;
            }
          }

          setCoffeeBatch(result);
          if (result?.Farmer.address !== undefined) {
            getFarmer(result?.Farmer.address).then((result) => {
              FarmerDetails.push(result);
              setFarmers(FarmerDetails);
            });
          }
          let Farmers = result?.Farmer;
          if (Farmers.length > 1) {
            Farmers.forEach((element: any) => {
              getFarmer(element).then((result) => {
                FarmerDetails.push(result);
                setFarmers(FarmerDetails);
              });
            });
          } else {
          }

          let FarmerDetails: any[] = [];
          setLoading(false);
        });
        setLoading(false);
      } else {
        <NotFound msg={batchId + 'Not Found'} />;
      }
    };

    load();
  }, [batchId]);

  if (loading) {
    return <Loading label="Cargando..." className="loading-wrapper" />;
  }

  return (
    <>
      <section>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <ul className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <li>
              <div className="group relative block">
                <div className="card w-full bg-base-100 shadow-xl">
                  <figure className="px-10 pt-10">
                    <img
                      src={
                        coffeeBatch?.image ||
                        'https://gateway.pinata.cloud/ipfs/' +
                          coffeeBatch?.image
                      }
                      alt="NFT"
                      className="w-40 rounded-xl"
                    />
                  </figure>

                  <div className="card-body items-center text-center">
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
                    <p>{coffeeBatch?.Description}</p>

                    {coffeeBatch.Farmer !== undefined && (
                      <>
                        <div>
                          <p>
                            {' '}
                            <>{t('farmers')}</>: <br />
                            <>
                              {farmers.map((farmer: any, index: any) => (
                                <div key={index}>
                                  <p>
                                    <a
                                      className="decoration-sky-500 underline-offset-1 hover:underline"
                                      href={
                                        '/newfarmer' + '/' + farmer?.address
                                      }
                                    >
                                      {' '}
                                      {farmer?.fullname}{' '}
                                    </a>
                                  </p>
                                </div>
                              ))}
                            </>
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </li>

            <li>
              <div className="group relative block">
                <div className="h card w-full bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title pb-2 text-center text-xl underline decoration-yellow-700 decoration-2">
                      Detalles del lote : {coffeeBatch?.Name}{' '}
                      {coffeeBatch?.wetMill?.entry_id} ,{' '}
                      {coffeeBatch?.wetMill?.variety}{' '}
                      {coffeeBatch?.wetMill?.facility}{' '}
                    </h2>
                    <div className="card-actions">
                      <div className="row-gap-5 sm:row-gap-6 mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </li>

            <li className="lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <div className="group relative block">
                <div className="card w-full bg-base-100 shadow-xl">
                  <div className="card-body items-center text-center">
                    <h2 className="card-title pb-2 text-center text-xl underline decoration-yellow-700 decoration-2">
                      <>{t('batch-id')}</>
                    </h2>

                    <div className="card-actions">
                      <div className="mb-8 grid gap-6 text-center  sm:grid-cols-2 lg:grid-cols-4">
                        <p>
                          <>{t('variety')}</>:<br />{' '}
                          <span> {coffeeBatch?.wetMill?.variety}</span>
                        </p>
                        <p>
                          <>{t('process')}</>: <br />{' '}
                          <span> {coffeeBatch?.wetMill?.process}</span>
                        </p>
                        <p>
                          <>{t('acidity')}</>: <br />{' '}
                          <span> {coffeeBatch?.Profile?.acidity}</span>
                        </p>
                        <p>
                          <>{t('aftertaste')}</>: <br />{' '}
                          <span> {coffeeBatch?.Profile?.aftertaste}</span>
                        </p>
                        <p>
                          <>{t('body')}</>: <br />{' '}
                          <span> {coffeeBatch?.Profile?.body}</span>
                        </p>
                        <p>
                          <>{t('aroma')}</>: <br />{' '}
                          <span> {coffeeBatch?.Profile?.aroma}</span>
                        </p>
                        <p>
                          <>{t('sweetness')}</>: <br />{' '}
                          <span> {coffeeBatch?.Profile?.sweetness}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card w-full bg-base-100 shadow-xl">
                  <div className="card-body items-center text-center">
                    <h2 className="card-title pb-2 text-center text-xl underline decoration-yellow-700 decoration-2">
                      Beneficio Húmedo
                    </h2>
                    <div className="card-actions">
                      <div className="mb-8 grid gap-6 text-center  sm:grid-cols-2 lg:grid-cols-4">
                        <p>
                          <>{t('certificates')}</>: <br />{' '}
                          <span> {coffeeBatch?.wetMill?.certifications}</span>
                        </p>
                        <p>
                          <>{t('drying-hours')}</>: <br />{' '}
                          <span> {coffeeBatch?.wetMill?.drying_hours}</span>
                        </p>
                        <p>
                          <>{t('process')}</>: <br />{' '}
                          <span> {coffeeBatch?.wetMill?.process}</span>
                        </p>
                        <p>
                          {' '}
                          <>{t('variety')}</> :<br />{' '}
                          <span> {coffeeBatch?.wetMill?.variety}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card w-full bg-base-100 shadow-xl">
                  <div className="card-body items-center text-center">
                    <h2 className="card-title pb-2 text-center text-xl underline decoration-yellow-700 decoration-2">
                      Beneficio Seco
                    </h2>
                    <div className="card-actions">
                      <div className="mb-8 grid gap-6 text-center  sm:grid-cols-2 lg:grid-cols-4">
                        <p>
                          <>{t('damage-percent')}</>: <br />{' '}
                          <span> {coffeeBatch?.dryMill?.damage_percent}</span>
                        </p>
                        {coffeeBatch?.dryMill?.export_id !== '' && (
                          <p>
                            {' '}
                            <>{t('exporting-code')}</>: <br />{' '}
                            <span> {coffeeBatch?.dryMill?.export_id}</span>
                          </p>
                        )}
                        <p>
                          <>{t('altitude')}</>: <br />{' '}
                          <span>
                            {' '}
                            {coffeeBatch?.dryMill?.height || 'Aprox 1200'}{' '}
                          </span>
                        </p>
                        <p>
                          <>{t('cupping_profile')}</>: <br />{' '}
                          <a
                            className="decoration-sky-500 underline-offset-1 hover:underline"
                            href={coffeeBatch?.dryMill?.cupping_url}
                          >
                            {' '}
                            {coffeeBatch?.dryMill?.cupping_url}{' '}
                          </a>
                        </p>
                        <p>
                          {' '}
                          <>{t('threshing-yield')}</>: <br />{' '}
                          <span> {coffeeBatch?.dryMill?.threshing_yield}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {coffeeBatch?.Roasting?.bag_type !== '' && (
                  <div className="card w-full bg-base-100 shadow-xl">
                    <div className="card-body items-center text-center">
                      <h2 className="card-title pb-2 text-center text-xl underline decoration-yellow-700 decoration-2">
                        Tostado
                      </h2>
                      <div className="card-actions">
                        <div className="mb-8 grid gap-6 text-center  sm:grid-cols-2 lg:grid-cols-4">
                          <p>
                            <>{t('packaging')}</>: <br />{' '}
                            <span> {coffeeBatch?.Roasting?.bag_type}</span>
                          </p>
                          <p>
                            <>{t('bag-size')}</>: <br />{' '}
                            <span> {coffeeBatch?.Roasting?.bag_weight}</span>
                          </p>
                          <p>
                            <>{t('grind-type')}</>: <br />{' '}
                            <span> {coffeeBatch?.Roasting?.grind_type}</span>
                          </p>
                          <p>
                            <>{t('roast-type')}</>: <br />{' '}
                            <span> {coffeeBatch?.Roasting?.type}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default CoffeeBatchId;
