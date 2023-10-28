import MaterialReactTable, { MaterialReactTableProps, MRT_ColumnDef } from "material-react-table";
import {editFarm, editFarmers} from "../../db/firebase";
import { useTranslation } from "react-i18next";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useFarmers } from "../../hooks/useFarmers";
import React, {useMemo, useState} from "react";
import Box from "@mui/material/Box";
import QRCode from "react-qr-code";
import reactNodeToString from "react-node-to-string";
export const EditFarmersModule = () => {
    const { t, i18n } = useTranslation();
    const [farmers, farmersCount, ownerAddress, setReload] = useFarmers();

    const [tableData, setTableData] = useState<any[]>(() => farmers);

    const handleSaveRow: MaterialReactTableProps<any>['onEditingRowSave'] =
        async ({ exitEditingMode, row, values }) => {
            try {
                await editFarmers(values);
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
                header: t('tables.name'), accessorKey: 'fullname'
            }, {
                header: t('tables.sex'), accessorKey: 'gender'
            }, {
                header: t('tables.female-members'), accessorKey: 'femaleMenbers'
            }, {
                header: t('tables.male-members'), accessorKey: 'maleMenbers'
            }, {
                header: t('tables.community'), accessorKey: 'region'
            }, {
                header: t('tables.municipality'), accessorKey: 'village2'
            },{
                header: t('tables.country'), accessorKey: 'country'
            },{
                header: t('address'), accessorKey: 'address' , enableEditing: false,
            }
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
                    data={farmers}
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
                        showGlobalFilter: true, isLoading: false
                    }}
                />
            </div>
        </>
    )
}
