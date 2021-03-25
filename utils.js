import "@firebase/auth";
import admin from'firebase-admin'
import {firebaseKey} from './keys.js'

export const firebaseConfig = {
    apiKey: process.env.firebasekey || firebaseKey,
    authDomain: "windsurfnorge.firebaseapp.com",
    databaseURL: "https://windsurfnorge.firebaseio.com",
    projectId: "windsurfnorge",
    storageBucket: "windsurfnorge.appspot.com",
    messagingSenderId: "40570796100",
    appId: "1:40570796100:web:1fef46f02638fc9264a411",
    measurementId: "G-2398SRG5XT"
};

export const isAuthenticated = async (token) => {
    const authorized = await admin.auth().verifyIdToken(token)
    return authorized;
}
