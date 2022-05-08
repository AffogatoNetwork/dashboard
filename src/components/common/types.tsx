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
}

export type CupProfileType = {
  aroma: number;
  notes: number;
  body: number;
  acidity: number;
};

export type CoffeeBatchType = {
  id: number;
  name: string;
  description: string;
  image: string;
  ipfsHash: string;
  attributes: Array<AttributesType>;
  cupProfile: CupProfileType;
};
