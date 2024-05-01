import firebase from "firebase/compat/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { arrayUnion, arrayRemove, getFirestore, updateDoc } from "firebase/firestore";
import { doc, collection, setDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBy20quEMBowBaOpFTBlmjHrf-cEbY0NSk",
  authDomain: "cs194-oovoo.firebaseapp.com",
  projectId: "cs194-oovoo",
  storageBucket: "cs194-oovoo.appspot.com",
  messagingSenderId: "21023404171",
  appId: "1:21023404171:web:dffb907f62ec4f5541a48e",
  measurementId: "G-9ZXH53GEVP"
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}
initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const auth = getAuth(app);
const db = getFirestore(app);


const writeUserDataToFirestore = async (collection, data) => {
  currentUser = getAuth().cxqurrentUser;
  try {
    const userRef = doc(db, collection, currentUser.uid);
    setDoc(userRef, data, { merge: true });
  } catch (error) {
    return error;
  }
}

const writeCommunityCreateDataToFirestore = async (data) => {
  try {
    const communityRef = doc(db, "communities", data["community_handle"]);
    setDoc(communityRef, data, { merge: true });
  } catch (error) {
    return error;
  }
}

const writeCommunityUserToFirestore = async (communityHandle) => {
  currentUser = getAuth().currentUser
  try {
    console.log("Trying to write User " + currentUser.displayName + " to Community " + communityHandle)

    communityRef = doc(db, "communities", communityHandle)
    communitySnapshot = await getDoc(communityRef)
    communityData = communitySnapshot.data()

    await updateDoc(communityRef, {
      num_members: (communityData.members || []).length + 1,
      members: arrayUnion(currentUser.displayName),
    })

    console.log("User successfully written to Community")
  } catch (error) {
    console.log("Error writing user to Community: ", error)
    throw (error)
  }
}

const writeTripDataToFirestore = async (data) => {
  try {
    documentId = data["community_handle"] + "_" + data["source"] + "_" + data["destination"] + "_" + data["date"].toString()
    const tripRef = doc(db, "trips", documentId);

    console.log("Trying to write Trip " + documentId)

    setDoc(tripRef, data, { merge: true });

    console.log("Trip successfully written to database")
  } catch (error) {
    console.log("Error writing Trip: ", error)
    return error;
  }
}

const writeVehicleDataToFirestore = async (data) => {
  currentUser = getAuth().currentUser
  console.log(currentUser.uid)
  try {
    console.log("Trying to write Vehicle data to firestore")
    console.log(data)
    const vehicleRef = doc(db, "vehicles", data["car_id"])
    setDoc(vehicleRef, data, { merge: true })
  } catch (error) {
    return error
  }
}

const writeTripVehicleToFirestore = async (tripDocId, tripVehicle) => {
  try {
    console.log('Trying to write Vehicle ' + tripVehicle + ' to Trip ' + tripDocId)

    tripRef = doc(db, "trips", tripDocId)

    await updateDoc(tripRef, {
      trip_cars: arrayUnion(tripVehicle)
    })

    console.log('Vehicle successfully written to Trip')
  } catch (error) {
    console.log('Error writing vehicle to trip: ', error)
    throw(error)
  }
}

// remove user from a community
const writeRemoveUserFromCommunity = async (community_handle) => {
  try {
    currentUser = getAuth().currentUser;
    const communityRef = doc(db, "communities", community_handle);

    await updateDoc(communityRef, {
      members: arrayRemove(currentUser.displayName)
    });
  } catch (error) {
    console.log("Error removing user from community: ", error)
    throw error
  }
}


// This returns all vehicles attached to the current user, excluding rideshare options
const getUserVehiclesFromFirestore = async () => {
  try {
    currentUser = getAuth().currentUser
    const q = query(collection(db, "vehicles"), where('user_id', '==', currentUser.uid), where('vehicle_model', 'not-in', ['Uber', 'UberXL']))
    data = []

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      data.push(doc.data())
    })

    console.log("Retrieving Vehicle data for user " + currentUser.uid)
    console.log(data)

    return data
  } catch (error) {
    console.log("Error retrieving user vehicles: ", error)
    throw error
  }
}

