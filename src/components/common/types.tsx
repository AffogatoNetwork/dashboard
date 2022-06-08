export type PaginationType = {
  previous: number;
  current: number;
  next: number;
  pages: number;
  itemsPerPage: number;
  itemsCount: number;
  lastId: string;
};

export type AttributesType = {
  title: string;
  value: any;
};

export type CupProfileType = {
  aroma: string;
  notes: string;
  body: string;
  acidity: string;
};

export type CoffeeBatchType = {
  id: number;
  name: string;
  description: string;
  image: string;
  ipfsHash: string;
  farmer: any;
  farm: any;
  wetMill:any;
  dryMill:any;
  certification:any;
  batch: any;
  exportBatch: any;
  cupProfile: any;
};

export type FarmerType = {
  address: string;
  farmerId: string;
  fullname: string;
  bio: string;
  gender: string;
  country: string;
  region: string;
  village: string;
  village2: string;
};
