import React, {Component, useMemo, useState} from 'react';
import MaterialReactTable, { MaterialReactTableProps, MRT_ColumnDef } from "material-react-table";
import { editFarm } from "../../db/firebase";
import { useTranslation } from "react-i18next";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useBatches } from "../../hooks/useBatches";

export const EditBatchesModule = () => {
    const { t, i18n } = useTranslation();
    const [batches, batchesCount, ownerAddress, setReload] = useBatches();

    const [tableData, setTableData] = useState<any[]>(() => batches);

    const handleSaveRow: MaterialReactTableProps<any>['onEditingRowSave'] =
        async ({ exitEditingMode, row, values }) => {
            try {
                await editFarm(values);
                tableData[row.index] = values;
                setTableData([...tableData]);
                setReload(true);
                exitEditingMode();
            } catch (error) {
            }
        };

    const columData = useMemo<MRT_ColumnDef<any>[]>(
        () => [

            {
                accessorFn: (farmers: any) => `${farmers.ipfsHash.substring(0, 6)} , ${farmers.Name}  ${farmers.parentId}  `, //accessorFn used to join multiple data into a single cell
                id: 'name', //id is still required when using accessorFn instead of accessorKey
                header: t("batch-id"), size: 25,
                Cell(props) {
                    return (
                        <div className="text-left">
                            {props.renderedCellValue}
                        </div>
                    );
                },
            }, {
                accessorFn: (farmers: any) => `${farmers.dryMill.average_height}`, //accessorFn used to join multiple data into a single cell
                header: t("tables.height-lot"), size: 15,
                Cell(props) {
                    if (props.renderedCellValue === 'undefined') {
                        return (
                            <div className="text-left">
                                {"Aprox 1200"}
                            </div>
                        );
                    }
                    return (
                        <div className="text-left">
                            {props.renderedCellValue || "Aprox 1200"}
                        </div>
                    );
                },
            }, {
                header: t('tables.batch-weight'), accessorKey: 'dryMill.weight', size: 15,
            },

            {
                header: t('tables.tasting-note'), accessorKey: 'farmers.dryMill.note', size: 15,
            },
            {
                header: t('cupping_url'), accessorKey: 'farmers.dryMill.cupping_url', size: 15,
            },
        ],
        [i18n.language],
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
                            header: 'edit',
                        },
                    }}
                    enableColumnActions={false}
                    enableFilters={true}
                    localization={MRT_Localization_ES}
                    initialState={{
                        sorting: [{ id: 'name', desc: false }],
                        showGlobalFilter: true, isLoading: false
                    }}
                />
            </div>
        </>
    )
}