const getVehicleFromFirestore = async (carDocId) => {
  try {
    const carRef = doc (db, "vehicles", carDocId)
    const carSnapshot = await getDoc(carRef)
    const carData = carSnapshot.data()

    return carData
  } catch (error) {
    console.error('Error getting vehicle', error)
  }
}

const getTripVehiclesFromFirestore = async (tripDocId) => {
  try {
    const tripRef = doc(db, "trips", tripDocId)
    const tripSnapshot = await getDoc(tripRef)
    const tripData = tripSnapshot.data()
    
    let tripVehicles = []

    await Promise.all(tripData["trip_cars"].map(async (vehicle) => {
      try {
        let vehicleData = await getVehicleFromFirestore(vehicle["car_id"])
        let userRef = doc(db, "users", vehicleData.user_id)
        let userSnapshot = await getDoc(userRef)
        let userData = userSnapshot.data()
        tripVehicles.push({...vehicleData, ...vehicle, ...userData})
      } catch (error) {
        console.error('Error fetching vehicle data for carId', carId)
      }
    }))

    return tripVehicles
  } catch (error) {
    console.error('Error getting vehicles for Trip', tripDocId)
  }
}

const getDocFromFirestore = async (collection, docID) => {
  const docRef = doc(db, collection, docID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    console.log("No such document!");
    return {}
  }
}

const getCommunitiesFromFirestore = async () => {
  currentUser = getAuth().currentUser;
  const q = query(collection(db, "communities"), where("members", "array-contains", currentUser.displayName));
  data = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push(doc.data())
  });

  console.log("Retrieving Community data for user " + currentUser.displayName)
  console.log(data)

  return data;
}

const getAllDocuments = async (collection_name) => {
  data = [];

  const querySnapshot = await getDocs(collection(db, collection_name));
  querySnapshot.forEach((doc) => {
    data.push(doc.data())
  });

  return data;
}

const getTripsFromFirestore = async (collection_name) => {
  currentUser = getAuth().currentUser;
  const q = query(collection(db, collection_name), where("trip_members", "array-contains", currentUser.displayName));
  data = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push(doc.data())
  });

  return data;
}

const getAllTripsForCommunityFromFirestore = async (community_handle) => {
  console.log('Attempting to retrieve all trips for community', community_handle)
  trips = []
  const querySnapshot = await getDocs(collection(db, "trips"))
  querySnapshot.forEach((doc) => {
    console.log('docs', doc)
    if (doc.data().community_handle == community_handle) {
      trips.push(doc.data())
    }
  })

  return trips
}

// get all trips of all of the communities that a user is in
const getAllTripsFromFirestore = async () => {
  currentUser = getAuth().currentUser;

  // get all communities the user is part of, list of community handles
  communitiesData = await getCommunitiesFromFirestore();
  communities = [];
  communitiesData.forEach((com) => {
    communities.push(com.community_handle);
  });

  // go through all trips, select ones that the user should be able to see
  trips = [];
  const querySnapshot = await getDocs(collection(db, "trips"));
  querySnapshot.forEach((doc) => {
    if (communities.includes(doc.data().community_handle)) {
      trips.push(doc.data());
    }
  });

  return trips;
}

export {
  auth,
  writeUserDataToFirestore,
  writeCommunityUserToFirestore,
  writeVehicleDataToFirestore,
  getDocFromFirestore,
  getTripsFromFirestore,
  getTripVehiclesFromFirestore,
  getCommunitiesFromFirestore,
  getAllDocuments,
  getAllTripsFromFirestore,
  getAllTripsForCommunityFromFirestore,
  getUserVehiclesFromFirestore,
  writeCommunityCreateDataToFirestore,
  writeTripDataToFirestore,
  writeTripVehicleToFirestore,
  writeRemoveUserFromCommunity
};

