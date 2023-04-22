import React, {useEffect, useState} from "react";
import {BigNumber, ethers} from "ethers";
import {Contract, Provider, setMulticallAddress} from "ethers-multicall";
import {gql, useQuery} from "@apollo/client";
import {useTranslation} from "react-i18next";
import "../../styles/batchlist.scss";
import QRCode from "react-qr-code";
import Loading from "../Loading";
import {useAuthContext} from "../../states/AuthContext";
import {ipfsUrl, SEARCH_DIVIDER} from "../../utils/constants";
import FormInput from "../common/FormInput";
import {CustomPagination} from "../common/Pagination";
import {CoffeeBatchType} from "../common/types";
import CoffeeBatch from "../../contracts/CoffeBatch.json";
import BatchItem from "./BatchItem";
import {getCompanyAddresses, getCompanyAddressesByHost, getDefaultProvider, isNumber,} from "../../utils/utils";
import {SearchIcon} from "../icons/search";
import {ClearIcon} from "../icons/clear";
import {LinkIcon} from "../icons/link";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const openInNewTab = (url: string | URL | undefined) => {
    window.open(url, '_blank', 'noopener,noreferrer');
};

const saveSvgAsPng = require("save-svg-as-png");

const pagDefault = {
    previous: 0, current: 0, next: 0, pages: 0, itemsPerPage: 10, itemsCount: 0, lastId: "0",
};

