import { useEffect, useState } from "react";
import { getAllFarmers } from "../db/firebase";

type FarmerType = {
    farmerId: string;
    femaleMenbers: number;
    maleMenbers: number;
    address: string;
    fullname: string;
    familyMembers: string;
    bio: string;
    country: string;
    gender: string;
    farm: string;
    location: string;
    region: string;
    village: string;
    village1: string;
    village2: string;
    qrCode: string;
    blockChainUrl: string;
    search: string;
};


export const useFarmers = () => {
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(true);
    const [farmers, setFarmers] = useState<any>([]);
    const [farmersCount, setFarmersCount] = useState(0);
    const [ownerAddress, setOwnerAddress] = useState<string | null>(null);

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

        const result: any = await getAllFarmers(companyName);

        for (let i = 0; i < result.length; i += 1) {
            const farmerData = result[i].data();

            const {
                farmerId,
                femaleMenbers,
                maleMenbers,
                address,
                fullname,
                familyMembers,
                country,
                gender,
                farm,
                location,
                region,
                village,
                village1,
                village2,
            } = farmerData;


            farmerList.push({
                farmerId,
                femaleMenbers,
                maleMenbers,
                address,
                fullname,
                familyMembers,
                country,
                gender,
                farm,
                location,
                region,
                village,
                village1,
                village2,
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
