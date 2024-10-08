import React, { useEffect, useState } from 'react';
import { canEdit } from '../db/firebase';
import { useTranslation } from 'react-i18next';
import { EditFarmsModule } from './Admin/EditFarmsModule';
import { EditFarmersModule } from './Admin/EditFarmersModule';
import { EditCertificationsModule } from './Admin/EditCertificationsModule';
import { CreateFarmModule } from './Admin/CreateFarmModule';
import { CreateVarietyModule } from './Admin/CreateVarietyModule';
import { CreateCertificationModule } from './Admin/CreateCertificationModule';
import { EditProfilePhotoModule } from './Admin/EditProfilePhotoModule';
import { CreateBatchesModule } from './Admin/CreateBatches';
import { EditBatchesModule } from './Admin/EditBatchesModule';

export const AdminModule = () => {
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState<any>(false);
  const [activeTab, setActiveTab] = useState('farmer');
  const [company, setCompany] = useState('PROEXO');
  useEffect(() => {
    const load = async () => {
      const email = JSON.parse(localStorage.getItem('email') || '{}');
      const url = window.location.host.toString();
      let companyName = '';
      if (url.match('commovel') !== null) {
        companyName = 'COMMOVEL';
      }
      if (url.match('copracnil') !== null) {
        companyName = 'COPRACNIL';
      }
      if (url.match('comsa') !== null) {
        companyName = 'COMSA';
      }
      if (url.match('proexo') !== null) {
        companyName = 'PROEXO';
      }
      if (url.match('cafepsa') !== null) {
        companyName = 'CAFEPSA';
      }
      if (url.match('localhost') !== null) {
        companyName = 'PROEXO';
      }

      setCompany(company);
      await canEdit(email, company).then((result) => {
        for (let i = 0; i < result.length; i += 1) {
          const data = result[i].data();
          const userExist = data.user;
          if (userExist.includes(email)) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      });
    };

    load();
  }, []);

  const renderCreateBatch = () => (
    <>
      <CreateBatchesModule />
    </>
  );

  const renderEditFarmer = () => (
    <>
      <EditFarmersModule />
    </>
  );

  const renderEditBatches = () => (
    <>
      <EditBatchesModule />
    </>
  );

  const renderEditFarm = () => (
    <>
      <EditFarmsModule />
    </>
  );

  const renderCreateVariety = () => (
    <>
      <CreateVarietyModule />
    </>
  );

  const renderCreateCertifications = () => (
    <>
      <CreateCertificationModule />
    </>
  );

  const renderEditCertifications = () => (
    <>
      <EditCertificationsModule />
    </>
  );

  const renderCreateFarmer = () => (
    <>
      <CreateFarmModule />
    </>
  );

  const renderPhotoEdit = () => (
    <>
      <EditProfilePhotoModule />
    </>
  );

  return (
    <>
      <div className="">
        <div className=" mb-1 flex w-full flex-row justify-between sm:mb-0">
          <div className=" h-full w-full p-1">
            <div className="card bg-white shadow-xl">
              <div className="w-full rounded-lg p-5">
                <div className="text-center text-xl font-bold">
                  <h1> Modulo de Administracion </h1>
                </div>
              </div>
              <div className="m-6">
                <div className="card-title grid justify-items-stretch">
                  {isAdmin ? (
                    <>
                      <div className="tabs flex justify-center">
                        <a
                          className={`${
                            activeTab == 'create-batch' &&
                            `tab-lifted tab tab-active btn-wide tab-lg`
                          } tab btn-wide tab-lg `}
                          id="signup-tabs"
                          onClick={() => setActiveTab('create-batch')}
                        >
                          <>{'Crear Lotes'}</>
                        </a>

                        <a
                          className={`${
                            activeTab == 'edit-batches' &&
                            `tab-lifted tab tab-active btn-wide tab-lg`
                          } tab btn-wide tab-lg `}
                          id="signup-tabs"
                          onClick={() => setActiveTab('edit-batches')}
                        >
                          <>{'Editar Lotes'}</>
                        </a>

                        <a
                          className={`${
                            activeTab == 'crear-certificados' &&
                            `tab-lifted tab tab-active btn-wide tab-lg`
                          } tab btn-wide tab-lg `}
                          id="signup-tabs"
                          onClick={() => setActiveTab('crear-certificados')}
                        >
                          <>{'Agregar Certificados'}</>
                        </a>

                        <a
                          className={`${
                            activeTab == 'variedades' &&
                            `tab-lifted tab tab-active btn-wide tab-lg`
                          } tab btn-wide tab-lg `}
                          id="signup-tabs"
                          onClick={() => setActiveTab('variedades')}
                        >
                          <>{'Agregar Variedades'}</>
                        </a>

                        <a
                          className={`${
                            activeTab == 'farmer' &&
                            `tab-lifted tab tab-active btn-wide tab-lg`
                          } tab btn-wide tab-lg `}
                          id="signup-tabs"
                          onClick={() => setActiveTab('farmer')}
                        >
                          <>{t('farmer')}</>
                        </a>

                        <a
                          className={`${
                            activeTab == 'farm' &&
                            `tab-lifted tab tab-active btn-wide tab-lg`
                          } tab btn-wide tab-lg `}
                          id="signup-tabs"
                          onClick={() => setActiveTab('farm')}
                        >
                          <>{t('farm')}</>
                        </a>

                        {company !== 'PROEXO' && (
                          <a
                            className={`${
                              activeTab == 'farmer' &&
                              `tab-lifted tab tab-active btn-wide tab-lg`
                            } tab btn-wide tab-lg `}
                            id="signup-tabs"
                            onClick={() => setActiveTab('farmer')}
                          >
                            <>{t('certifications')}</>
                          </a>
                        )}

                        <a
                          className={`${
                            activeTab == 'createFarmer' &&
                            `tab-lifted tab tab-active  btn-wide tab-lg`
                          } tab btn-wide tab-lg `}
                          id="signup-tabs"
                          onClick={() => setActiveTab('createFarmer')}
                        >
                          <>{'Crear Finca'}</>
                        </a>

                        <a
                          className={`${
                            activeTab == 'photo' &&
                            `tab-lifted tab tab-active btn-wide tab-lg`
                          } tab btn-wide tab-lg `}
                          id="signup-tabs"
                          onClick={() => setActiveTab('photo')}
                        >
                          <>{'Editar Foto'}</>
                        </a>
                      </div>

                      {activeTab == 'crear-certificados' && (
                        <div className={`overflow-hidden`}>
                          {renderCreateCertifications()}
                        </div>
                      )}

                      {activeTab == 'edit-batches' && (
                        <div className={`overflow-hidden`}>
                          {renderEditBatches()}
                        </div>
                      )}

                      {activeTab == 'variedades' && (
                        <div className={`overflow-hidden`}>
                          {renderCreateVariety()}
                        </div>
                      )}

                      {activeTab == 'farmer' && (
                        <div className={`overflow-hidden`}>
                          {renderEditFarmer()}
                        </div>
                      )}

                      {activeTab == 'farm' && (
                        <div className={`overflow-hidden`}>
                          {renderEditFarm()}
                        </div>
                      )}

                      {activeTab == 'certifications' && (
                        <div className={`overflow-hidden`}>
                          {renderEditCertifications()}
                        </div>
                      )}

                      {activeTab == 'createFarmer' && (
                        <div className={`overflow-hidden`}>
                          {renderCreateFarmer()}
                        </div>
                      )}

                      {activeTab == 'create-batch' && (
                        <div className={`overflow-hidden`}>
                          {renderCreateBatch()}
                        </div>
                      )}

                      {activeTab == 'photo' && (
                        <div className={`overflow-hidden`}>
                          {renderPhotoEdit()}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="text-center">
                        <h1> No tienes permisos de Administrador </h1>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
