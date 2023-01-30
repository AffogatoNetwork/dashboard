
    import React, { useState, useEffect } from 'react';
    import { DataTable } from 'primereact/datatable';
    import { Column } from 'primereact/column';
    import { Button } from 'primereact/button';
    import { Ripple } from 'primereact/ripple';
    import { Dropdown } from 'primereact/dropdown';
    import { InputText } from 'primereact/inputtext';
    import { classNames } from 'primereact/utils';
    import {getAllFarmers} from "../db/firebase";

    type FarmerType = {
        farmerId: string;
        address: string;
        fullname: string;
        bio: string;
        gender: string;
        location: string;
        search: string;
    };

    export const FarmerData = () => {
        const [customers1, setCustomers1] = useState([]);
        const [customers2, setCustomers2] = useState([]);
        const [customers3, setCustomers3] = useState([]);
        const [first1, setFirst1] = useState(0);
        const [rows1, setRows1] = useState(10);
        const [first2, setFirst2] = useState(0);
        const [rows2, setRows2] = useState(10);
        const [currentPage, setCurrentPage] = useState(1);
        const [pageInputTooltip, setPageInputTooltip] = useState('Press \'Enter\' key to go to this page.');


        const onCustomPage1 = (event:any) => {
            setFirst1(event.first);
            setRows1(event.rows);
            setCurrentPage(event.page + 1);
        }

        const onCustomPage2 = (event:any) => {
            setFirst2(event.first);
            setRows2(event.rows);
        }

        const onPageInputKeyDown = (event:any, options:any) => {
            if (event.key === 'Enter') {
                const page = parseInt(String(currentPage));
                if (page < 1 || page > options.totalPages) {
                    setPageInputTooltip(`Value must be between 1 and ${options.totalPages}.`);
                }
                else {
                    const first = currentPage ? options.rows * (page - 1) : 0;

                    setFirst1(first);
                    setPageInputTooltip('Press \'Enter\' key to go to this page.');
                }
            }
        }

        const onPageInputChange = (event:any) => {
            setCurrentPage(event.target.value);
        }

       const [loading, setLoading] = useState(true);
       const [farmers, setFarmers] = useState<Array<FarmerType>>([]);
       const [farmers2, setFarmers2] = useState<Array<FarmerType>>([]);
       useEffect(() => {
           const load = async () => {
               const farmerList = new Array<FarmerType>();
               let companyName = "PROEXO";
               const hostname = window.location.hostname;
               if (hostname.includes("copranil")) {
                   companyName = "COPRANIL";
               } else if (hostname.includes("commovel")) {
                   companyName = "COMMOVEL";
               } else if (hostname.includes("comsa")) {
                   companyName = "COMSA";
               }
               await getAllFarmers(companyName).then((result) => {
                   for (let i = 0; i < result.length; i += 1) {
                       const farmerData = result[i].data();
                       const {
                           farmerId,
                           address,
                           fullname,
                           bio,
                           gender,
                           village,
                           region,
                           country,
                       } = farmerData;
                       const l = village
                           .concat(", ")
                           .concat(region)
                           .concat(", ")
                           .concat(country);
                       const s = farmerId
                           .concat(fullname)
                           .concat(bio)
                           .concat(l);
                       farmerList.push({
                           farmerId,
                           address,
                           fullname,
                           bio,
                           gender,
                           location: l,
                           search: s.toLowerCase(),
                       });
                   }
                   setFarmers(farmerList);
                   setFarmers2(farmerList);
                   // calculateFarmersCount(result);
               });
               setLoading(false);
           };
           load();
       }, []);

        const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
        const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;
        const template1 = {
            layout: 'PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport',
            'PrevPageLink': (options:any) => {
                return (
                    <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                        <span className="p-3">Previous</span>
                        <Ripple />
                    </button>
                )
            },
            'NextPageLink': (options:any) => {
                return (
                    <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                        <span className="p-3">Next</span>
                        <Ripple />
                    </button>
                )
            },
            'PageLinks': (options:any) => {
                if ((options.view.startPage === options.page && options.view.startPage !== 0) || (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
                    const className = classNames(options.className, { 'p-disabled': true });

                    return <span className={className} style={{ userSelect: 'none' }}>...</span>;
                }

                return (
                    <button type="button" className={options.className} onClick={options.onClick}>
                        {options.page + 1}
                        <Ripple />
                    </button>
                )
            },
            'RowsPerPageDropdown': (options:any) => {
                const dropdownOptions = [
                    { label: 10, value: 10 },
                    { label: 20, value: 20 },
                    { label: 50, value: 50 },
                    { label: 'All', value: options.totalRecords }
                ];

                return <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />;
            },
            'CurrentPageReport': (options:any) => {
                return (
                    <span className="mx-3" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                    Go to <InputText  className="ml-1" value={currentPage} tooltip={pageInputTooltip}
                                     onKeyDown={(e) => onPageInputKeyDown(e, options)} onChange={onPageInputChange}/>
                </span>
                )
            }
        };
        const template2 = {
            layout: 'RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink',
            'RowsPerPageDropdown': (options:any) => {
                const dropdownOptions = [
                    { label: 10, value: 10 },
                    { label: 20, value: 20 },
                    { label: 50, value: 50 }
                ];

                return (
                    <React.Fragment>
                        <span className="mx-1" style={{ color: 'var(--text-color)', userSelect: 'none' }}>Items per page: </span>
                        <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />
                    </React.Fragment>
                );
            },
            'CurrentPageReport': (options:any) => {
                return (
                    <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                    {options.first} - {options.last} of {options.totalRecords}
                </span>
                )
            }
        };

        return (
            <div>
                <div className="card">
                    <h5>Basic</h5>
                    <DataTable value={farmers} paginator responsiveLayout="scroll"
                               paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                               currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10,20,50]}
                               paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                        <Column field="name" header="Name" style={{ width: '25%' }}></Column>
                        <Column field="country.name" header="Country" style={{ width: '25%' }}></Column>
                        <Column field="company" header="Company" style={{ width: '25%' }}></Column>
                        <Column field="representative.name" header="Representative" style={{ width: '25%' }}></Column>
                    </DataTable>
                </div>


            </div>
        );
    }
