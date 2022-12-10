import { initializeApp } from "firebase/app";
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
  arrayUnion,
  writeBatch,
} from "firebase/firestore";
import { getStorage, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { CompanyType, FarmType, FarmerType } from "../components/common/types";

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
        console.log(snapshot);
      });
    }
    const farmerDoc = doc(db, "farmers", farmer.address);
    await setDoc(farmerDoc, farmer);
  } catch (error) {
    console.log(error);
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

export const updateFarmer = async (farmer: any, farm: any) => {
console.log(farmer, farm)
  const farmerDoc = doc(db, "farmers", farmer);
  await updateDoc(farmerDoc,
      {
        farm: farm
      });
  console.log('gg')
};




export const updateFarms = async (cooperative: string, farmData: any ) => {
  try {
    const docId = cooperative;
    const farmDoc = doc(db, "farms", docId);
    await updateDoc(farmDoc, {
      farms: arrayUnion(farmData)
    });
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
  }
};

export const getFarms = async (company: string) => {
  const q = query(collection(db, "farms"), where("company", "==", company));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs;
};
