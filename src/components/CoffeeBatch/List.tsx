import React, {useEffect, useState} from "react";
import Card from "react-bootstrap/esm/Card";
import Modal from 'react-modal';
import Table from "react-bootstrap/esm/Table";
import {BigNumber, ethers} from "ethers";
import {Provider, Contract, setMulticallAddress} from "ethers-multicall";
import {useQuery, gql} from "@apollo/client";
import {useTranslation} from "react-i18next";
import "../../styles/batchlist.scss";
import "../../styles/modals.scss";
import QRCode from "react-qr-code";
import Loading from "../Loading";
import {useAuthContext} from "../../states/AuthContext";
import {ipfsUrl, SEARCH_DIVIDER} from "../../utils/constants";
import FormInput from "../common/FormInput";
import {CustomPagination} from "../common/Pagination";
import {CoffeeBatchType} from "../common/types";
import CoffeeBatch from "../../contracts/CoffeBatch.json";
import BatchItem from "./BatchItem";
import {
    getCompanyAddresses,
    getCompanyAddressesByHost,
    getDefaultProvider,
    isNumber,
} from "../../utils/utils";

const saveSvgAsPng = require("save-svg-as-png");

const pagDefault = {
    previous: 0,
    current: 0,
    next: 0,
    pages: 0,
    itemsPerPage: 10,
    itemsCount: 0,
    lastId: "0",
};

