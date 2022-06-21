export const ipfsUrl = "https://gateway.pinata.cloud/ipfs/";
export const apiUrl = "https://mocha-j6pn.onrender.com/api/v1/";

export type CooperativeType = {
  key: string;
  name: string;
  email: string;
};

export type RegionType = {
  key: string;
  name: string;
};

export const CooperativeList = [
  { key: "0", name: "Elija la cooperativa", email: "" },
  { key: "1", name: "COMMOVEL", email: "robert@affogato.co" },
  { key: "2", name: "COPRANIL", email: "jdestephen07@gmail.com" },
  { key: "3", name: "COMSA", email: "robert@affogato.co" },
  { key: "4", name: "PROEXO", email: "cristian@affogato.co" },
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
