export const ipfsUrl = "https://gateway.pinata.cloud/ipfs/";
export const apiUrl = "https://mocha-j6pn.onrender.com/api/v1/";

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

export const CooperativeList = [
  { key: "0", name: "Elija la cooperativa", email: "", addresses: [] },
  {
    key: "1",
    name: "COMMOVEL",
    email: "robert@affogato.co",
    addresses: [
      "0x7e02EFc22e3351A020cD3bfA1FCA540afb2C6F8c",
      "0x27825E62C42E23364efC8e967cC6E69ef70A4813",
    ],
  },
  {
    key: "2",
    name: "COPRANIL",
    email: "jdestephen07@gmail.com",
    addresses: [
      "0x6Db51e8Cc765Df7f007956C00B1AC83990149Ab6",
      "0x2b97B5692A5C2C9221fDacBbA30f7fD4d56B6293",
      "0xbA2Ae96649d04BFF55bE93bb2b0B8993F81F4cc2",
      "0xccdF342558d6D41a0e282B586dA463443E61eE4f",
    ],
  },
  {
    key: "3",
    name: "COMSA",
    email: "robert@affogato.co",
    addresses: [
      "0xceFe349B2c94910CA16be79598BC15eAEE7c5E81",
      "0xADC801905c98e4EF00a9392eDAe72CBbEEF402F4",
      "0x902f6E040D3018C53953F4BEa4146Fba72b0fAA1",
    ],
  },
  {
    key: "4",
    name: "PROEXO",
    email: "cristian@affogato.co",
    addresses: [
      "0xD109a56c1C3Fa6A31E3CB2E09188EC2401e2E405",
      "0x370c3Da4428C0E366098e8Fe8068C3D480d880Ae",
      "0x0a97BF177b0Ad4067D51540456631eCbbD881f4e",
      "0xfa474D1E6d83C6bA0591117981D56dbF08C774AF",
    ],
  },
];

export const RegionList = [
  { key: "0", name: "Ninguno" },
  { key: "Atlántida", name: "Atlántida" },
  { key: "Colón", name: "Colón" },
  { key: "Comayagua", name: "Comayagua" },
  { key: "Copán", name: "Copán" },
  { key: "Cortés", name: "Cortés" },
  { key: "Choluteca", name: "Choluteca" },
  { key: "El Paraíso", name: "El Paraíso" },
  { key: "Francisco Morazán", name: "Francisco Morazán" },
  { key: "Gracias a Dios", name: "Gracias a Dios" },
  { key: "Intibucá", name: "Intibucá" },
  { key: "Islas de la Bahía", name: "Islas de la Bahía" },
  { key: "La Paz", name: "La Paz" },
  { key: "Lempira", name: "Lempira" },
  { key: "Ocotepeque", name: "Ocotepeque" },
  { key: "Olancho", name: "Olancho" },
  { key: "Santa Bárbara", name: "Santa Bárbara" },
  { key: "Valle", name: "Valle" },
  { key: "Yoro", name: "Yoro" },
];

export const GenderList = [
  { key: "female", name: "Femenino" },
  { key: "male", name: "Masculino" },
];
