// firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBudsBIH33GcWDMjjoWe2Lp31BuBA6poyw",
  authDomain: "fbiapii.firebaseapp.com",
  projectId: "fbiapii",
  storageBucket: "fbiapii.firebasestorage.app",
  messagingSenderId: "795343701143",
  appId: "1:795343701143:web:c1ae96999970cd9cf995d2",

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };