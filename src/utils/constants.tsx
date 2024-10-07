export const ipfsUrl = 'https://affogato.mypinata.cloud/ipfs/';
export const apiUrl = 'https://mocha-j6pn.onrender.com/api/v1/';

export const SEARCH_DIVIDER = '##';

export type CooperativeType = {
  key: string;
  name: string;
  email: string;
  addresses: Array<string>;
};

export type RegionType = {
  key: string;
  name: string;
};

export const CooperativeImage = [
  {
    key: '0',
    name: 'COMSA',
    image:
      'https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/assets%2FNFT%2Fcomsa.gif?alt=media&token=bba1fd79-c5de-493f-b0ef-b62f9ed2cd4a',
  },
  {
    key: '1',
    name: 'COMMOVEL',
    image:
      'https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/assets%2FNFT%2Fcommovel.gif?alt=media&token=3b3b3b3b-1b3b-4b3b-8b3b-2b3b3b3b3b3b',
  },
  {
    key: '2',
    name: 'COPRACNIL',
    image:
      'https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/assets%2FNFT%2Fcopranil.gif?alt=media&token=c56a98a4-0b30-4861-aca6-cca2f0130b33',
  },
  {
    key: '3',
    name: 'PROEXO',
    image:
      'https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/assets%2FNFT%2Fproexo.gif?alt=media&token=3b3b3b3b-1b3b-4b3b-8b3b-2b3b3b3b3b3b',
  },
  {
    key: '4',
    name: 'CAFEPSA',
    image:
      'https://firebasestorage.googleapis.com/v0/b/affogato-fde9c.appspot.com/o/assets%2FNFT%2Fcomsa.gif?alt=media&token=bba1fd79-c5de-493f-b0ef-b62f9ed2cd4a',
  },
];

export const CooperativeList = [
  { key: '0', name: 'Elija la cooperativa', email: '', addresses: [] },
  {
    key: '1',
    name: 'COMMOVEL',
    email: 'commovel.coffeechain@gmail.com',
    addresses: [
      '0x7e02efc22e3351a020cd3bfa1fca540afb2c6f8c',
      '0x27825e62c42e23364efc8e967cc6e69ef70a4813',
    ],
  },
  {
    key: '2',
    name: 'COPRACNIL',
    email: 'proexo.coffeechain@gmail.com',
    addresses: [
      '0x6db51e8cc765df7f007956c00b1ac83990149ab6',
      '0x2b97b5692a5c2c9221fdacbba30f7fd4d56b6293',
      '0xba2ae96649d04bff55be93bb2b0b8993f81f4cc2',
      '0xccdf342558d6d41a0e282b586da463443e61ee4f',
    ],
  },
  {
    key: '3',
    name: 'COMSA',
    email: 'comsa.coffeechain@gmail.com',
    addresses: [
      '0xcefe349b2c94910ca16be79598bc15eaee7c5e81',
      '0xadc801905c98e4ef00a9392edae72cbbeef402f4',
      '0x902f6e040d3018c53953f4bea4146fba72b0faa1',
    ],
  },
  {
    key: '4',
    name: 'PROEXO',
    email: 'proexo.coffeechain@gmail.com',
    addresses: [
      '0xd109a56c1c3fa6a31e3cb2e09188ec2401e2e405',
      '0x370c3da4428c0e366098e8fe8068c3d480d880ae',
      '0x0a97bf177b0ad4067d51540456631ecbbd881f4e',
      '0xfa474d1e6d83c6ba0591117981d56dbf08c774af',
    ],
  },
  {
    key: '5',
    name: 'CAFEPSA',
    email: 'comsa.coffeechain@gmail.com',
    addresses: ['0x0ef705a35701F6e7ddAcd596546D46740CEA122A'],
  },
];

export const RegionList = [
  { key: '0', name: 'Ninguno' },
  { key: 'Atlántida', name: 'Atlántida' },
  { key: 'Colón', name: 'Colón' },
  { key: 'Comayagua', name: 'Comayagua' },
  { key: 'Copán', name: 'Copán' },
  { key: 'Cortés', name: 'Cortés' },
  { key: 'Choluteca', name: 'Choluteca' },
  { key: 'El Paraíso', name: 'El Paraíso' },
  { key: 'Francisco Morazán', name: 'Francisco Morazán' },
  { key: 'Gracias a Dios', name: 'Gracias a Dios' },
  { key: 'Intibucá', name: 'Intibucá' },
  { key: 'Islas de la Bahía', name: 'Islas de la Bahía' },
  { key: 'La Paz', name: 'La Paz' },
  { key: 'Lempira', name: 'Lempira' },
  { key: 'Ocotepeque', name: 'Ocotepeque' },
  { key: 'Olancho', name: 'Olancho' },
  { key: 'Santa Bárbara', name: 'Santa Bárbara' },
  { key: 'Valle', name: 'Valle' },
  { key: 'Yoro', name: 'Yoro' },
];

export const GenderList = [
  { key: 'female', name: 'Femenino' },
  { key: 'male', name: 'Masculino' },
];

export const GenderFilterList = [
  { key: 'all', name: 'Todos' },
  { key: 'female', name: 'Femenino' },
  { key: 'male', name: 'Masculino' },
];
