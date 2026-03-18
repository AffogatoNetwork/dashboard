import {
  MaterialReactTable,
  MaterialReactTableProps,
  MRT_ColumnDef,
} from 'material-react-table';
import { editFarmers, toggleFarmerActive } from '../../db/firebase';
import { useTranslation } from 'react-i18next';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useFarmers } from '../../hooks/useFarmers';
import React, { useMemo, useState, useCallback } from 'react';
export const EditFarmersModule = () => {
  const { t, i18n } = useTranslation();
  const [farmers, farmersCount, ownerAddress, setReload] = useFarmers();
  const [toggling, setToggling] = useState<string | null>(null);

  const handleToggleActive = useCallback(async (address: string, current: boolean) => {
    setToggling(address);
    await toggleFarmerActive(address, !current);
    setReload(true);
    setToggling(null);
  }, [setReload]);

  const [tableData, setTableData] = useState<any[]>(() => farmers);

  const handleSaveRow: MaterialReactTableProps<any>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      try {
        await editFarmers(values);
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
        accessorKey: 'fullname',
      },
      {
        header: t('tables.sex'),
        accessorKey: 'gender',
      },
      {
        header: t('tables.community'),
        accessorKey: 'village2',
      },
      {
        header: t('tables.municipality'),
        accessorKey: 'village',
      },
      {
        header: t('tables.country'),
        accessorKey: 'country',
      },
      {
        header: t('address'),
        accessorKey: 'address',
        enableEditing: false,
      },
      {
        header: 'Activo',
        accessorKey: 'active',
        enableEditing: false,
        size: 80,
        Cell: ({ row }: any) => {
          const isActive: boolean = row.original.active !== false;
          const addr: string = row.original.address;
          return (
            <input
              type="checkbox"
              className="toggle toggle-success"
              checked={isActive}
              disabled={toggling === addr}
              onChange={() => handleToggleActive(addr, isActive)}
            />
          );
        },
      },
    ],
    [i18n.language, toggling, handleToggleActive],
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
              header: t('edit') || '',
            },
          }}
          enableColumnActions={false}
          enableFilters={true}
          localization={MRT_Localization_ES}
          initialState={{
            sorting: [{ id: 'village2', desc: false }],
            showGlobalFilter: true,
            isLoading: false,
          }}
        />
      </div>
    </>
  );
};
