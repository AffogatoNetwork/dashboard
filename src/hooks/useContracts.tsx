import React, { useState } from "react";
import { ethers } from "ethers";
import { ContractsContext } from "../states/ContractsContext";

export const useContracts = (): ContractsContext => {
  const [coffeeBatch, setCoffeeBatch] = useState<ethers.Contract>();
  const setCurrentCoffeeBatch = React.useCallback(
    (currentCoffeeBatch: ethers.Contract): void => {
      setCoffeeBatch(currentCoffeeBatch);
    },
    []
  );

  return {
    coffeeBatch,
    setCurrentCoffeeBatch,
  };
};
