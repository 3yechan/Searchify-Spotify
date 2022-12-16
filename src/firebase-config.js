import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAsxouqurcf60mGZfAeysO4aew_f4ANanA",
    authDomain: "spotify-search-history.firebaseapp.com",
    projectId: "spotify-search-history",
    storageBucket: "spotify-search-history.appspot.com",
    messagingSenderId: "468962801390",
    appId: "1:468962801390:web:8e02ae2f78a073b78125ff",
    measurementId: "G-3Z5BKXZ2Q4"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore()