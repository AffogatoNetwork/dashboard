export const ipfsUrl = "https://affogato.mypinata.cloud/ipfs/";
export const apiUrl = "https://mocha-j6pn.onrender.com/api/v1/";

export const SEARCH_DIVIDER = "##";

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
      "0x7e02efc22e3351a020cd3bfa1fca540afb2c6f8c",
      "0x27825e62c42e23364efc8e967cc6e69ef70a4813",
    ],
  },
  {
    key: "2",
    name: "COPRANIL",
    email: "jdestephen07@gmail.com",
    addresses: [
      "0x6db51e8cc765df7f007956c00b1ac83990149ab6",
      "0x2b97b5692a5c2c9221fdacbba30f7fd4d56b6293",
      "0xba2ae96649d04bff55be93bb2b0b8993f81f4cc2",
      "0xccdf342558d6d41a0e282b586da463443e61ee4f",
    ],
  },
  {
    key: "3",
    name: "COMSA",
    email: "robert@affogato.co",
    addresses: [
      "0xcefe349b2c94910ca16be79598bc15eaee7c5e81",
      "0xadc801905c98e4ef00a9392edae72cbbeef402f4",
      "0x902f6e040d3018c53953f4bea4146fba72b0faa1",
    ],
  },
  {
    key: "4",
    name: "PROEXO",
    email: "cristian@affogato.co",
    addresses: [
      "0xd109a56c1c3fa6a31e3cb2e09188ec2401e2e405",
      "0x370c3da4428c0e366098e8fe8068c3d480d880ae",
      "0x0a97bf177b0ad4067d51540456631ecbbd881f4e",
      "0xfa474d1e6d83c6ba0591117981d56dbf08c774af",
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

export const GenderFilterList = [
  { key: "all", name: "Todos" },
  { key: "female", name: "Femenino" },
  { key: "male", name: "Masculino" },
];

export const FarmList = [
  {
    key: "0",
    id:" Coperativa/Empresa",
    nombre: "Placeholder de Coperativa/Empresa",
    Msocios: 20,
    Fsocios: 20,
    email:  "contacto@montanaverdehn.com",
    telefono: "(+504) 9952-3415",
    direccion: "Aldea San Luis, Planes, Sta. Bárbara",
    lat: "14.9752",
    long: "-88.12331",
    perfiltaza: "Nmb%",
    bio: "Incrementar los ingresos familiares de las familias productoras de café ubicadas en el sector de San Luís Planes, Santa Bárbara en la zona de amortiguamiento del parque nacional Santa Bárbara, mediante la organización comunitaria.",
    area: "Nmb hectáreas",
    productos: ["- Beneficio Húmedo "," ", " - Beneficio Seco" ," ", " - Laboratorio de Catación"],
    gerente: "Milton Rivera",
    website: "Milton Rivera",
    social: "https://www.facebook.com/www.commovel.org",
    certificados: ["Orgánico Nmb% ", " ", " Comercio Justo Nmb%" ],
    imagen1: "https://firebasestorage.googleapis.com/v0/b/yeoudev.appspot.com/o/signal-2022-10-26-071821_002.jpeg?alt=media&token=35922570-39a6-41a3-8cf6-48317458b2e1",
    imagen2: "https://firebasestorage.googleapis.com/v0/b/yeoudev.appspot.com/o/signal-2022-10-26-071821_003.jpeg?alt=media&token=81ad26d9-6e23-424f-b79d-f0df9bf05a0f",
    imagen3: "https://firebasestorage.googleapis.com/v0/b/yeoudev.appspot.com/o/signal-2022-10-26-071821_004.jpeg?alt=media&token=d30a999c-e58c-460d-9479-ca8bf59c32c0",
    imagen4: "https://firebasestorage.googleapis.com/v0/b/yeoudev.appspot.com/o/signal-2022-10-26-071821_005.jpeg?alt=media&token=5c271053-c167-473d-a8cc-b7afd98f93bb",
},
  {
    key: "1",
    id:" COMMOVEL",
    nombre: "Cooperativa Mixta Montaña Verde Limitada",
    Msocios: 142,
    Fsocios: 21,
    email:  "contacto@montanaverdehn.com",
    telefono: "(+504) 9952-3415",
    direccion: "Aldea San Luis, Planes, Sta. Bárbara",
    lat: "14.9752",
    long: "-88.12331",
    perfiltaza: "83%",
    bio: "Incrementar los ingresos familiares de las familias productoras de café ubicadas en el sector de San Luís Planes, Santa Bárbara en la zona de amortiguamiento del parque nacional Santa Bárbara, mediante la organización comunitaria.",
    area: "940 hectáreas",
    productos: ["- Beneficio Húmedo "," ", " - Beneficio Seco" ," ", " - Laboratorio de Catación"],
    gerente: "Milton Rivera",
    website: "Milton Rivera",
    social: "https://www.facebook.com/www.commovel.org",
    certificados: ["Orgánico 100% ", " ", " Comercio Justo 70%" ],
    imagen1: "https://firebasestorage.googleapis.com/v0/b/yeoudev.appspot.com/o/signal-2022-10-26-071821_002.jpeg?alt=media&token=35922570-39a6-41a3-8cf6-48317458b2e1",
    imagen2: "https://firebasestorage.googleapis.com/v0/b/yeoudev.appspot.com/o/signal-2022-10-26-071821_003.jpeg?alt=media&token=81ad26d9-6e23-424f-b79d-f0df9bf05a0f",
    imagen3: "https://firebasestorage.googleapis.com/v0/b/yeoudev.appspot.com/o/signal-2022-10-26-071821_004.jpeg?alt=media&token=d30a999c-e58c-460d-9479-ca8bf59c32c0",
    imagen4: "https://firebasestorage.googleapis.com/v0/b/yeoudev.appspot.com/o/signal-2022-10-26-071821_005.jpeg?alt=media&token=5c271053-c167-473d-a8cc-b7afd98f93bb",
  },
  {
    key: "2",
    id:" COPRANIL",
    nombre: "Cooperativas Nuevas Ideas Limitada",
    Msocios: 94,
    Fsocios: 39,
    email:  "info@copranil.hn",
    telefono: "(+504)  9481-6674",
    direccion: "H4QM+522, carretera RN, Corquín",
    lat: "14.58837",
    long: "-88.86758",
    perfiltaza: "82-83%",
    bio: "Somos una Cooperativa de pequeños productores/as de café certificado de alta calidad, con principios y valores, que ofrece servicios de comercialización, financiamiento y asistencia técnica a sus afiliados/as; con enfoque de equidad de género y amigable con el medio ambiente, para mejorar la calidad de vida de sus familias.",
    area: "",
    productos: ["- Comercialización y exportación de café"," ","- Beneficio Húmedo "," ", " - Secado de café" ," ", " - Elaboración de fertilizantes y foliares orgánicos a socios certificados"," ", "- Asistencia técnica a asociados"," ", "- Servicio de tostado molido de café"," ", "- Venta de café molido"," ", "- Elaboración de viveros maderables"],
    gerente: "Ezperanza",
    website: "https://www.copranil.hn",
    social: "https://www.facebook.com/Copranil-153316678376593",
    certificados: ["Orgánico", " ", " Comercio Justo" ],
  },
  {
    key: "3",
    id:" COMSA",
    nombre: "Café Orgánico Marcala S.A",
    Msocios: 229,
    Fsocios: 171,
    email:  "info@comsa.hn",
    telefono: "(+504) 2764-4736",
    direccion: "Barrio La Victoria, Marcala, La Paz",
    lat: "",
    long: "",
    perfiltaza: "84%",
    bio: "Somos una empresa que a la vez que comercializa café orgánico y convencional de calidad, con precios competitivos, promueve, partiendo de la implementación de una educación innovadora, reflexiva y analítica, la transformación plena del ser humano, para cambiar su manera de vivir.",
    area: "",
    productos: [
        "- Beneficio Húmedo "," ",
        "- Beneficio Seco" ," ",
        "- Laboratorio de Catación", " ",
        "- Escuela CIS " , " ",
        "- Finca Biodinámica " , " ",
        "- Hotel La Fortaleza " ," ",
    ],
    gerente: "Rodolfo Peñalba",
    website: "https://www.comsa.hn",
    social: "https://www.facebook.com/comsamarcala",
    certificados: [
        "Orgánico", " ",
        "Comercio Justo", " ",
        "Rainforest Alliance" , " ",],
  },
  {
    key: "4",
    id:" PROEXO",
    nombre: "Empresa de Servicios Múltiples PROEXO Limitada",
    Msocios: 202,
    Fsocios: 44,
    email:  "gerencia@proexo.org",
    telefono: "(+504)  9888-4100",
    direccion: "Corquín, Copán 41051, Honduras, CA",
    lat: "14.59144",
    long: "-88.86457",
    perfiltaza: "83%",
    bio: "PROEXO es una empresa de economía social que busca y sostiene la primacía del trabajo, opta por la propiedad social de los medios de producción y busca establecer que el excedente generado sea un medio para elevar el nivel de vida de sus miembros.",
    area: "2,245 manzanas",
    productos: ["-Comercialización  "," ",
                "-Transporte" ," ",
                "-Secado  "," ",
                "-Capitalización" ," ",
                "-Financiamiento Pre y Post Cosecha "," ",
                "-Asistencia Tecnica" ," ",
                "-Beneficio Humedo  "," ",
                "-Laboratorio de Catación " ," ",
                ],
    gerente: "Rene Madrid",
    website: "https://www.proexo.org",
    social: "https://www.facebook.com/ProexoHonduras",
    certificados: ["Orgánico", " ",
                   "Comercio Justo", " ",
                   "Rainforest Alliance" , " ",],
  },

];

