import React, { Component, useEffect, useRef, useState } from 'react'
import Form from "react-bootstrap/Form";

import User from "../../assets/user.png";
import { getAllFarmers, updateFarmerImage } from '../../db/firebase';


export const EditProfilePhotoModule = () => {
    const [selectedImage, setSelectedImage] = useState("");
    const [imageFile, setImageFile] = useState();
    const hiddenFileInput = useRef(null);
    const [farmAddress, setFarmAddress] = useState("");
    const [currentCoop, setCurrentCoop] = useState("");
    const [farmerList, setFarmerList] = useState<Array<any>>([]);
    const [farmers, setFarmers] = useState<Array<any>>([]);

    useEffect(() => {

        const load = async () => {
            const location = window.location.host;
            console.log(location);
            let currentCoop = "";
            if (location.match("COMMOVEL") !== null) {
                currentCoop = "COMMOVEL"
            }
            if (location.match("copracnil") !== null) {
                currentCoop = "COPRACNIL"
            }
            if (location.match("comsa") !== null) {
                currentCoop = "COMSA"
            }
            if (location.match("proexo") !== null) {
                currentCoop = "PROEXO"
            }
            if (location.match("cafepsa") !== null) {
                currentCoop = "CAFEPSA"
            } else {
                currentCoop = "PROEXO"
            }
            setCurrentCoop(currentCoop);
            console.log(currentCoop);
            getAllFarmers(currentCoop).then((result) => {
                console.log(result);
                for (let i = 0; i < result.length; i += 1) {
                    const farmerData = result[i].data();
                    const {
                        address,
                        fullname,
                    } = farmerData;

                    farmerList.push({
                        address,
                        fullname,
                    });
                }
                setFarmers(farmerList);
                console.log(farmers);
                // calculateFarmersCount(result);
            });
        };

        load();
    }, []);





    const handleOnImageChange = (event: any) => {
        if (event.target.files !== null) {
            setImageFile(event.target.files[0]);
            setSelectedImage(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleClick = (event: any) => {
        if (hiddenFileInput) {
            // @ts-ignore
            hiddenFileInput.current.click();
        } else {
        }
    };

    const handleFarmerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const key = event.target.value;
        console.log(key);
        setFarmAddress(key);
    }

    const updatePhoto = () => {
        updateFarmerImage(farmAddress, imageFile);
        console.log(farmAddress);
    };

    return (
        <>
            <div className='bg-white p-4 px-4 md;p-8 mb-6 rounded-b-lg'>
                <div className='grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-2 justify-items-center'>
                    <div className="md:col-span-1">
                        <div className="flex avatar w-24 bg-red-500  mx-auto">
                            <img
                                src={selectedImage !== "" ? selectedImage : User}
                                className="rounded-xl"
                                onClick={handleClick}
                            />
                            <Form.Control
                                type="file"
                                placeholder="Seleccione imagen."
                                onChange={handleOnImageChange}
                                ref={hiddenFileInput}
                                style={{ display: "none" }}
                                className="input input-bordered "
                            />
                        </div>
                    </div>
                    <div className="md:col-span-1">
                        <div className="md:col-span-1 m-2">
                            <h1 className="text-base font-medium"> Productor </h1>
                            <select id="dropdown-cooperative" className="select select-bordered w-full" onChange={handleFarmerChange}>
                                <option disabled selected><> {"Buscar Productor"}</>
                                    :
                                </option>
                                {farmers.map((item) => (<option key={item.key} value={item.address}>
                                    {item.fullname}
                                </option>))}
                            </select>
                        </div>
                        <button className='btn btn-primary' onClick={() => updatePhoto()}> Actualizar Foto</button>

                    </div>
                </div>
            </div>
        </>


    )

}
