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

export const isNumber = (value: string) => {
  const v = parseFloat(value);
  return !Number.isNaN(v);
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
  let name = "PROEXO";
  for (let i = 0; i < CooperativeList.length; i += 1) {
    if (CooperativeList[i].addresses?.includes(address.toLowerCase())) {
      name = CooperativeList[i].name;
    }
  }
  return name;
};

export const getCompanyAddresses = (address: string): Array<string> => {
  let addresses = new Array<string>();
  for (let i = 0; i < CooperativeList.length; i += 1) {
    if (CooperativeList[i].addresses?.includes(address.toLowerCase())) {
      addresses = CooperativeList[i].addresses;
    }
  }
  if (addresses.length === 0) {
    addresses = CooperativeList[4].addresses;
  }
  return addresses;
};

export const getCompanyAddressesByHost = (location: string) => {
  let { addresses } = CooperativeList[4];
  for (let i = 0; i < CooperativeList.length; i += 1) {
    const name = CooperativeList[i].name.toLowerCase();
    if (location.toLowerCase().match(name) !== null) {
      addresses = CooperativeList[i].addresses;
    }
  }
  return addresses;
};