export const List = () => {
    const {t} = useTranslation();
    const {authState} = useAuthContext();
    const [state] = authState;
    const [currentEthCallProvider, setCurrentEthCallProvider] = useState<Provider | null>(null);
    const [cbContract, setCbContract] = useState<Contract>();
    const [coffeeBatchList, setCoffeeBatchList] = useState<Array<CoffeeBatchType>>([]);
    const [coffeeBatchList2, setCoffeeBatchList2] = useState<Array<CoffeeBatchType>>([]);
    const [batchesCount, setBatchesCount] = useState(0);
    const [pagination, setPagination] = useState(pagDefault);
    const [loadingIpfs, setLoadingIpfs] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [blockchainUrl, setBlockchainUrl] = useState("");
    const [isAuth, setAuth] = useState(true);
    const [companyAddresses, setCompanyAddresses] = useState<Array<string>>([]);
    const [searchCriteria, setSearchCriteria] = useState("");
    const [minHeight, setMinHeight] = useState("0");
    const [minWeight, setMinWeight] = useState("0");
    const [maxWeight, setMaxWeight] = useState("");
    const [minNote, setMinNote] = useState("0");
    const [maxNote, setMaxNote] = useState("100");
    const [minHeightError, setMinHeightError] = useState("");
    const [minWeightError, setMinWeightError] = useState("");
    const [maxWeightError, setMaxWeightError] = useState("");
    const [minNoteError, setMinNoteError] = useState("");
    const [maxNoteError, setMaxNoteError] = useState("");
    const [ownerAddress, setOwnerAddress] = useState<string | null>(null);

    setMulticallAddress(10, "0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a");

    const batchesQuery = gql`
        query getCoffeeBatches($owners: [String!]!) {
            coffeeBatches(
                first: 1000
                orderBy: block
                orderDirection: desc
                where: { owner_in: $owners, block_gt: 22693767 }
            ) {
                id
            }
        }
    `;

    const confPagination = (bData: Array<any>, itemsPerPage: number) => {
        if (bData.length > 0) {
            const lastCBId = bData[bData.length - 1].id;
            const itemsCount = batchesCount;
            const pages = Math.ceil(itemsCount / itemsPerPage);
            const lastDataPage = Math.ceil(itemsCount / itemsPerPage);
            const pag = {
                previous: 0, current: 1, next: 2, pages, lastDataPage, itemsPerPage, itemsCount, lastId: lastCBId,
            };
            setPagination(pag);
        } else {
            setPagination(pagDefault);
        }
    };

    const loadBatch = async (batchId: number, ipfsHash: any) => {

        const user = localStorage.getItem("address")
        if(user !== ""){
            setOwnerAddress(user)
        } else {
            let companyName = "proexo";
            const hostname = window.location.hostname;
            if (hostname.includes("proexo")) {
                companyName = "PROEXO";
            }else if (hostname.includes("copracnil")) {
                companyName = "COPRACNIL";
            } else if (hostname.includes("commovel")) {
                companyName = "COMMOVEL";
            } else if (hostname.includes("comsa")) {
                companyName = "COMSA";
            }
        }



        const batchList = coffeeBatchList;
        const url = ipfsUrl.concat(ipfsHash);
        setBlockchainUrl(url);
        fetch(url)
            .then((response) => response.json())
            .then((jsonData) => {
                console.log(jsonData)
                let cooperative ={}
                let farmer = {};
                let farm = {};
                let wetMill = {
                    variety: undefined
                };
                let dryMill = {};
                let cupProfile = {};
                let roasting = {
                    type: undefined
                };
                for (let i = 0; i < jsonData.attributes.length; i += 1) {
                    const traitType = jsonData.attributes[i].trait_type.toLowerCase();
                    if(traitType === "cooperative"){
                        [cooperative] = jsonData.attributes[i].value;
                    }
                    if (traitType === "farmer") {
                        [farmer] = jsonData.attributes[i].value;
                    }
                    if (traitType === "farm") {
                        [farm] = jsonData.attributes[i].value;
                    }
                    if (traitType === "profile") {
                        if (cupProfile !== null) {
                            [cupProfile] = jsonData.attributes[i].value;
                        }
                    }
                    if (traitType === "wet mill") {
                        if (wetMill !== null) {
                            [wetMill] = jsonData.attributes[i].value;
                        }
                    }
                    if (traitType === "dry mill") {
                        [dryMill] = jsonData.attributes[i].value;
                    }
                    if (traitType === "roasting") {
                        [roasting] = jsonData.attributes[i].value;
                    }
                }
                let cooffeeBatch = {
                    id: batchId,
                    cooperative,
                    name: jsonData.name,
                    description: jsonData.description,
                    image: jsonData.image,
                    ipfsHash,
                    farmer,
                    farm,
                    wetMill,
                    dryMill,
                    roasting,
                    cupProfile,
                };
                console.log(cooffeeBatch.roasting);
                const hasCopperative = {
                    cooperative: cooffeeBatch.cooperative,
                }

                const id ={
                    batchList: cooffeeBatch.ipfsHash,
                }

                const exist = {
                    variety: cooffeeBatch.roasting.type,
                }

             const skywalker = batchList.find(item => item.ipfsHash === "QmbsQCk923PTwdCG8pYYHiwzYM9UbM1Pdhbdc1i1Z3v5m9"
             );

                if (skywalker?.id != null) {
                    console.log(skywalker)
                    const removeIndex = batchList.map(item => item.id).indexOf(skywalker?.id);
                    batchList.splice(removeIndex, 1);
                }


                if (hasCopperative.cooperative !== undefined && exist.variety !== undefined) {
                }


                batchList.push(cooffeeBatch);



                const total = batchList.length
                setBatchesCount(total);
                setCoffeeBatchList(batchList.slice(-3));
                setCoffeeBatchList2(batchList.slice(-3));
            });
    };

    const loadBatchesData = async (cbData: any) => {
        if (cbContract) {
            setCoffeeBatchList([]);
            setCoffeeBatchList2([]);
            const ethcalls = [];
            for (let i = 0; i < cbData.length; i += 1) {
                const batchCall = await cbContract?.tokenURI(BigNumber.from(cbData[i].id));
                ethcalls.push(batchCall);
            }
            if (ethcalls.length > 0) {
                const allCalls = await currentEthCallProvider?.all(ethcalls);
                if (allCalls) {
                    for (let i = 0; i < allCalls?.length; i += 1) {
                        await loadBatch(cbData[i].id, allCalls[i]);
                    }
                }
            }
            confPagination(cbData, isAuth ? 10 : 12);
            setDataLoaded(true);
            setLoadingIpfs(false);
        } else {
            setLoadingIpfs(false);
        }
    };

    const {loading, data, refetch, error} = useQuery(batchesQuery, {
        variables: {
            owners: companyAddresses,
        }, fetchPolicy: "no-cache", notifyOnNetworkStatusChange: true, onError: () => {
        }, onCompleted: () => {
            if (data.coffeeBatches.length > 0) {
                setLoadingIpfs(true);
                loadBatchesData(data.coffeeBatches);
            }
        },
    });

    useEffect(() => {
            const loadProvider = async () => {

                let ethcallProvider = null;


                if (state.provider !== null) {
                    ethcallProvider = new Provider(state.provider);
                    const signer = state.provider.getSigner();
                    const address = await signer.getAddress();
                    setCompanyAddresses(getCompanyAddresses(address));
                    setAuth(true);
                } else {
                    const provider = getDefaultProvider();
                    const randomSigner = ethers.Wallet.createRandom().connect(provider);
                    ethcallProvider = new Provider(randomSigner.provider);
                    setCompanyAddresses(getCompanyAddressesByHost(window.location.host));
                    setAuth(false);
                }
                if (ethcallProvider !== null) {
                    await ethcallProvider.init();
                    // Set CoffeBatch contracts
                    const currentCoffeeBatch = new Contract(CoffeeBatch.address, CoffeeBatch.abi);
                    setCbContract(currentCoffeeBatch);
                    setCurrentEthCallProvider(ethcallProvider);
                    if (!dataLoaded) {
                        refetch();
                    }
                }
            };
            loadProvider();
        }, // eslint-disable-next-line
        [state.provider]);

    const onPageSelected = (pageNumber: number) => {
        const nextPage = pageNumber === pagination.pages ? 0 : pageNumber + 1;
        const newPagination = {
            ...pagination, previous: pageNumber === 1 ? 0 : pageNumber - 1, current: pageNumber, next: nextPage,
        };
        setPagination(newPagination);
    };

    const showQrModal = (url: string) => {
        setQrCodeUrl(url);
    };

    const handleOnDownloadClick = () => {
        saveSvgAsPng.saveSvgAsPng(document.getElementById("qr-coffe-batch"), "qr-coffe-batch", {
            scale: 10,
            backgroundColor: 'white'
        });
    };

    const filterByCriteria = (c: CoffeeBatchType) => {
        const s = c.farm.name
            .concat(SEARCH_DIVIDER)
            .concat(c.wetMill.variety)
            .concat(SEARCH_DIVIDER)
            .concat(c.wetMill.process)
            .concat(SEARCH_DIVIDER)
            .concat(c.wetMill.drying_type)
            .concat(SEARCH_DIVIDER)
            .concat(c.farm.village)
            .concat(SEARCH_DIVIDER)
            .concat(c.farm.region)
            .toLowerCase();

        return s.includes(searchCriteria.toLowerCase());
    };

    const filterByHeight = (c: CoffeeBatchType) => {
        const n = c.farm.altitude ? c.farm.altitude : "";
        let include = true;
        if (isNumber(minHeight)) {
            include = n >= parseInt(minHeight);
        }
        return include;
    };

    const filterByWeight = (c: CoffeeBatchType) => {
        const n = c.dryMill.weight;
        let include = true;
        if (isNumber(minWeight)) {
            include = n >= parseInt(minWeight);
        }
        if (isNumber(maxWeight)) {
            include = n <= parseInt(maxWeight);
        }
        return include;
    };

    const filterByNote = (c: CoffeeBatchType) => {
        const n = c.dryMill.note;
        let include = true;
        if (isNumber(minNote)) {
            include = n >= parseInt(minNote);
        }
        if (isNumber(maxNote)) {
            include = n <= parseInt(maxNote);
        }
        return include;
    };

    const filterBatches = () => {
        let cbList = coffeeBatchList2.slice();
        if (searchCriteria.length > 0) {
            cbList = cbList.filter(filterByCriteria);
        }
        cbList = cbList.filter(filterByHeight);
        cbList = cbList.filter(filterByWeight);
        cbList = cbList.filter(filterByNote);

        setCoffeeBatchList2(cbList);
        confPagination(cbList, isAuth ? 10 : 12);
    };

    const handleSearchCriteriaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value;
        setSearchCriteria(input);
    };

    const handleSearchCriteriaKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const input = event.currentTarget.value.trim();
        if (event.key === "Enter" && input.length > 1) {
            filterBatches();
        }
    };

    const handleMinHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value.trim();
        setMinHeight(input);
        if (!isNumber(input)) {
            setMinHeightError("Valor no valido");
        } else {
            setMinHeightError("");
        }
    };

    const handleMinWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value.trim();
        setMinWeight(input);
        if (!isNumber(input)) {
            setMinWeightError("Valor no valido");
        } else {
            setMinWeightError("");
        }
    };

    const handleMaxWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value.trim();
        setMaxWeight(input);
        if (!isNumber(input)) {
            setMaxWeightError("Valor no valido");
        } else {
            setMaxWeightError("");
        }
    };

    const handleMinNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value.trim();
        setMinNote(input);
        if (!isNumber(input)) {
            setMinNoteError("Valor no valido");
        } else {
            setMinNoteError("");
        }
    };

    const handleMaxNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target.value.trim();
        setMaxNote(input);
        if (!isNumber(input)) {
            setMaxNoteError("Valor no valido");
        } else {
            setMaxNoteError("");
        }
    };

    const onSearchClick = () => {
        filterBatches();
    };

    const onClearClick = () => {
        setSearchCriteria("");
        setMinHeight("0");
        setMinWeight("0");
        setMaxWeight("");
        setMinNote("0");
        setMaxNote("100");
        setMinHeightError("");
        setMinWeightError("");
        setMaxWeightError("");
        setMinNoteError("");
        setMaxNoteError("");
        setCoffeeBatchList2(coffeeBatchList);
        confPagination(coffeeBatchList2, isAuth ? 10 : 12);
    };

    const RenderFilters = () => (<>
            <div className="w-full p-5 rounded-lg">
                <div className="text-center text-lg text-black ">
                    <>{t("search-batches")}</>
                </div>
                <div className="relative">
                    <div className="absolute flex items-center ml-2 h-full">
                        <SearchIcon className="m-4 w-4 h-4 fill-current"/>
                    </div>

                    <FormInput
                        label={t("")}
                        value={searchCriteria}
                        placeholder={t("search")}
                        handleOnChange={handleSearchCriteriaChange}
                        handleOnKeyDown={handleSearchCriteriaKeyDown}
                        errorMsg=""
                        className="px-8 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"/>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mt-4">
                    <FormInput
                        label={t("min-height")}
                        value={minHeight}
                        placeholder={t("min-height")}
                        handleOnChange={handleMinHeightChange}
                        errorMsg={minHeightError}
                        className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"/>

                    <FormInput
                        label={t("min-weight")}
                        value={minWeight}
                        placeholder={t("min-weight")}
                        handleOnChange={handleMinWeightChange}
                        errorMsg={minWeightError}
                        className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"/>

                    <FormInput
                        label={t("max-weight")}
                        value={maxWeight}
                        placeholder={t("max-weight")}
                        handleOnChange={handleMaxWeightChange}
                        errorMsg={maxWeightError}
                        className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"/>

                    <FormInput
                        label={t("min-note")}
                        value={minNote}
                        placeholder={t("min-note")}
                        handleOnChange={handleMinNoteChange}
                        errorMsg={minNoteError}
                        className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"/>

                    <FormInput
                        label={t("max-note")}
                        value={maxNote}
                        placeholder={t("max-note")}
                        handleOnChange={handleMaxNoteChange}
                        errorMsg={maxNoteError}
                        className="px-4 py-3 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"/>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 m-4">


                    <button onClick={() => onSearchClick()} className="btn font-bold py-2 px-4 rounded inline-flex items-center rounded-md bg-amber-200 active:text-white hover:text-white
                                        focus:bg-amber-400 active:bg-amber-600">
                        <SearchIcon className="w-4 h-4 mr-2"/>
                        <>{t("search")}</>
                    </button>
                    <button onClick={() => onClearClick()} className="btn font-bold py-2 px-4 rounded inline-flex items-center rounded-md bg-red-200 active:text-white hover:text-white
                                        focus:bg-red-400 active:bg-red-700">
                        <ClearIcon className="w-4 h-4 mr-2"/>
                        <>{t("clear")}</>
                    </button>
                </div>

            </div>
        </>);

    return (<>
            <input type="checkbox" id="coffe-batch" className="modal-toggle"/>
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box relative">
                    <label htmlFor="coffe-batch"
                           className="btn btn-sm bg-red-500 text-white btn-circle hover:bg-red-700 absolute right-2 top-2">✕</label>
                    <div className="flex justify-center m-6">
                        <div>
                            <QRCode id="qr-coffe-batch" value={qrCodeUrl} size={300}/>
                            <div className="flex pt-8 space-x-4 place-content-center">
                                <div>
                                    <button
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                                        onClick={handleOnDownloadClick}>
                                        <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg"
                                             viewBox="0 0 20 20">
                                            <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
                                        </svg>
                                        <>{t("download")}</>
                                    </button>
                                </div>
                                <div>
                                    <button onClick={() => {
                                        openInNewTab(qrCodeUrl);
                                    }}
                                            className="bg-blue-300 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                                        <LinkIcon></LinkIcon>
                                        <>{t("open-link")}</>
                                    </button>
                                </div>

                            </div>
                            <div className="text-center items-center">
                                <br/>
                                <button onClick={() => {
                                    openInNewTab(blockchainUrl);}}
                                        className="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded inline-flex  items-center">
                                    <LinkIcon></LinkIcon>
                                    <>Ver en el blockchain</>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="">
                <div className="batch-list flex flex-row mb-1  justify-between w-full">
                    <div className="w-full h-full ">
                        <div className="card rounded rounded-lg shadow-xl bg-white">
                            {RenderFilters()}
                            <div className="card-body">
                                <div className="card-title grid justify-items-stretch">
                                    <div className="justify-self-start">
                                        <h4>
                                            <>{t("batches")}</>
                                        </h4>
                                    </div>
                                    <div className="justify-self-end">
                                        <h4>
                                            <>
                                                {t("total")}: {batchesCount}
                                            </>
                                        </h4>

                                        {ownerAddress ? (
                                        <a className="link link-info" >
                                            <ReactHTMLTableToExcel
                                                id="table-xls-button"
                                                className="download-xls-button"
                                                table="batches-list"
                                                filename={t("batches")}
                                                sheet={t("batches")}
                                                buttonText={"(".concat(t("download")).concat(")")}
                                            />
                                        </a>
                                        ) : (
                                            <>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="overflow-x-scroll">
                                    {loading || loadingIpfs ? (<Loading
                                            label={t("loading").concat("...")}
                                            className="loading-wrapper"
                                        />) : (<div className="text-center">
                                            <table id="batches-list"
                                                className="coffeebatches w-full sm:bg-white rounded-lg overflow-hidden my-5">
                                                <thead>
                                                <tr className="bg-amber-800 flex flex-col flex-no wrap text-white sm:table-row rounded-l-lg sm:rounded-none mb-2 sm:mb-0">
                                                    <th className="p-3 text-center border-white border">QR</th>
                                                    <th className="p-3 text-center border-white border">
                                                        <>{t("farm")}</>
                                                    </th>
                                                    <th className="p-3 text-center border-white border">
                                                        <>{t("height")}</>
                                                    </th>
                                                    <th className="p-3 text-center border-white border">
                                                        <>{t("location")}</>
                                                    </th>
                                                    <th className="p-3 text-center border-white border">
                                                        <>{t("variety")}</>
                                                    </th>
                                                    <th className="p-3 text-center border-white border">
                                                        <>{t("process")}</>
                                                    </th>
                                                    <th className="p-3 text-center border-white border">
                                                        <>{t("drying-code")}</>
                                                    </th>
                                                    <th className="p-3 text-center border-white border">
                                                        <>{t("drying-type")}</>
                                                    </th>
                                                    <th className="p-3 text-center border-white border">
                                                        <>{t("exporting-code")}</>
                                                    </th>
                                                    <th className="p-3 text-center border-white border">
                                                        <>{t("weight")}</>
                                                    </th>
                                                    <th className="p-3 text-center border-white border">
                                                        <>{t("note")}</>
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody className="flex-1 sm:flex-none">
                                                {coffeeBatchList2.map((batch, index) => (<BatchItem
                                                        key={index}
                                                        index={index}
                                                        coffeeBatch={batch}
                                                        pagination={pagination}
                                                        showQrModal={showQrModal}
                                                    />))}
                                                </tbody>
                                            </table>
                                        </div>)}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>);
};
