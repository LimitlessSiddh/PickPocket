import dotenv from "dotenv";
import admin from 'firebase-admin'


dotenv.config();

const serviceAccount = process.env.VITE_FIREBASE_PRIVATE_KEY;



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});


export default admin;