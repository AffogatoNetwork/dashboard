import {initializeApp} from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import {CompanyType, FarmerType, FarmType} from "../components/common/types";
import {getAuth} from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FB_DATABASE_URL,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MSG_SENDER_ID,
  appId: process.env.REACT_APP_FB_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();

export const saveFarmer = async (farmer: FarmerType, image: any) => {
  try {
    if (image !== null) {
      const storageRef = ref(storage, farmer.address);
      uploadBytes(storageRef, image).then((snapshot) => {
      });
    }
    const farmerDoc = doc(db, "farmers", farmer.address);
    await setDoc(farmerDoc, farmer);
  } catch (error) {
  }
};

export const getFarmer = async (address: string) => {
  const docRef = doc(db, "farmers", address);
  const docData = await getDoc(docRef);
  if (docData.exists()) {
    return docData.data();
  }
  return null;
};

export const getFarmerByBatche = async (result: any) => {
  let farmerDetails: any[] = []
  if (result?.Farmer.address !== undefined) {
    getFarmer(result?.Farmer.address).then((result) => {
      farmerDetails.push(result);
    });
  }

  let farmers = result?.Farmer;
  if (farmers.length > 1) {
    farmers.forEach((element: any) => {
      getFarmer(element).then((result) => {
        farmerDetails.push(result);
      });
    });
  }
  return farmerDetails;
}

export const updateFarmer = async (farmer: any, farm: any) => {
  const farmerDoc = doc(db, "farmers", farmer);
  await updateDoc(farmerDoc,
    {
      farm: farm
    });
};

export const updateFarms = async (Farmdata: any) => {
  try {
    const docId = Farmdata.farmerAddress.concat(Farmdata.name.replace(/\s/g, "").toLocaleLowerCase());
    const farmDoc = doc(db, "farms", docId);
    await setDoc(farmDoc, Farmdata);
  } catch (error) {

  }
};

export const getAllFarmers = async (company: string) => {
  const q = query(collection(db, "farmers"), where("company", "==", company));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs;
};

export const getFarmerFarms = async (farmerAddress: string) => {
  const q = query(
    collection(db, "farms"),
    where("farmerAddress", "==", farmerAddress)
  );
  const querySnapshot = await getDocs(q);
  const docData = querySnapshot.docs.map(doc => doc.data());
  if (docData !== null) {
    return docData;
  }
  return null;
};

export const saveCompany = async (company: CompanyType) => {
  try {
    const companyDoc = doc(db, "companies", company.address);
    await setDoc(companyDoc, company);
  } catch (error) {

  }
};

export const getCompany = async (address: string) => {
  const docRef = doc(db, "companies", address);
  const docData = await getDoc(docRef);
  if (docData.exists()) {
    return docData.data();
  }
  return null;
};

export const getImageUrl = async (id: string) => {
  const url = await getDownloadURL(ref(storage, id));
  return url;
};

export const getCafepsaImageUrl = async (id: string) => {
  let download = id + '.jpeg'
  console.log(download)
  const url = await getDownloadURL(ref(storage, download));
  console.log(download)
  return url;
};


export const getCafepsaJsonUrl = async (id: string) => {
  let download = 'CAFEPSA/' + id + '.json'
  console.log(download)
  const url = await getDownloadURL(ref(storage, download));
  console.log(download)
  return url;
};

export const saveFarm = async (farm: FarmType) => {
  try {
    const docId = farm.farmerAddress.concat(farm.name.toLocaleLowerCase());
    const farmDoc = doc(db, "farms", docId);
    const farmData = {
      farmerAddress: farm.farmerAddress,
      company: farm.company,
      name: farm.name,
      height: farm.height,
      area: farm.area,
      certifications: farm.certifications,
      latitude: farm.latitude,
      longitude: farm.longitude,
      bio: farm.bio,
      country: farm.country,
      region: farm.region,
      village: farm.village,
      village2: farm.village2,
      varieties: farm.varieties,
      shadow: farm.shadow,
      familyMembers: farm.familyMembers,
      ethnicGroup: farm.ethnicGroup,
    };
    await setDoc(farmDoc, farmData);
  } catch (error) {

  }
};

