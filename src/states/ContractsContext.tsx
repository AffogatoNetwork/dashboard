import React from "react";
import { ethers } from "ethers";

export interface ContractsContext {
  coffeeBatch?: ethers.Contract;
  setCurrentCoffeeBatch: (currentCoffeeBatch: ethers.Contract) => void;
}

export const CONTRACTS_DEFAULT_VALUE = {
  setCurrentCoffeeBatch: () => {},
};

const contractsContext = React.createContext<ContractsContext>(CONTRACTS_DEFAULT_VALUE);

export default contractsContext;
