// config.js
const firebaseConfig = {
  apiKey: "AIzaSyCdj5IHb1afezFQBHJegFNRejKoscoQMF0",
  authDomain: "mdata-42fa6.firebaseapp.com",
  projectId: "mdata-42fa6",
  storageBucket: "mdata-42fa6.appspot.com",
  messagingSenderId: "524100858912",
  appId: "1:524100858912:web:55c20c4248533a5e387845"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Export the db object for use in other modules
export { db };