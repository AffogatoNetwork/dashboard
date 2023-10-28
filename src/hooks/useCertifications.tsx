import { useEffect, useState } from "react";
import { getAllFarmers } from "../db/firebase";

export const useCertifications = () => {
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(true);
    const [certifications, setCertifications] = useState<any>([]);
    const [certificationsCount, setCertificationsCount] = useState(0);
    const [ownerAddress, setOwnerAddress] = useState<string | null>(null);

    const load = async () => {
        // const certificationList = new Array<FarmerType>();
        const certificationList: any = [];
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

        const result: any = await getAllFarmers(companyName);

        for (let i = 0; i < result.length; i += 1) {
            const farmerCertificates = result[i].data();
            const {
                address,
                area,
                usda,
                spp,
                manosdemujer,
                fairtrade,
                fullname,
                femaleMenbers,
                maleMenbers,

            } = farmerCertificates;

            certificationList.push({
                address,
                area,
                usda,
                spp,
                manosdemujer,
                fairtrade,
                fullname,
                femaleMenbers,
                maleMenbers,
            });
        }

        setCertifications(certificationList);
        const itemsCount = certificationList.length;
        setCertificationsCount(itemsCount);
    }


    useEffect(() => {
        load();
    }, [reload]);

    return [certifications, certificationsCount, ownerAddress, setReload] as const
};
