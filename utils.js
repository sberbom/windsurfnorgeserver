import "@firebase/auth";
import admin from'firebase-admin';
import dotenv from 'dotenv'
import pg from 'pg';

dotenv.config()

export const firebaseConfig = {
    apiKey: process.env.firebasekey,
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

export const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });