import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Modal from "react-bootstrap/esm/Modal";
import Table from "react-bootstrap/esm/Table";
import { BigNumber, ethers } from "ethers";
import { Provider, Contract, setMulticallAddress } from "ethers-multicall";
import { useQuery, gql } from "@apollo/client";
import { useTranslation } from "react-i18next";
import "../../styles/batchlist.scss";
import "../../styles/modals.scss";
import QRCode from "react-qr-code";
import Loading from "../Loading";
import { useAuthContext } from "../../states/AuthContext";
import { ipfsUrl, SEARCH_DIVIDER } from "../../utils/constants";
import FormInput from "../common/FormInput";
import { CustomPagination } from "../common/Pagination";
import { CoffeeBatchType } from "../common/types";
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
  const { t } = useTranslation();
  const { authState } = useAuthContext();
  const [state] = authState;
  const [currentEthCallProvider, setCurrentEthCallProvider] =
    useState<Provider | null>(null);
  const [cbContract, setCbContract] = useState<Contract>();
  const [coffeeBatchList, setCoffeeBatchList] = useState<
    Array<CoffeeBatchType>
  >([]);
  const [coffeeBatchList2, setCoffeeBatchList2] = useState<
    Array<CoffeeBatchType>
  >([]);
  const [batchesCount, setBatchesCount] = useState(0);
  const [pagination, setPagination] = useState(pagDefault);
  const [loadingIpfs, setLoadingIpfs] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
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

  const { loading, data, refetch, error } = useQuery(batchesQuery, {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setShowModal(true);
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

  const RenderModal = () => (
    <Modal
      show={showModal}
      size="lg"
      className="qr-modal"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={() => setShowModal(false)}
    >
      <Modal.Body className="">
        <QRCode id="current-qr" value={qrCodeUrl} size={600} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleOnDownloadClick}>
          <>{t("download")}</>
        </Button>
        <Button variant="primary" target="_blank" href={qrCodeUrl}>
          <>{t("open-link")}</>
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const RenderFilters = () => (
    <Accordion className="filters" defaultActiveKey="0">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <h4>
            <>{t("search-batches")}</>
          </h4>
        </Accordion.Header>
        <Accordion.Body>
          <div className="filters-inputs">
            <FormInput
              label={t("search")}
              value={searchCriteria}
              placeholder={t("search")}
              handleOnChange={handleSearchCriteriaChange}
              handleOnKeyDown={handleSearchCriteriaKeyDown}
              className="search-input"
              errorMsg=""
            />
            <FormInput
              label={t("min-height")}
              value={minHeight}
              placeholder={t("min-height")}
              handleOnChange={handleMinHeightChange}
              errorMsg={minHeightError}
            />
            <FormInput
              label={t("min-weight")}
              value={minWeight}
              placeholder={t("min-weight")}
              handleOnChange={handleMinWeightChange}
              errorMsg={minWeightError}
            />
            <FormInput
              label={t("max-weight")}
              value={maxWeight}
              placeholder={t("max-weight")}
              handleOnChange={handleMaxWeightChange}
              errorMsg={maxWeightError}
            />
            <FormInput
              label={t("min-note")}
              value={minNote}
              placeholder={t("min-note")}
              handleOnChange={handleMinNoteChange}
              errorMsg={minNoteError}
            />
            <FormInput
              label={t("max-note")}
              value={maxNote}
              placeholder={t("max-note")}
              handleOnChange={handleMaxNoteChange}
              errorMsg={maxNoteError}
            />
          </div>
          <div className="filters-buttons">
            <Button onClick={() => onSearchClick()}>
              <>{t("search")}</>
            </Button>
            <Button variant="secondary" onClick={() => onClearClick()}>
              <>{t("clear")}</>
            </Button>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );

  return (
    <div className="container mx-auto px-4 sm:px-32 sm:mx-4 md:ml-32 md:mr-4   xl:ml-48 xl:mr-6">
      <div className="py-8">
        <div className="flex flex-row mb-1 sm:mb-0 justify-between w-full">

          <div className="batch-list">
            {RenderFilters()}
            <Card className="create-card">
              <Card.Header>
                <div>
                  <h2>
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
            {RenderModal()}
          </div>




        </div>
      </div>
    </div>





  );
};
