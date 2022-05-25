import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/esm/Card";
import Table from "react-bootstrap/esm/Table";
import { BigNumber, ethers } from "ethers";
import { useQuery, gql } from "@apollo/client";
import "../../styles/batchlist.scss";
import Loading from "../Loading";
import { useAuthContext } from "../../states/AuthContext";
import { ipfsUrl } from "../../utils/constants";
import { CustomPagination } from "../common/Pagination";
import { AttributesType, CoffeeBatchType } from "../common/types";
import CoffeeBatch from "../../contracts/CoffeBatch.json";
import BatchItem from "./BatchItem";

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
  const [cbContract, setCbContract] = useState<ethers.Contract>();
  const [coffeeBatchList, setCoffeeBatchList] = useState<
    Array<CoffeeBatchType>
  >([]);
  const [pagination, setPagination] = useState(pagDefault);

  useEffect(() => {
    const loadProvider = async () => {
      if (state.provider !== null) {
        const signer = state.provider.getSigner();
        // Set CoffeBatch contracts
        const currentCoffeeBatch = new ethers.Contract(
          CoffeeBatch.address,
          CoffeeBatch.abi,
          signer
        );
        setCbContract(currentCoffeeBatch);
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
          id_not_in: ["3", "4", "5", "6", "7", "8", "10", "11"]
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

  const loadBatch = async (batchId: number) => {
    const batchList = coffeeBatchList;
    // @ts-ignore
    const ipfsHash = await cbContract.tokenURI(BigNumber.from(batchId));
    const url = ipfsUrl.concat(ipfsHash);

    fetch(url)
      .then((response) => response.json())
      .then((jsonData) => {
        const attrs = new Array<AttributesType>();
        const cupProfile = {
          aroma: "-",
          notes: "-",
          body: "-",
          acidity: "-",
        };
        for (let i = 0; i < jsonData.attributes.length; i += 1) {
          if (jsonData.attributes[i].trait_type.toLowerCase() !== "profile") {
            attrs.push({
              title: jsonData.attributes[i].trait_type,
              value: jsonData.attributes[i].value,
            });
          } else {
            const cupp = jsonData.attributes[i].value;
            for (let j = 0; j < cupp.length; j += 1) {
              const { key, val } = cupp[j];
              if (key === "aroma") {
                cupProfile.aroma = val;
              } else if (key === "body") {
                cupProfile.body = val;
              } else if (key === "notes") {
                cupProfile.notes = val;
              } else if (key === "acidity") {
                cupProfile.acidity = val;
              }
            }
          }
        }
        const cooffeeB = {
          id: batchId,
          name: jsonData.name,
          description: jsonData.description,
          image: jsonData.image,
          ipfsHash,
          attributes: attrs,
          cupProfile,
        };
        batchList.push(cooffeeB);
        setCoffeeBatchList(batchList);
      });
  };

  const loadBatchesData = async (cbData: any) => {
    if (cbContract) {
      setCoffeeBatchList([]);
      for (let i = 0; i < cbData.length; i += 1) {
        await loadBatch(cbData[i].id);
      }
      confPagination(cbData, 5);
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
      loadBatchesData(data.coffeeBatches);
    },
  });

  return (
    <div className="batch-list">
      <Card className="create-card">
        <Card.Header>
          <h2>Lotes de café</h2>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <Loading label="Cargando..." />
          ) : (
            <Table className="coffeebatches">
              <thead>
                <th className="th-1" />
                <th className="th-2">Ubicación</th>
                <th className="th-3">Altitud</th>
                <th className="th-3">Variedad</th>
                <th className="th-3">Proceso</th>
                <th className="th-4">Tamaño</th>
                <th className="th-3">Aroma</th>
                <th className="th-3">Acidez</th>
                <th className="th-3">Cuerpo</th>
                <th className="th-4">Nota</th>
              </thead>
              <tbody>
                {coffeeBatchList.map((batch, index) => (
                  <BatchItem
                    key={index}
                    index={index}
                    coffeeBatch={batch}
                    pagination={pagination}
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
  );
};
