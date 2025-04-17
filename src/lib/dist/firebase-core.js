"use strict";
exports.__esModule = true;
exports.db = exports.app = exports.firebaseConfig = void 0;
var app_1 = require("firebase/app");
var firestore_1 = require("firebase/firestore");
// Firebase configuration
exports.firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
// Initialize Firebase
var app = (function () {
    try {
        return app_1.getApp();
    }
    catch (_a) {
        return app_1.initializeApp(exports.firebaseConfig);
    }
})();
exports.app = app;
// Initialize Firestore (always needed)
var db = firestore_1.getFirestore(app);
exports.db = db;
