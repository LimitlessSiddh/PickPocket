import firebase from 'firebase/app';
import "firebase/auth";


// create firebase project and add all info here
const firbaseConfig = {
    apiKey: 1,
    authDomain: 2,
    projectId: 3,
    storageBucket: 4,
    messagingSenderId: 5,
    appId: 6,

};

firebase.initializeApp(firbaseConfig);

export const firebase_auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();