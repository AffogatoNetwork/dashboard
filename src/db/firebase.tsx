import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { FarmerType } from "../components/common/types";

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
