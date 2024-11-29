import React, { Component, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  MaterialReactTableProps,
  MRT_ColumnDef,
} from 'material-react-table';
import { editCertifications } from '../../db/firebase';
import { useTranslation } from 'react-i18next';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import Box from '@mui/material/Box';
import { MdDoneOutline } from 'react-icons/md';
import { useCertifications } from '../../hooks/useCertifications';

export const EditCertificationsModule = () => {
  const { t, i18n } = useTranslation();
  const [certifications, certificationsCount, ownerAddress, setReload] =
    useCertifications();

  const [tableData, setTableData] = useState<any[]>(() => certifications);

  const handleSaveRow: MaterialReactTableProps<any>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      try {
        await editCertifications(values);
        tableData[row.index] = values;
        setTableData([...tableData]);
        setReload(true);
        exitEditingMode();
      } catch (error) {}
    };

  const columData = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        header: t('tables.name-farmer'),
        accessorKey: 'fullname',
        Header: ({ column }) => (
          <div className="flex align-bottom m-auto pt-12 ">
            <h1 className="text-xl">
              <> {t('tables.name-farmer')}</>{' '}
            </h1>
          </div>
        ),
      },
      {
        accessorFn: (farm: any) => `${farm.area}`,
        id: 'area', //id is still required when using accessorFn instead of accessorKey
        header: t('tables.certified-area'),
        Header: ({ column }) => (
          <div className="flex align-bottom m-auto pt-12 ">
            <h1 className="text-xl">
              <> {t('tables.certified-area')}</>{' '}
            </h1>
          </div>
        ),
        size: 10,
        Cell(props) {
          return <div className="text-center">{props.renderedCellValue}</div>;
        },
      },
      {
        accessorFn: (row: { usda: any }) => `${row.usda} `, //accessorFn used to join multiple data into a single cell
        id: 'usda', //id is still required when using accessorFn instead of accessorKey
        header: 'USDA',
        Header: ({ column }) => (
          <div className="text-center">
            <img
              src={require('../../assets/certificaciones/1_USDA Organic.png')}
              className="w-24 h-24"
            />
            <h1 className="text-lg">USDA</h1>
            <h1 className="text-lg">Orgánico</h1>
          </div>
        ), //arrow function
        enableSorting: false,
        enableColumnFilter: false,
        // @ts-ignore
        Cell: ({ row }) => (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              {row.original.usda === 1 && (
                <div className="ml-8">
                  <MdDoneOutline className="icon" />
                </div>
              )}
            </Box>
          </>
        ),
      },
      {
        accessorFn: (row: { fairtrade: any }) => `${row.fairtrade} `, //accessorFn used to join multiple data into a single cell
        id: 'fairtrade', //id is still required when using accessorFn instead of accessorKey
        header: 'fairtrade',
        Header: ({ column }) => (
          <>
            <div className="text-center">
              <img
                src={require('../../assets/certificaciones/2_Fair Trade.png')}
                className="w-24 h-24"
              />
              <h1 className="text-xl"> Comercio</h1>
              <h1 className="text-xl"> Justo</h1>
            </div>
          </>
        ), //arrow function
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              {row.original.fairtrade === 1 && (
                <div className="ml-8">
                  <MdDoneOutline className="icon" />
                </div>
              )}
            </Box>
          </>
        ),
      },
      {
        accessorFn: (row: { manosdemujer: any }) => `${row.manosdemujer} `, //accessorFn used to join multiple data into a single cell
        id: 'manosdemujer', //id is still required when using accessorFn instead of accessorKey
        header: 'Manos de Mujer',
        Header: ({ column }) => (
          <div className="text-center">
            <img
              src={require('../../assets/certificaciones/5_ConManosdeMujer.png')}
              className="w-24 h-24"
            />
            <h1 className="text-lg">Con Manos </h1>
            <h1 className="text-lg">de Mujer </h1>
          </div>
        ), //arrow function
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              {row.original.manosdemujer === 1 && (
                <div className="ml-8">
                  <MdDoneOutline className="icon" />
                </div>
              )}
            </Box>
          </>
        ),
      },
      {
        accessorFn: (row: { spp: any }) => `${row.spp} `, //accessorFn used to join multiple data into a single cell
        id: 'spp', //id is still required when using accessorFn instead of accessorKey
        header: 'SPP',
        Header: () => (
          <div className="text-center">
            <img
              src={require('../../assets/certificaciones/7_Pequeños_Productores.png')}
              className="w-24 h-24"
            />
            <h1 className="text-lg">Pequeños</h1>
            <h1 className="text-lg">Productores</h1>
          </div>
        ), //arrow function
        size: 5,
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              {row.original.spp === 1 && (
                <div className="ml-8">
                  <MdDoneOutline className="icon" />
                </div>
              )}
            </Box>
          </>
        ),
      },
      {
        header: t('address'),
        accessorKey: 'address',
        enableEditing: false,
      },
    ],
    [i18n.language],
  );

  return (
    <>
      <div className="overflow-auto">
        <MaterialReactTable
          enableStickyHeader={true}
          columns={columData}
          enableEditing={true}
          onEditingRowSave={handleSaveRow}
          data={certifications}
          enableHiding={false}
          enableDensityToggle={false}
          sortDescFirst={true}
          enableFullScreenToggle={false}
          displayColumnDefOptions={{
            'mrt-row-actions': {
              header: t('edit'),
            },
          }}
          enableColumnActions={false}
          enableFilters={true}
          localization={MRT_Localization_ES}
          initialState={{
            sorting: [{ id: 'fullname', desc: false }],
            showGlobalFilter: true,
            isLoading: false,
          }}
        />
      </div>
    </>
  );
};
