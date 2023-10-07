import { useEffect, useState } from "react";
import { getAllFarmsByCompany } from "../db/firebase";

type FarmerType = {
    area: number;
    address: string;
    height: number;
    ipfshash: string;
    latitude: number;
    longitude: number;
    name: string;
    shadow: string;
    varieties: string;
    country: string;
    village: string;
    state: string;
    village2: string;
    qrCode: string;
    blockChainUrl: string;
};



export const useFarmers = () => {
    const [reload, setReload] = useState(false);


    const [loading, setLoading] = useState(true);
    // const [farmers, setFarmers] = useState<Array<FarmerType>>([]);
    const [farmers, setFarmers] = useState<any>([]);
    const [farmersCount, setFarmersCount] = useState(0);
    const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
    const [BlockchainUrl, setBlockchainUrl] = useState<string>('');

    const load = async () => {
        // const farmerList = new Array<FarmerType>();
        const farmerList: any = [];
        const user = localStorage.getItem("address")
        if (user !== "") {
            setOwnerAddress(user)
            setLoading(false);
        }


        let companyName: string = "";
        const url = window.location.host.toString();
        if (url.match("commovel") !== null) {
            companyName = "COMMOVEL";
        }
        if (url.match("copracnil") !== null) {
            companyName = "COPRACNIL";
        }
        if (url.match("comsa") !== null) {
            companyName = "COMSA";
        }
        if (url.match("proexo") !== null) {
            companyName = "PROEXO";
        }
        if (url.match("cafepsa") !== null) {
            companyName = "CAFEPSA";
        }
        if (url.match("localhost") !== null) {
            companyName = "CAFEPSA";
        }

        const result: any = await getAllFarmsByCompany(companyName);

        for (let i = 0; i < result.length; i += 1) {
            const farmerData = result[i].data();

            const {
                area,
                farmerAddress: address,
                height,
                ipfshash,
                latitude,
                longitude,
                fullname: name,
                shadow,
                varieties,
                country,
                village,
                state,
                village2,
            } = farmerData;


            let qrCode = window.location.origin
                .concat("/farmer/")
                .concat(farmerData.farmerAddress);
            let blockChainUrl = "https://affogato.mypinata.cloud/ipfs/" + farmerData.ipfshash;
            setBlockchainUrl(farmerData.farmerAddress);

            farmerList.push({
                area,
                address,
                height,
                ipfshash,
                latitude,
                longitude,
                name,
                shadow,
                varieties,
                country,
                village,
                state,
                village2,
                qrCode: qrCode,
                blockChainUrl: blockChainUrl
            }
            );

        }

        setFarmers(farmerList);
        const itemsCount = farmerList.length;
        setFarmersCount(itemsCount);
    }


    useEffect(() => {
        load();
    }, [reload]);


    return [farmers, farmersCount, ownerAddress, setReload] as const
};