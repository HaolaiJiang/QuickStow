/**
 * Firebase configuration and initialization.
 * Uses Firebase compat libraries loaded from CDN in index.html
 * Requirements: 1.2, 2.1
 */
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD28GgFZvUkAm6RQx9V8cPfEmhqkWrZl1k",
    authDomain: "quickstow-2832e.firebaseapp.com",
    projectId: "quickstow-2832e",
    storageBucket: "quickstow-2832e.firebasestorage.app",
    messagingSenderId: "941594986120",
    appId: "1:941594986120:web:bca09435062a411e42813d"
};
// Get firebase from window (loaded from CDN)
const firebaseApp = window.firebase;
// Check if Firebase is loaded
let auth = null;
let db = null;
let googleProvider = null;
if (firebaseApp) {
    // Initialize Firebase
    firebaseApp.initializeApp(firebaseConfig);
    auth = firebaseApp.auth();
    db = firebaseApp.firestore();
    googleProvider = new firebaseApp.auth.GoogleAuthProvider();
}
else {
    console.warn('Firebase SDK not loaded. Sync features will be disabled.');
}
export { auth, db, googleProvider };
//# sourceMappingURL=firebase-config.js.map