export const List = () => {
    const {t} = useTranslation();
    const {authState} = useAuthContext();
    const [state] = authState;
    const [currentEthCallProvider, setCurrentEthCallProvider] =
        useState<Provider | null>(null);
    const [cbContract, setCbContract] = useState<Contract>();
    const [coffeeBatchList, setCoffeeBatchList] = useState<Array<CoffeeBatchType>>([]);
    const [coffeeBatchList2, setCoffeeBatchList2] = useState<Array<CoffeeBatchType>>([]);
    const [batchesCount, setBatchesCount] = useState(0);
    const [pagination, setPagination] = useState(pagDefault);
    const [loadingIpfs, setLoadingIpfs] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
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

    let subtitle: { style: { color: string; }; };
    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

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
            const itemsCount = bData.length;
            const pages = Math.ceil(itemsCount / itemsPerPage);
            const lastDataPage = Math.ceil(itemsCount / itemsPerPage);
            const pag = {
                previous: 0,
                current: 1,
                next: 2,
                pages,
                lastDataPage,
                itemsPerPage,
                itemsCount,
                lastId: lastCBId,
            };
            setPagination(pag);
            setBatchesCount(itemsCount);
        } else {
            setPagination(pagDefault);
        }
    };

    const loadBatch = async (batchId: number, ipfsHash: any) => {
        const batchList = coffeeBatchList;
        const url = ipfsUrl.concat(ipfsHash);

        fetch(url)
            .then((response) => response.json())
            .then((jsonData) => {
                let farmer = {};
                let farm = {};
                let wetMill = {};
                let dryMill = {};
                let cupProfile = {};
                for (let i = 0; i < jsonData.attributes.length; i += 1) {
                    const traitType = jsonData.attributes[i].trait_type.toLowerCase();
                    if (traitType === "farmer") {
                        [farmer] = jsonData.attributes[i].value;
                    }
                    if (traitType === "farm") {
                        [farm] = jsonData.attributes[i].value;
                    }
                    if (traitType === "profile") {
                        [cupProfile] = jsonData.attributes[i].value;
                    }
                    if (traitType === "wet mill") {
                        [wetMill] = jsonData.attributes[i].value;
                    }
                    if (traitType === "dry mill") {
                        [dryMill] = jsonData.attributes[i].value;
                    }
                }
                const cooffeeB = {
                    id: batchId,
                    name: jsonData.name,
                    description: jsonData.description,
                    image: jsonData.image,
                    ipfsHash,
                    farmer,
                    farm,
                    wetMill,
                    dryMill,
                    cupProfile,
                };
                batchList.push(cooffeeB);
                setCoffeeBatchList(batchList.slice());
                setCoffeeBatchList2(batchList.slice());
            });
    };

    const loadBatchesData = async (cbData: any) => {
        if (cbContract) {
            setCoffeeBatchList([]);
            setCoffeeBatchList2([]);
            const ethcalls = [];
            for (let i = 0; i < cbData.length; i += 1) {
                const batchCall = await cbContract?.tokenURI(
                    BigNumber.from(cbData[i].id)
                );
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
        },
        fetchPolicy: "no-cache",
        notifyOnNetworkStatusChange: true,
        onError: () => {
            console.log(error);
        },
        onCompleted: () => {
            if (data.coffeeBatches.length > 0) {
                setLoadingIpfs(true);
                loadBatchesData(data.coffeeBatches);
            }
        },
    });

    useEffect(
        () => {
            const loadProvider = async () => {
                let ethcallProvider = null;

                if (state.provider !== null) {
                    ethcallProvider = new Provider(state.provider);
                    const signer = state.provider.getSigner();
                    const address = await signer.getAddress();
                    // setOwnerAddress(address);
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
                    const currentCoffeeBatch = new Contract(
                        CoffeeBatch.address,
                        CoffeeBatch.abi
                    );
                    setCbContract(currentCoffeeBatch);
                    setCurrentEthCallProvider(ethcallProvider);
                    if (!dataLoaded) {
                        refetch();
                    }
                }
            };
            loadProvider();
        },
        // eslint-disable-next-line
        [state.provider]
    );

    const onPageSelected = (pageNumber: number) => {
        const nextPage = pageNumber === pagination.pages ? 0 : pageNumber + 1;
        const newPagination = {
            ...pagination,
            previous: pageNumber === 1 ? 0 : pageNumber - 1,
            current: pageNumber,
            next: nextPage,
        };
        setPagination(newPagination);
    };

    const showQrModal = (url: string) => {
        setQrCodeUrl(url);
        openModal()
    };

    const handleOnDownloadClick = () => {
        saveSvgAsPng.saveSvgAsPng(
            document.getElementById("current-qr"),
            "qr-coffeebatch",
            {
                scale: 0.5,
            }
        );
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

        setCoffeeBatchList(cbList);
        confPagination(cbList, isAuth ? 10 : 12);
    };

    const handleSearchCriteriaChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const input = event.target.value;
        setSearchCriteria(input);
    };

    const handleSearchCriteriaKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        const input = event.currentTarget.value.trim();
        if (event.key === "Enter" && input.length > 1) {
            filterBatches();
        }
    };

    const handleMinHeightChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const input = event.target.value.trim();
        setMinHeight(input);
        if (!isNumber(input)) {
            setMinHeightError("Valor no valido");
        } else {
            setMinHeightError("");
        }
    };

    const handleMinWeightChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const input = event.target.value.trim();
        setMinWeight(input);
        if (!isNumber(input)) {
            setMinWeightError("Valor no valido");
        } else {
            setMinWeightError("");
        }
    };

    const handleMaxWeightChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
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
        setCoffeeBatchList(coffeeBatchList2.slice());
        confPagination(coffeeBatchList2, isAuth ? 10 : 12);
    };

       const RenderFilters = () => (
<>
<p className="text-lg"> Buscar Lotes </p>

    <div className="flex flex-row mb-1 sm:mb-0 justify-between w-full pb-4">
                    <div>
                        <FormInput
                            label={t("search")}
                            value={searchCriteria}
                            placeholder={t("search")}
                            handleOnChange={handleSearchCriteriaChange}
                            handleOnKeyDown={handleSearchCriteriaKeyDown}
                            errorMsg=""
                            className="search-input block w-full px-4 py-3 rounded-md border border-gray-300 text-gray-600 transition duration-300
        focus:ring-2 focus:ring-sky-300 focus:outline-none
        invalid:ring-2 invalid:ring-red-400"
                        />
                    </div>
        <div>
                        <FormInput
                            label={t("min-height")}
                            value={minHeight}
                            placeholder={t("min-height")}
                            handleOnChange={handleMinHeightChange}
                            errorMsg={minHeightError}
                            className="block w-full px-4 py-3 rounded-md border border-gray-300 text-gray-600 transition duration-300
        focus:ring-2 focus:ring-sky-300 focus:outline-none
        invalid:ring-2 invalid:ring-red-400"
                        />
        </div>
        <div>
                        <FormInput
                            label={t("min-weight")}
                            value={minWeight}
                            placeholder={t("min-weight")}
                            handleOnChange={handleMinWeightChange}
                            errorMsg={minWeightError}
                            className="block w-full px-4 py-3 rounded-md border border-gray-300 text-gray-600 transition duration-300
        focus:ring-2 focus:ring-sky-300 focus:outline-none
        invalid:ring-2 invalid:ring-red-400"
                        />
        </div>
        <div>
                        <FormInput
                            label={t("max-weight")}
                            value={maxWeight}
                            placeholder={t("max-weight")}
                            handleOnChange={handleMaxWeightChange}
                            errorMsg={maxWeightError}
                            className="block w-full px-4 py-3 rounded-md border border-gray-300 text-gray-600 transition duration-300
        focus:ring-2 focus:ring-sky-300 focus:outline-none
        invalid:ring-2 invalid:ring-red-400"
                        />
        </div>
        <div>
                        <FormInput
                            label={t("min-note")}
                            value={minNote}
                            placeholder={t("min-note")}
                            handleOnChange={handleMinNoteChange}
                            errorMsg={minNoteError}
                            className="block w-full px-4 py-3 rounded-md border border-gray-300 text-gray-600 transition duration-300
        focus:ring-2 focus:ring-sky-300 focus:outline-none
        invalid:ring-2 invalid:ring-red-400"
                        />
        </div>
        <div>
                        <FormInput
                            label={t("max-note")}
                            value={maxNote}
                            placeholder={t("max-note")}
                            handleOnChange={handleMaxNoteChange}
                            errorMsg={maxNoteError}
                            className="block w-full px-4 py-3 rounded-md border border-gray-300 text-gray-600 transition duration-300
        focus:ring-2 focus:ring-sky-300 focus:outline-none
        invalid:ring-2 invalid:ring-red-400"
                        />
                    </div>
                    <div className="filters-buttons space-y-4">
                        <button  onClick={() => onSearchClick()} className="btn w-full py-3 px-6 rounded-md bg-amber-200
                                        focus:bg-amber-800 active:bg-amber-800">
                            <>{t("search")}</>
                        </button>
                        <br/>
                        <button  className="btn w-full py-3 px-6 rounded-md bg-amber-200
                                        focus:bg-amber-800 active:bg-amber-800" onClick={() => onClearClick()}>
                            <>{t("clear")}</>
                        </button>
                    </div>
    </div>
    </>
            );

    return (
        <>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
            >
                <button onClick={closeModal}> close</button>
                <br/>
                <div className="flex  justify-center">
                    <div>
                        <QRCode id="current-qr" value={qrCodeUrl} size={500}/>

                        <button  onClick={handleOnDownloadClick}>
                            <>{t("download")}</>
                        </button>
                        <a href={qrCodeUrl}>
                            <button  >
                                <>{t("open-link")}</>
                            </button>
                        </a>
                    </div>
                </div>
            </Modal>

        <div className="py-8">

            <div className="flex flex-row mb-1 sm:mb-0 justify-between w-full">

                <div className="batch-list">
                    {RenderFilters()}
                    <Card className="create-card">
                        <Card.Header>
                            <div>
                                <h2 className="grid grid-cols-1 gap-6 xs:grid-cols-2 lg:grid-cols-3">
                                <>{t("farm-and-batches")}</>
                                </h2>
                            </div>
                            <div>
                                <h3>
                                    <>
                                        {t("total")}: {batchesCount}
                                    </>
                                </h3>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {loading || loadingIpfs ? (
                                <Loading
                                    label={t("loading").concat("...")}
                                    className="loading-wrapper"
                                />
                            ) : (
                                <Table className="coffeebatches">
                                    <thead>
                                    <tr>
                                        <th className="th-2">QR</th>
                                        <th className="th-2">
                                            <>{t("farm")}</>
                                        </th>
                                        <th className="th-2">
                                            <>{t("height")}</>
                                        </th>
                                        <th className="th-2">
                                            <>{t("location")}</>
                                        </th>
                                        <th className="th-3">
                                            <>{t("variety")}</>
                                        </th>
                                        <th className="th-2">
                                            <>{t("process")}</>
                                        </th>
                                        <th className="th-4">
                                            <>{t("drying-code")}</>
                                        </th>
                                        <th className="th-2">
                                            <>{t("drying-type")}</>
                                        </th>
                                        <th className="th-4">
                                            <>{t("exporting-code")}</>
                                        </th>
                                        <th className="th-3">
                                            <>{t("weight")}</>
                                        </th>
                                        <th className="th-3">
                                            <>{t("note")}</>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {coffeeBatchList.map((batch, index) => (
                                        <BatchItem
                                            key={index}
                                            index={index}
                                            coffeeBatch={batch}
                                            pagination={pagination}
                                            showQrModal={showQrModal}
                                        />
                                    ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                        <Card.Footer>
                            <CustomPagination
                                pagination={pagination}
                                onPageSelected={onPageSelected}
                            />
                        </Card.Footer>
                    </Card>
                </div>
            </div>
        </div>
</>
    );
};
