
    import React, { useState, useEffect } from 'react';

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
               if (hostname.includes("copracnil")) {
                   companyName = "COPRACNIL";
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

    }
