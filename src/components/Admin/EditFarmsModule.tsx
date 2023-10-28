import React, {Component, useMemo, useState} from 'react';
import MaterialReactTable, { MaterialReactTableProps, MRT_ColumnDef } from "material-react-table";
import { editFarm } from "../../db/firebase";
import { useTranslation } from "react-i18next";
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { useFarms } from "../../hooks/useFarms";
import Box from "@mui/material/Box";
import QRCode from "react-qr-code";
import reactNodeToString from "react-node-to-string";

export const EditFarmsModule = () => {
    const { t, i18n } = useTranslation();
    const [farmers, farmersCount, ownerAddress, setReload] = useFarms();

    const [tableData, setTableData] = useState<any[]>(() => farmers);

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
                header: t('tables.name'), accessorKey: 'name',
            }, {
                header: t('tables.community'), accessorKey: 'village'
            }, {
                header: t('tables.municipality'), accessorKey: 'village2'
            }, {
                header: t('region'), accessorKey: 'state'
            }, {
                header: t('country'), accessorKey: 'country'
            },
            {
                header: t('longitude'), accessorKey: 'longitude'
            }, {
                header: t('latitude'), accessorKey: 'latitude'
            }, {
                accessorFn: (farm: any) => `${farm.area} `,
                header: t('area') + '  ' +'(mz)', size: 5,
                Cell(props) {
                    return (
                        <div className="text-center">
                            {props.renderedCellValue}
                        </div>
                    );

                },
            },{
                header: t('tables.coffee-varieties'), accessorKey: 'varieties'
            },{
                accessorFn: (farm: any) => `${farm.height} `,
                header: t('height'), size: 10,
                Cell(props) {
                    return (
                        <div className="text-center">
                            {props.renderedCellValue}
                        </div>
                    );

                },
            },

            {
                header: t('tables.production-system'), accessorKey: 'shadow'
            },{
                header: t('address'), accessorKey: 'address', enableEditing: false,
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
                            header: 'Acciones',
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
