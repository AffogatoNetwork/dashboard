import { toast } from "react-toastify";
import { ethers } from "ethers";
import { CooperativeList } from "./constants";

export const getDefaultProvider = () => {
  const url = "https://rpc.ankr.com/gnosis";
  const customHttpProvider = new ethers.providers.JsonRpcProvider(url);
  return customHttpProvider;
};

export const errorNotification = async (body: string) => {
  toast.error(body, {
    // @ts-ignore
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 15000,
    hideProgressBar: true,
    delay: 500,
    pauseOnFocusLoss: false,
  });
};

export const notifyUser = async (body: string) => {
  toast.success(body, {
    // @ts-ignore
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 4000,
    hideProgressBar: true,
    delay: 500,
    pauseOnFocusLoss: false,
  });
};

export const makeShortAddress = (address: string) => {
  const shortAddress = `${address.substr(0, 6).toString()}...${address
    .substr(address.length - 4, address.length)
    .toString()}`;
  return shortAddress;
};

export const isValidCellphone = (cellphone: string) => {
  const pattern = /^[0-9]{8}$/;

  return pattern.test(cellphone);
};

export const isValidEmail = (email: string) => {
  // eslint-disable-next-line
  const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return pattern.test(email);
};

export const getCompanyName = (address: string): string => {
  let name = "";
  for (let i = 0; i < CooperativeList.length; i += 1) {
    if (CooperativeList[i].addresses?.includes(address)) {
      name = CooperativeList[i].name;
    }
  }
  return name;
};
