import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Modal from "react-bootstrap/esm/Modal";
import Table from "react-bootstrap/esm/Table";
import { BigNumber, ethers } from "ethers";
import { Provider, Contract, setMulticallAddress } from "ethers-multicall";
import { useQuery, gql } from "@apollo/client";
import "../../styles/batchlist.scss";
import "../../styles/modals.scss";
import QRCode from "react-qr-code";
import Loading from "../Loading";
import { useAuthContext } from "../../states/AuthContext";
import { ipfsUrl } from "../../utils/constants";
import FormInput from "../common/FormInput";
import { CustomPagination } from "../common/Pagination";
import { CoffeeBatchType } from "../common/types";
import CoffeeBatch from "../../contracts/CoffeBatch.json";
import BatchItem from "./BatchItem";
import {
  getCompanyAddresses,
  getCompanyAddressesByHost,
  getDefaultProvider,
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
  const [farmName, setFarmName] = useState("");
  const [height, setHeight] = useState("");
  const [location, setLocation] = useState("");
  const [variety, setVariety] = useState("");
  const [process, setProcess] = useState("");
  const [dryingType, setDryingType] = useState("");
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");

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

  const filterByFarm = (c: CoffeeBatchType) => {
    const n = c.farm.name.toLowerCase();
    return n.includes(farmName.toLowerCase());
  };

  const filterByHeight = (c: CoffeeBatchType) => {
    const n = c.farm.altitude ? c.farm.altitude : "";
    return height.includes(n);
  };

  const filterByLocation = (c: CoffeeBatchType) => {
    const n = c.farm.altitude.toLowerCase();
    return n.includes(location.toLowerCase());
  };

  const filterByVariety = (c: CoffeeBatchType) => {
    const n = c.wetMill.variety.toLowerCase();
    return n.includes(variety.toLowerCase());
  };

  const filterByProcess = (c: CoffeeBatchType) => {
    const n = c.wetMill.process.toLowerCase();
    return n.includes(process.toLowerCase());
  };

  const filterByDryingType = (c: CoffeeBatchType) => {
    const n = c.wetMill.drying_type.toLowerCase();
    return n.includes(dryingType.toLowerCase());
  };

  const filterByWeight = (c: CoffeeBatchType) => {
    const n = c.dryMill.weight;
    return n.includes(weight.toLowerCase());
  };

  const filterByNote = (c: CoffeeBatchType) => {
    const n = c.dryMill.note;
    return n.includes(note.toLowerCase());
  };

  const filterBatches = () => {
    let cbList = coffeeBatchList2.slice();
    if (farmName.length > 0) {
      cbList = cbList.filter(filterByFarm);
    }
    if (height.length > 0) {
      cbList = cbList.filter(filterByHeight);
    }
    if (location.length > 0) {
      cbList = cbList.filter(filterByLocation);
    }
    if (variety.length > 0) {
      cbList = cbList.filter(filterByVariety);
    }
    if (process.length > 0) {
      cbList = cbList.filter(filterByProcess);
    }
    if (process.length > 0) {
      cbList = cbList.filter(filterByProcess);
    }
    if (dryingType.length > 0) {
      cbList = cbList.filter(filterByDryingType);
    }
    if (weight.length > 0) {
      cbList = cbList.filter(filterByWeight);
    }
    if (note.length > 0) {
      cbList = cbList.filter(filterByNote);
    }

    setCoffeeBatchList(cbList);
    confPagination(cbList, isAuth ? 10 : 12);
  };

  const handleFarmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.trim();
    setFarmName(input);
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.trim();
    setHeight(input);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.trim();
    setLocation(input);
  };

  const handleVarietyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.trim();
    setVariety(input);
  };

  const handleProcessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.trim();
    setProcess(input);
  };

  const handleDryingTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value.trim();
    setDryingType(input);
  };

  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.trim();
    setWeight(input);
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value.trim();
    setNote(input);
  };

  const onSearchClick = () => {
    filterBatches();
  };

  const onClearClick = () => {
    setFarmName("");
    setHeight("");
    setLocation("");
    setVariety("");
    setProcess("");
    setDryingType("");
    setWeight("");
    setNote("");
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
          Descargar
        </Button>
        <Button variant="primary" target="_blank" href={qrCodeUrl}>
          Abrir Enlace
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const RenderFilters = () => (
    <Card className="filters">
      <Card.Body>
        <FormInput
          label=""
          value={farmName}
          placeholder="Finca"
          handleOnChange={handleFarmChange}
          errorMsg=""
        />
        <FormInput
          label=""
          value={height}
          placeholder="Altura"
          handleOnChange={handleHeightChange}
          errorMsg=""
        />
        <FormInput
          label=""
          value={location}
          placeholder="Ubicación"
          handleOnChange={handleLocationChange}
          errorMsg=""
        />
        <FormInput
          label=""
          value={variety}
          placeholder="Variedad"
          handleOnChange={handleVarietyChange}
          errorMsg=""
        />
        <FormInput
          label=""
          value={process}
          placeholder="Proceso"
          handleOnChange={handleProcessChange}
          errorMsg=""
        />
        <FormInput
          label=""
          value={dryingType}
          placeholder="Tipo de Secado"
          handleOnChange={handleDryingTypeChange}
          errorMsg=""
        />
        <FormInput
          label=""
          value={weight}
          placeholder="Peso"
          handleOnChange={handleWeightChange}
          errorMsg=""
        />
        <FormInput
          label=""
          value={note}
          placeholder="Nota"
          handleOnChange={handleNoteChange}
          errorMsg=""
        />
      </Card.Body>
      <Card.Footer>
        <Button onClick={() => onSearchClick()}>Buscar</Button>
        <Button variant="secondary" onClick={() => onClearClick()}>
          Limpiar
        </Button>
      </Card.Footer>
    </Card>
  );

  return (
    <div className="batch-list">
      {RenderFilters()}
      <Card className="create-card">
        <Card.Header>
          <div>
            <h2>Fincas y Lotes de café</h2>
          </div>
          <div>
            <h3>Total: {batchesCount}</h3>
          </div>
        </Card.Header>
        <Card.Body>
          {loading || loadingIpfs ? (
            <Loading label="Cargando..." className="loading-wrapper" />
          ) : (
            <Table className="coffeebatches">
              <thead>
                <tr>
                  <th className="th-2">QR</th>
                  <th className="th-2">Finca</th>
                  <th className="th-2">Altura</th>
                  <th className="th-2">Ubicación</th>
                  <th className="th-3">Variedad</th>
                  <th className="th-2">Proceso</th>
                  <th className="th-4">Id de Secado</th>
                  <th className="th-2">Tipo de Secado</th>
                  <th className="th-4">Id de Exportación</th>
                  <th className="th-3">Peso</th>
                  <th className="th-3">Nota</th>
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
  );
};