export const saveFarms = async (farms: Array<FarmType>) => {
  try {
    const batchLimit = 500;
    let currentInit = 0;
    let currentLast = farms.length;
    if (farms.length > batchLimit) {
      currentLast = batchLimit;
    }

    while (currentInit < farms.length) {
      const batch = writeBatch(db);
      const farmsBatch = farms.slice(currentInit, currentLast);

      for (let i = 0; i < farmsBatch.length; i += 1) {
        const nameArray = farmsBatch[i].name.toLocaleLowerCase().split(" ");
        const docId = farmsBatch[i].farmerAddress
          .concat("#")
          .concat(nameArray.join("-"));
        const farmDoc = doc(db, "farms", docId);
        batch.set(farmDoc, farmsBatch[i]);
      }
      await batch.commit();

      currentInit = currentLast;
      const remaining = farms.length - currentLast;
      if (remaining > batchLimit) {
        currentLast += batchLimit;
      } else {
        currentLast = farms.length;
      }
    }
  } catch (error) {

  }
};

export const getFarms = async (company: string) => {
  const q = query(collection(db, "farms"), where("company", "==", company));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs;
};

export const getFarm = async (id: string) => {
  const docRef = doc(db, "farms", id);
  const docData = await getDoc(docRef);
  if (docData.exists()) {
    return docData.data();
  }
  return null;
};


export const saveBatch = async (batch: any) => {
  try {
    const docId = batch.farmerAddress.concat(batch.name.toLocaleLowerCase());
    const farmDoc = doc(db, "batches", docId);
    const farmData = {
      farmerAddress: batch.farmerAddress,
      company: batch.company,
      name: batch.name,
      height: batch.height,
      area: batch.area,
      certifications: batch.certifications,
      latitude: batch.latitude,
      longitude: batch.longitude,
      bio: batch.bio,
      country: batch.country,
      region: batch.region,
      village: batch.village,
      village2: batch.village2,
      varieties: batch.varieties,
      shadow: batch.shadow,
      familyMembers: batch.familyMembers,
      ethnicGroup: batch.ethnicGroup,
    };
    await setDoc(farmDoc, farmData);
  } catch (error) {

  }

};


export const saveFarmerData = async (farmerData: any, id: string) => {
  try {
    const docId = id;
    const farmDoc = doc(db, "batches", docId);
    const farmData = {
      address: id,
      bio: farmerData.bio,
      company: farmerData.company,
      cooperativeID: farmerData.cooperativeId,
      country: farmerData.country,
      farmerId: farmerData.farmerId,
      fullname: farmerData.fullname,
      gender: farmerData.gender,
      region: farmerData.region,
      village: farmerData.village,
      village2: farmerData.village2
    };
    await setDoc(farmDoc, farmData);
  } catch (error) {

  }

};

export const authData = () => {
  return getAuth(app)
}

export const UserData = () =>{
  const dataUser = localStorage.getItem('user');
  if (dataUser !== null) {
    const myObject = JSON.parse(dataUser);
    // Ahora puedes trabajar con 'myObject' como un objeto válido
    console.log(myObject.displayName);
    console.log(myObject.email)
    // @ts-ignore
   return {
     name: myObject.displayName,
     email: myObject.email,
     photo: myObject.photoURL
   };
  } else {
    return {
      name: '',
      email: '',
      photo: '',
    };
  }
}


export const getBatch = async (ipfsHash: string) => {
  const docRef = doc(db, "batches", ipfsHash);
  const docData = await getDoc(docRef);
  if (docData.exists()) {
    return docData.data();
  }
  return null;
};


export const getAllBatches = async (company: string) => {
  const q = query(collection(db, "batches"), where("parentId", "==", company));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs;
};

