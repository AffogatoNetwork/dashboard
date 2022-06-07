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
import { CustomPagination } from "../common/Pagination";
import { CoffeeBatchType } from "../common/types";
import CoffeeBatch from "../../contracts/CoffeBatch.json";
import BatchItem from "./BatchItem";
import { getDefaultProvider } from "../../utils/utils";

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
  const [pagination, setPagination] = useState(pagDefault);
  const [loadingIpfs, setLoadingIpfs] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  setMulticallAddress(10, "0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a");

  useEffect(() => {
    const loadProvider = async () => {
      let ethcallProvider = null;

      if (state.provider !== null) {
        ethcallProvider = new Provider(state.provider);
      } else {
        const provider = getDefaultProvider();
        const randomSigner = ethers.Wallet.createRandom().connect(provider);
        ethcallProvider = new Provider(randomSigner.provider);
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
      }
    };
    loadProvider();
  }, [state.provider]);

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

  const batchesQuery = gql`
    query getCoffeeBatches($owner: String!) {
      coffeeBatches(
        where: {
          owner: $owner
          id_not_in: ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
          id_gte: "75"
        }
      ) {
        id
      }
      ownerBalance(id: $owner) {
        balance
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
        let batch = {};
        let exportBatch = {};
        let cupProfile = {};
        for (let i = 0; i < jsonData.attributes.length; i += 1) {
          const traitType = jsonData.attributes[i].trait_type.toLowerCase();
          if (traitType === "farmer") {
            [farmer] = jsonData.attributes[i].value;
          }
          if (traitType === "farm") {
            [farm] = jsonData.attributes[i].value;
          }
          if (traitType === "batch") {
            [batch] = jsonData.attributes[i].value;
          }
          if (traitType === "export") {
            [exportBatch] = jsonData.attributes[i].value;
          }
          if (traitType === "profile") {
            [cupProfile] = jsonData.attributes[i].value;
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
          batch,
          exportBatch,
          cupProfile,
        };
        batchList.push(cooffeeB);
        setCoffeeBatchList(batchList);
      });
  };

  const loadBatchesData = async (cbData: any) => {
    if (cbContract) {
      setCoffeeBatchList([]);
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
      confPagination(cbData, 5);
      setLoadingIpfs(false);
    }
  };

  const { loading, data, error } = useQuery(batchesQuery, {
    variables: { owner: "0x13248b47b0ff1c04d2a054b662c850dc05d47b4d" },
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    onError: () => {
      console.log(error);
    },
    onCompleted: () => {
      setLoadingIpfs(true);
      loadBatchesData(data.coffeeBatches);
    },
  });

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
      </Modal.Footer>
    </Modal>
  );

  return (
    <div className="batch-list">
      <Card className="create-card">
        <Card.Header>
          <h2>Lotes de café</h2>
        </Card.Header>
        <Card.Body>
          {loading || loadingIpfs ? (
            <Loading label="Cargando..." />
          ) : (
            <Table className="coffeebatches">
              <thead>
                <th className="th-1" />
                <th className="th-2">Ubicación</th>
                <th className="th-2">Finca</th>
                <th className="th-2">Certificados</th>
                <th className="th-3">Altitud</th>
                <th className="th-3">Variedad</th>
                <th className="th-3">Proceso</th>
                <th className="th-4">Tamaño</th>
                <th className="th-3">Aroma</th>
                <th className="th-3">Acidez</th>
                <th className="th-3">Post Gusto</th>
                <th className="th-3">Cuerpo</th>
                <th className="th-3">Sabor</th>
                <th className="th-3">Dulzura</th>
                <th className="th-4">Nota</th>
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
