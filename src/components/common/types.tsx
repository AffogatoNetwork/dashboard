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
  wetMill: any;
  dryMill: any;
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

export type CompanyType = {
  address: string;
  name: string;
  cellphone: string;
  email: string;
  addressLine: string;
  socialReason: string;
  latitude: string;
  longitude: string;
  review: string;
  avgCupProfile: string;
  website: string;
  socialNetworks: Array<string>;
  productiveAreas: string;
  products: Array<string>;
  managerName: string;
  malePartners: string;
  femalePartners: string;
};

export type FarmType = {
  farmerAddress: string;
  company: string;
  name: string;
  height: number;
  area: number;
  certifications: string;
  latitude: string;
  longitude: string;
  bio: string;
  country: string;
  region: string;
  village: string;
  village2: string;
  location: string;
  varieties: string;
  shadow: string;
  familyMembers: number;
  ethnicGroup: string;
  search: string;
};

export type CoordinatesType = {
  lat: number;
  lng: number;
};
