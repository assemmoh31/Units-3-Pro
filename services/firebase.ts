import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB81-YUohQq6rBiRQnzwNRGrLGrJGKs0M0",
  authDomain: "unitconverpro.firebaseapp.com",
  projectId: "unitconverpro",
  storageBucket: "unitconverpro.firebasestorage.app",
  messagingSenderId: "1063076389366",
  appId: "1:1063076389366:web:c1286f510f898f37cb27d7",
  measurementId: "G-KCXY5X62ZK"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };