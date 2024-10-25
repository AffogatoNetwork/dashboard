import React, { Component, useMemo, useState } from 'react';
import MaterialReactTable, {
  MaterialReactTableProps,
  MRT_ColumnDef,
} from 'material-react-table';
import { editBatch } from '../../db/firebase';
import { useTranslation } from 'react-i18next';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useBatches } from '../../hooks/useBatches';

export const EditBatchesModule = () => {
  const { t, i18n } = useTranslation();
  const [batches, batchesCount, ownerAddress, setReload] = useBatches();

  const [tableData, setTableData] = useState<any[]>(() => batches);

  const handleSaveRow: MaterialReactTableProps<any>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      try {
        await editBatch(values);
        tableData[row.index] = values;
        setTableData([...tableData]);
        setReload(true);
        exitEditingMode();
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    };

  const columData = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      // Main Batch Fields
      { accessorKey: 'Name', header: t('tables.batch-name'), size: 20 },
      { accessorKey: 'Description', header: t('tables.description'), size: 40 },
      {
        accessorKey: 'parentId',
        header: t('tables.parent-id'),
        size: 20,
        enableEditing: false,
      },
      { accessorKey: 'urlCatacion', header: t('tables.cupping-url'), size: 20 },
      { accessorKey: 'urlTrilla', header: t('tables.threshing-url'), size: 20 },
      {
        accessorKey: 'ipfsHash',
        header: t('tables.ipfs-hash'),
        size: 20,
        enableEditing: false,
      },

      // Profile Fields
      {
        accessorKey: 'Profile.cup_profile',
        header: t('tables.cup-profile'),
        size: 30,
      },
      {
        accessorKey: 'Profile.scaa_url',
        header: t('tables.scaa-url'),
        size: 25,
      },

      // Roasting Fields
      {
        accessorKey: 'Roasting.roast_date',
        header: t('tables.roast-date'),
        size: 15,
      },
      {
        accessorKey: 'Roasting.roast_type',
        header: t('tables.roast-type'),
        size: 15,
      },
      {
        accessorKey: 'Roasting.grind_type',
        header: t('tables.grind-type'),
        size: 15,
      },
      {
        accessorKey: 'Roasting.packaging',
        header: t('tables.packaging'),
        size: 15,
      },
      {
        accessorKey: 'Roasting.bag_size',
        header: t('tables.bag-size'),
        size: 15,
      },

      // Dry Mill Fields
      {
        accessorKey: 'dryMill.export_id',
        header: t('tables.export-id-dry'),
        size: 15,
      },
      {
        accessorKey: 'dryMill.export_drying_id',
        header: t('tables.export-drying-id'),
        size: 15,
      },
      {
        accessorKey: 'dryMill.facility',
        header: t('tables.facility'),
        size: 15,
      },
      { accessorKey: 'dryMill.buyer', header: t('tables.buyer'), size: 20 },

      // Wet Mill Fields
      {
        accessorKey: 'wetMill.entry_id',
        header: t('tables.entry-id-wet'),
        size: 15,
      },
      {
        accessorKey: 'wetMill.drying_id',
        header: t('tables.drying-id-wet'),
        size: 15,
      },
      {
        accessorKey: 'wetMill.facility',
        header: t('tables.facility'),
        size: 15,
      },
      { accessorKey: 'wetMill.process', header: t('tables.process'), size: 15 },
    ],
    [i18n.language]
  );

  return (
    <>
      <div className="overflow-hidden">
        <MaterialReactTable
          enableStickyHeader={true}
          columns={columData}
          editingMode="modal" //default
          enableEditing={true}
          onEditingRowSave={handleSaveRow}
          data={batches}
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
            sorting: [{ id: 'Name', desc: false }],
            showGlobalFilter: true,
            isLoading: false,
          }}
        />
      </div>
    </>
  );
};
