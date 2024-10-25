import { initializeApp } from 'firebase/app';
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
} from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  StringFormat,
  uploadBytes,
  uploadString,
} from 'firebase/storage';
import { CompanyType, FarmerType, FarmType } from '../components/common/types';
import { getAuth } from 'firebase/auth';

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
      uploadBytes(storageRef, image).then((snapshot) => {});
    }
    const farmerDoc = doc(db, 'farmers', farmer.address);
    await setDoc(farmerDoc, farmer);
  } catch (error) {}
};

export const saveVarietyData = async (varietyData: any, id: string) => {
  console.log(varietyData, id);
  try {
    await setDoc(doc(db, 'varieties', varietyData), {
      variety: varietyData,
      createdBy: id,
      Date: Date.now().toString(),
      active: true,
    });
  } catch (error) {
    console.error(error);
  }
};

export const saveCertificationData = async (
  certificationData: any,
  id: string
) => {
  try {
    await setDoc(doc(db, 'certifications', certificationData), {
      certification: certificationData,
      Date: Date.now(),
      createdBy: id,
      active: true,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getVarieties = async () => {
  const q = query(collection(db, 'varieties'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs;
};

export const getCertifications = async (company: string) => {
  console.log(company);
  const q = query(
    collection(db, 'certifications'),
    where('createdBy', '==', company)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs;
};

export const getFarmer = async (address: string) => {
  const docRef = doc(db, 'farmers', address);
  const docData = await getDoc(docRef);
  if (docData.exists()) {
    return docData.data();
  }
  return null;
};

export const getFarmerByBatche = async (result: any) => {
  let farmerDetails: any[] = [];
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
};

export const updateFarmer = async (farmer: any, farm: any) => {
  const farmerDoc = doc(db, 'farmers', farmer);
  await updateDoc(farmerDoc, {
    farm: farm,
  });
};

export const updateFarmerImage = async (address: string, image: any) => {
  try {
    if (image !== null) {
      const storageRef = ref(storage, address);
      uploadBytes(storageRef, image).then((snapshot) => {
        console.log(snapshot);
      });
    }
  } catch (error) {}
};

export const updateFarms = async (Farmdata: any) => {
  try {
    const docId = Farmdata.farmerAddress.concat(
      Farmdata.name.replace(/\s/g, '').toLocaleLowerCase()
    );
    const farmDoc = doc(db, 'farms', docId);
    console.log(Farmdata);
    await setDoc(farmDoc, Farmdata);
  } catch (error) {}
};

export const getAllFarmers = async (company: string) => {
  const q = query(collection(db, 'farmers'), where('company', '==', company));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs;
};

export const getAllFarmsByCompany = async (company: string) => {
  const q = query(collection(db, 'farms'), where('company', '==', company));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs;
};

export const getFarmerFarms = async (farmerAddress: string) => {
  const q = query(
    collection(db, 'farms'),
    where('farmerAddress', '==', farmerAddress)
  );
  const querySnapshot = await getDocs(q);
  const docData = querySnapshot.docs.map((doc) => doc.data());
  if (docData !== null) {
    return docData;
  }
  return null;
};

export const saveCompany = async (company: CompanyType) => {
  try {
    const companyDoc = doc(db, 'companies', company.address);
    await setDoc(companyDoc, company);
  } catch (error) {}
};

export const getCompany = async (address: string) => {
  const docRef = doc(db, 'companies', address);
  const docData = await getDoc(docRef);
  if (docData.exists()) {
    return docData.data();
  }
  return null;
};

export const getImageUrl = async (id: string) => {
  return await getDownloadURL(ref(storage, id));
};

export const getCafepsaImageUrl = async (id: string) => {
  let download = id + '.jpeg';
  return await getDownloadURL(ref(storage, download));
};

export const getCafepsaJsonUrl = async (id: string) => {
  let download = 'CAFEPSA/' + id + '.json';
  return await getDownloadURL(ref(storage, download));
};

export const editFarm = async (data: any) => {
  let user = UserData();
  console.log(data);
  const dir = data.address + data.name.toLocaleLowerCase();
  try {
    const farmDoc = doc(db, 'farms', dir);

    const docSnap = await getDoc(farmDoc);

    if (!docSnap.exists()) {
      console.error('No such document!');
      return;
    }

    const farmData = {
      area: data.area,
      latitude: data.latitude,
      longitude: data.longitude,
      heigth: data.heigth,
      country: data.country,
      fullname: data.name,
      shadow: data.shadow,
      varieties: data.varieties,
      village: data.village,
      village2: data.village2,
      updateAt: Date.now(),
      updatedBy: user.email,
    };
    console.log('save');

    await updateDoc(farmDoc, farmData);
  } catch (error) {
    console.error(error);
  }
};

export const editFarmers = async (data: any) => {
  console.log(data);
  let user = UserData();

  const dir = data.address;

  try {
    if (!dir) {
      throw new Error('Document reference (address) is missing.');
    }

    const farmDoc = doc(db, 'farmers', dir);
    console.log('Updating document for:', dir);

    const farmData = {
      fullname: data.fullname.trim(),
      gender: data.gender,
      region: data.region || '',
      village2: data.village2,
      country: data.country,
      updateAt: Date.now(),
      updatedBy: user.email,
    };

    console.log('Prepared farm data:', farmData);

    await updateDoc(farmDoc, farmData);
    console.log('Farm data updated successfully.');
  } catch (error) {
    console.error('Error updating farm data:', error);
  }
};

export const editCertifications = async (data: any) => {
  let user = UserData();
  const origin = window.location.origin + '/farmers/';
  const qrCode = data.qrCode;
  const dir = qrCode.replaceAll(origin, '').trim();

  try {
    const farmDoc = doc(db, 'farmers', dir);
    const farmData = {
      fullname: data.fullName,
      area: data.area,
      usda: data.usda,
      fairtrade: data.fairtrade,
      manosdemujer: data.manosdemujer,
      spp: data.spp,
      updateAt: Date.now(),
      updatedBy: user.email,
    };
    await updateDoc(farmDoc, farmData);
    window.location.reload();
  } catch (error) {}
};

export const editBatch = async (formData: any) => {
  const user = UserData();

  const docId = formData.ipfsHash; // Assuming the batch is identified by 'Name'
  try {
    const batchDoc = doc(db, 'batches', docId);

    // Retrieve the current batch data
    const docSnap = await getDoc(batchDoc);

    if (!docSnap.exists()) {
      console.error('No such document!');
      return;
    }

    // Get the current batch data
    const currentData = docSnap.data();
    console.log('Current batch data:', currentData);

    // Prepare batch data for update, keeping specific fields unchanged
    const updatedData = {
      ...currentData, // Keep existing data
      Name: formData.Name || currentData.Name,
      Description: formData.Description || currentData.Description,
      UrlCatacion: formData.UrlCatacion || currentData.UrlCatacion || '',
      UrlTrilla: formData.UrlTrilla || currentData.UrlTrilla || '',
      Profile: {
        general_description: '',
        cup_profile:
          formData['Profile.cup_profile'] ||
          currentData.Profile?.cup_profile ||
          '',
        scaa_url:
          formData['Profile.scaa_url'] || currentData.Profile?.scaa_url || '',
      },
      Roasting: {
        roast_type:
          formData['Roasting.roast_type'] ||
          currentData.Roasting?.roast_type ||
          '',
        grind_type:
          formData['Roasting.grind_type'] ||
          currentData.Roasting?.grind_type ||
          '',
        packaging:
          formData['Roasting.packaging'] ||
          currentData.Roasting?.packaging ||
          '',
        bag_size:
          formData['Roasting.bag_size'] || currentData.Roasting?.bag_size || '',
      },
      dryMill: {
        export_id:
          formData['dryMill.export_id'] || currentData.dryMill?.export_id || '',
        export_drying_id:
          formData['dryMill.export_drying_id'] ||
          currentData.dryMill?.export_drying_id ||
          '',
        facility:
          formData['dryMill.facility'] || currentData.dryMill?.facility || '',
        buyer: formData['dryMill.buyer'] || currentData.dryMill?.buyer || '',
      },
      wetMill: {
        entry_id:
          formData['wetMill.entry_id'] || currentData.wetMill?.entry_id || '',
        drying_id:
          formData['wetMill.drying_id'] || currentData.wetMill?.drying_id || '',
        facility:
          formData['wetMill.facility'] || currentData.wetMill?.facility || '',
        process:
          formData['wetMill.process'] || currentData.wetMill?.process || '',
      },
      createdAt: Date.now(),
      updatedBy: user.email,
    };

    // Update the batch data in Firestore
    await updateDoc(batchDoc, updatedData);
    console.log('Batch data updated successfully.');
  } catch (error) {
    console.error('Error updating batch:', error);
  }
};

export const saveFarm = async (farm: FarmType) => {
  console.log(farm);
  try {
    const docId = farm.farmerAddress.concat(farm.name.toLocaleLowerCase());
    const farmDoc = doc(db, 'farms', docId);
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
    await setDoc(farmDoc, farmData).then(() => {
      console.log();
      return true;
    });
    console.log('save');
  } catch (error) {}
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
        const nameArray = farmsBatch[i].name.toLocaleLowerCase().split(' ');
        const docId = farmsBatch[i].farmerAddress
          .concat('#')
          .concat(nameArray.join('-'));
        const farmDoc = doc(db, 'farms', docId);
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
  } catch (error) {}
};

export const getFarms = async (company: string) => {
  const q = query(collection(db, 'farms'), where('company', '==', company));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs;
};

export const getFarm = async (id: string) => {
  const docRef = doc(db, 'farms', id);
  const docData = await getDoc(docRef);
  if (docData.exists()) {
    return docData.data();
  }
  return null;
};

export const saveBatch = async (batch: any) => {
  try {
    const docId = batch.farmerAddress.concat(batch.name.toLocaleLowerCase());
    const farmDoc = doc(db, 'batches', docId);
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
  } catch (error) {}
};

export const createBatch = async (formData: any) => {
  const user = UserData();

  try {
    // Use id_lote as the document ID
    const docId = formData.Name;
    const batchDoc = doc(db, 'batches', docId);
    console.log(formData);
    // Construct the batch data from the provided structure
    const batchData = {
      Name: formData.Name || '',
      Farm: formData.Farm || '',
      Cooperative: formData.Cooperative || '',
      Description: formData.Description || '',
      Farmers: formData.Farmers || [],
      image: formData.image || '',
      parentId: formData.parentId || '',
      ipfsHash: formData.ipfsHash || '',
      UrlCatacion: formData.UrlCatacion || '',
      UrlTrilla: formData.UrlTrilla || '',
      Profile: {
        acidity: formData.Profile.acidity || '',
        aftertaste: formData.Profile.aftertaste || '',
        aroma: formData.Profile.aroma || '',
        body: formData.Profile.body || '',
        flavor: formData.Profile.flavor || '',
        note: formData.Profile.note || '',
        sweetness: formData.Profile.sweetness || '',
        general_description: formData.Profile.general_description || '',
        cup_profile: formData.Profile.cup_profile || '',
        scaa_url: formData.Profile.scaa_url || '',
      },
      Roasting: {
        roast_date: formData.Roasting?.roast_date || '',
        roast_type: formData.Roasting?.roast_type || '',
        grind_type: formData.Roasting?.grind_type || '',
        packaging: formData.Roasting?.packaging || '',
        bag_size: formData.Roasting?.bag_size || '',
      },
      dryMill: {
        export_id: formData.dryMill?.export_id || '',
        export_drying_id: formData.dryMill?.export_drying_id || '',
        facility: formData.dryMill?.facility || '',
        latitude: formData.dryMill?.latitude || '',
        longitude: formData.dryMill?.longitude || '',
        date: formData.dryMill?.date || '',
        prep_type: formData.dryMill?.prep_type || '',
        variety: formData.dryMill?.variety || '',
        quality: formData.dryMill?.quality || '',
        coffee_type: formData.dryMill?.coffee_type || '',
        origin_cert: formData.dryMill?.origin_cert || '',
        threshing_process: formData.dryMill?.threshing_process || '',
        threshing_yield: formData.dryMill?.threshing_yield || '',
        damage_percent: formData.dryMill?.damage_percent || '',
        weight: formData.dryMill?.weight || '',
        note: formData.dryMill?.note || '',
        buyer: formData.dryMill?.buyer || '',
      },
      wetMill: {
        entry_id: formData.wetMill?.entry_id || '',
        drying_id: formData.wetMill?.drying_id || '',
        facility: formData.wetMill?.facility || '',
        latitude: formData.wetMill?.latitude || '',
        longitude: formData.wetMill?.longitude || '',
        variety: formData.wetMill?.variety || '',
        process: formData.wetMill?.process || '',
        drying_type: formData.wetMill?.drying_type || '',
        drying_hours: formData.wetMill?.drying_hours || '',
        date: formData.wetMill?.date || '',
        weight: formData.wetMill?.weight || '',
        certifications: formData.wetMill?.certifications || '',
        note: formData.wetMill?.note || '',
      },
      createdAt: Date.now(),
      createdBy: user.email,
    };

    // Save the batch data to Firestore
    await setDoc(batchDoc, batchData);

    // Convert the batch data to JSON
    const batchJson = JSON.stringify(batchData);

    // Create a reference to Firebase Storage using id_lote for the filename
    const storageRef = ref(storage, `batches/${docId}.json`);

    // Upload the JSON data as a string to Firebase Storage
    await uploadString(storageRef, batchJson);

    // Log success
    console.log(
      'Batch data saved to Firestore and uploaded to Storage successfully.'
    );

    return true;
  } catch (error) {
    console.error('Error saving batch:', error);
  }
};

export const saveFarmerData = async (farmerData: any, id: string) => {
  try {
    const farmDoc = doc(db, 'batches', id);
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
      village2: farmerData.village2,
    };
    await setDoc(farmDoc, farmData);
  } catch (error) {}
};

export const authData = () => {
  return getAuth(app);
};

export const UserData = () => {
  const dataUser = localStorage.getItem('user');
  if (dataUser !== null) {
    const myObject = JSON.parse(dataUser);
    return {
      name: myObject.displayName,
      email: myObject.email,
      photo: myObject.photoURL,
    };
  } else {
    return {
      name: '',
      email: '',
      photo: '',
    };
  }
};

export const canEdit = async (mail: string, company: string) => {
  const q = query(
    collection(db, 'permissions'),
    where('admin', '==', true),
    where('slug', '==', company)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs;
};

export const getBatch = async (ipfsHash: string) => {
  const docRef = doc(db, 'batches', ipfsHash);
  const docData = await getDoc(docRef);
  if (docData.exists()) {
    return docData.data();
  }
  return null;
};

export const getAllBatches = async (company: string) => {
  const q = query(collection(db, 'batches'), where('parentId', '==', company));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs;
};

export const updateAllBatches = async (company: string) => {
  const q = query(collection(db, 'batches'), where('parentId', '==', company));
  const querySnapshot = await getDocs(q);
  // Loop through the filtered documents.
  for (const docSnapshot of querySnapshot.docs) {
    const documentId = docSnapshot.id; // Get the document ID

    // Reference the document.
    const docRef = doc(db, 'batches', documentId);

    // Update the document with the ID in a specific field.
    await updateDoc(docRef, {
      ipfsHash: documentId, // Replace 'idField' with the actual field name where you want to store the ID
    });

    console.log(`Updated document ID ${documentId} in the document.`);
  }
};
