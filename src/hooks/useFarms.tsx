import { useEffect, useState } from "react";
import { getAllFarmsByCompany } from "../db/firebase";

type FarmType = {
    area: number;
    address: string;
    height: number;
    ipfshash: string;
    latitude: number;
    longitude: number;
    name?: string;
    shadow: string;
    varieties: string;
    country: string;
    village: string;
    state: string;
    village2: string;
    qrCode: string;
    blockChainUrl: string;
};



export const useFarms = () => {
    const [reload, setReload] = useState(false);


    const [loading, setLoading] = useState(true);
    // const [farms, setFarms] = useState<Array<FarmerType>>([]);
    const [farms, setFarms] = useState<any>([]);
    const [farmsCount, setFarmsCount] = useState(0);
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
            companyName = "PROEXO";
        }

        const result: any = await getAllFarmsByCompany(companyName);

        for (let i = 0; i < result.length; i += 1) {
            const farmerData = result[i].data();

            const {
                area,
                farmerAddress: address,
                height,
                name,
                ipfshash,
                latitude,
                longitude,
                fullname,
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

        setFarms(farmerList);
        const itemsCount = farmerList.length;
        setFarmsCount(itemsCount);
    }


    useEffect(() => {
        load();
    }, [reload]);


    return [farms, farmsCount, ownerAddress, setReload] as const
};
