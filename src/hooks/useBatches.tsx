import { useEffect, useState } from "react";
import { getAllBatches } from "../db/firebase";

type BatchType = {
    Name: string;
    ipfsHash: string;
    parentId: string;
    dryMill: {};
    wetMill: {};
    Profile: {};
    Roasting: {};
};


export const useBatches = () => {
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(true);
    const [batches, setBatches] = useState<any>([]);
    const [batchesCount, setBatchesCount] = useState(0);
    const [ownerAddress, setOwnerAddress] = useState<string | null>(null);

    const load = async () => {
        // const batchList = new Array<FarmerType>();
        const batchList: any = [];
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

        const result: any = await getAllBatches(companyName);

        for (let i = 0; i < result.length; i += 1) {
            const batchData = result[i].data();

            const {
                Name = "",
                parentId,
                ipfsHash,
                dryMill = {},
                wetMill = {},
                Profile = {},
                Roasting = {},
            } = batchData;


            batchList.push({
                Name,
                parentId,
                ipfsHash,
                dryMill,
                wetMill,
                Profile,
                Roasting,
                }
            );

        }

        setBatches(batchList);
        const itemsCount = batchList.length;
        setBatchesCount(itemsCount);
    }


    useEffect(() => {
        load();
    }, [reload]);

    return [batches, batchesCount, ownerAddress, setReload] as const
};
