// firebase/firebaseConfig.js
import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBudsBIH33GcWDMjjoWe2Lp31BuBA6poyw",
  authDomain: "fbiapii.firebaseapp.com",
  projectId: "fbiapii",
  storageBucket: "fbiapii.firebasestorage.app",
  messagingSenderId: "795343701143",
  appId: "1:795343701143:web:c1ae96999970cd9cf995d2",
};

const app = initializeApp(firebaseConfig);

export const auth = Platform.OS === 'web'
  ? getAuth(app)
  : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

export const db = getFirestore(app);