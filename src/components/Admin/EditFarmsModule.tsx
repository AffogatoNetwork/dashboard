import React, { Component, useMemo, useState } from 'react';
import {
  MaterialReactTable,
  MaterialReactTableProps,
  MRT_ColumnDef,
} from 'material-react-table';
import { editFarm } from '../../db/firebase';
import { useTranslation } from 'react-i18next';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useFarms } from '../../hooks/useFarms';

export const EditFarmsModule = () => {
  const { t, i18n } = useTranslation();
  const [farmers, farmersCount, ownerAddress, setReload] = useFarms();

  const [tableData, setTableData] = useState<any[]>(() => farmers);

  const handleSaveRow: MaterialReactTableProps<any>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      try {
        if (values.shadow === 'true') values.shadow = true;
        if (values.shadow === 'false') values.shadow = false;
        await editFarm(values);
        tableData[row.index] = values;
        setTableData([...tableData]);
        setReload(true);
        exitEditingMode();
        window.location.reload();
      } catch (error) {}
    };

  const columData = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        header: t('tables.name'),
        accessorKey: 'name',
      },
      {
        header: t('tables.municipality'),
        accessorKey: 'village',
      },
      {
        header: t('tables.community'),
        accessorKey: 'village2',
      },
      {
        header: t('country'),
        accessorKey: 'country',
      },
      {
        header: t('longitude'),
        accessorKey: 'longitude',
      },
      {
        header: t('latitude'),
        accessorKey: 'latitude',
      },
      {
        accessorKey: 'area',
        header: t('area') + '  ' + '(mz)',
        size: 5,
      },
      {
        header: t('tables.coffee-varieties'),
        accessorKey: 'varieties',
      },
      {
        accessorKey: 'height',
        header: t('height'),
        size: 10,
      },
      {
        header: t('tables.production-system'),
        accessorKey: 'shadow',
        Cell: ({ cell }) => (cell.getValue() ? 'Sí' : 'No'),
        editVariant: 'select',
        editSelectOptions: ['true', 'false'],
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
          data={farmers}
          enableHiding={false}
          enableDensityToggle={false}
          sortDescFirst={true}
          enableFullScreenToggle={false}
          displayColumnDefOptions={{
            'mrt-row-actions': {
              header: 'Acciones',
            },
          }}
          enableColumnActions={false}
          enableFilters={true}
          localization={MRT_Localization_ES}
          initialState={{
            sorting: [{ id: 'name', desc: false }],
            showGlobalFilter: true,
            isLoading: false,
          }}
        />
      </div>
    </>
  );
};
