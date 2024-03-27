// Import the functions you need from the SDKs you need
// import 'firebase/auth';
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "@firebase/auth";
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCuMaCTRk7UN9HY-QE5mD0WAPWVGMdPj0w",
    authDomain: "simmons-consulting.firebaseapp.com",
    projectId: "simmons-consulting",
    storageBucket: "simmons-consulting.appspot.com",
    messagingSenderId: "647962575209",
    appId: "1:647962575209:web:52da3dec3430e6cd2dbdf8",
    measurementId: "G-0KTE9GWTDW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

export { auth, firestore };
// export default firebase;
