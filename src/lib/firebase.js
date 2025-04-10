"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompleteCV = exports.getJobPositions = exports.createJobPosition = exports.getCVs = exports.deleteCV = exports.createCV = exports.deleteCandidate = exports.createOrUpdateCandidate = exports.deleteFileFromStorage = exports.uploadFileToStorage = exports.checkFirestoreConnection = exports.db = exports.storage = exports.firebaseConfig = void 0;
// firebase.ts
const app_1 = require("firebase/app");
const storage_1 = require("firebase/storage");
const firestore_1 = require("firebase/firestore");
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
console.log('Inicializando Firebase con configuración:', {
    projectId: exports.firebaseConfig.projectId,
    storageBucket: exports.firebaseConfig.storageBucket,
    authDomain: exports.firebaseConfig.authDomain
});
if (!exports.firebaseConfig.storageBucket) {
    throw new Error('Firebase Storage Bucket no configurado. Por favor, verifica las variables de entorno.');
}
// Inicialización segura de Firebase
let app;
try {
    app = (0, app_1.getApp)();
    console.log('Firebase ya estaba inicializado.');
}
catch (e) {
    app = (0, app_1.initializeApp)(exports.firebaseConfig);
    console.log('Firebase inicializado correctamente.');
}
// Inicializar servicios
exports.storage = (0, storage_1.getStorage)(app);
exports.db = (0, firestore_1.initializeFirestore)(app, {
    experimentalForceLongPolling: true,
});
// Función para verificar la conexión a Firestore
async function checkFirestoreConnection() {
    try {
        console.log('Verificando conexión a Firestore...');
        // Intentar escribir un documento de prueba
        const testRef = (0, firestore_1.doc)(exports.db, 'test_connection', 'test_doc');
        await (0, firestore_1.setDoc)(testRef, {
            timestamp: firestore_1.Timestamp.now(),
            message: 'Test de conexión exitoso'
        });
        console.log('✓ Escritura en Firestore exitosa');
        // Intentar leer el documento
        const docSnap = await (0, firestore_1.getDoc)(testRef);
        if (docSnap.exists()) {
            console.log('✓ Lectura en Firestore exitosa:', docSnap.data());
            // Limpiar el documento de prueba
            await (0, firestore_1.deleteDoc)(testRef);
            console.log('✓ Limpieza de documento de prueba completada');
            return true;
        }
        else {
            throw new Error('No se pudo leer el documento de prueba');
        }
    }
    catch (error) {
        console.error('❌ Error al verificar la conexión a Firestore:', error);
        throw error;
    }
}
exports.checkFirestoreConnection = checkFirestoreConnection;
// Verificar la configuración inicial
console.log('Configuración de Firebase:', {
    projectId: exports.firebaseConfig.projectId,
    storageBucket: exports.firebaseConfig.storageBucket,
    authDomain: exports.firebaseConfig.authDomain
});
function sanitize(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined));
}
// Storage
async function uploadFileToStorage(file, folder) {
    try {
        const timestamp = Date.now();
        const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueFilename = `${timestamp}-${safeFilename}`;
        const filePath = `${folder}/${uniqueFilename}`;
        const storageRef = (0, storage_1.ref)(exports.storage, filePath);
        console.log('Subiendo archivo:', filePath);
        const buffer = await file.arrayBuffer();
        const blob = new Blob([buffer], { type: file.type });
        const snapshot = await (0, storage_1.uploadBytes)(storageRef, blob);
        const downloadURL = await (0, storage_1.getDownloadURL)(snapshot.ref);
        console.log('Archivo subido exitosamente:', downloadURL);
        return downloadURL;
    }
    catch (error) {
        console.error('Error al subir archivo:', error);
        throw error;
    }
}
exports.uploadFileToStorage = uploadFileToStorage;
async function deleteFileFromStorage(fileUrl) {
    try {
        const fileRef = (0, storage_1.ref)(exports.storage, fileUrl);
        await (0, storage_1.deleteObject)(fileRef);
        console.log('Archivo eliminado de Storage:', fileUrl);
    }
    catch (error) {
        console.error('Error al eliminar archivo:', error);
        throw error;
    }
}
exports.deleteFileFromStorage = deleteFileFromStorage;
// Candidates
async function createOrUpdateCandidate(data) {
    try {
        console.log('Procesando candidato:', data.email);
        const candidatesRef = (0, firestore_1.collection)(exports.db, 'candidates');
        const q = (0, firestore_1.query)(candidatesRef, (0, firestore_1.where)('email', '==', data.email));
        const snapshot = await (0, firestore_1.getDocs)(q);
        const candidateData = Object.assign(Object.assign({}, sanitize(data)), { updatedAt: firestore_1.Timestamp.now() });
        if (!snapshot.empty) {
            const docRef = snapshot.docs[0].ref;
            await (0, firestore_1.setDoc)(docRef, candidateData, { merge: true });
            console.log('Candidato actualizado:', docRef.id);
            return docRef.id;
        }
        const docRef = await (0, firestore_1.addDoc)(candidatesRef, Object.assign(Object.assign({}, candidateData), { createdAt: firestore_1.Timestamp.now() }));
        console.log('Nuevo candidato creado:', docRef.id);
        return docRef.id;
    }
    catch (error) {
        console.error('Error en createOrUpdateCandidate:', error);
        throw error;
    }
}
exports.createOrUpdateCandidate = createOrUpdateCandidate;
async function deleteCandidate(candidateId) {
    try {
        await (0, firestore_1.deleteDoc)((0, firestore_1.doc)(exports.db, 'candidates', candidateId));
        console.log('Candidato eliminado:', candidateId);
    }
    catch (error) {
        console.error('Error al eliminar candidato:', error);
        throw error;
    }
}
exports.deleteCandidate = deleteCandidate;
// CVs
async function createCV(data) {
    try {
        const cleanData = Object.assign(Object.assign({}, sanitize(data)), { createdAt: firestore_1.Timestamp.now() });
        const docRef = await (0, firestore_1.addDoc)((0, firestore_1.collection)(exports.db, 'cvs'), cleanData);
        console.log('CV creado:', docRef.id);
        return docRef.id;
    }
    catch (error) {
        console.error('Error al crear CV:', error);
        throw error;
    }
}
exports.createCV = createCV;
async function deleteCV(cvId) {
    try {
        const cvDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(exports.db, 'cvs', cvId));
        if (!cvDoc.exists())
            throw new Error('CV no encontrado');
        const cv = cvDoc.data();
        await deleteFileFromStorage(cv.fileUrl);
        await (0, firestore_1.deleteDoc)((0, firestore_1.doc)(exports.db, 'cvs', cvId));
        console.log('CV eliminado:', cvId);
    }
    catch (error) {
        console.error('Error al eliminar CV:', error);
        throw error;
    }
}
exports.deleteCV = deleteCV;
async function getCVs() {
    try {
        const q = (0, firestore_1.query)((0, firestore_1.collection)(exports.db, 'cvs'), (0, firestore_1.orderBy)('createdAt', 'desc'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        const cvs = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        console.log('CVs encontrados:', cvs.length);
        return cvs;
    }
    catch (error) {
        console.error('Error al obtener CVs:', error);
        throw error;
    }
}
exports.getCVs = getCVs;
// Job Positions
async function createJobPosition(data) {
    try {
        const cleanData = Object.assign(Object.assign({}, sanitize(data)), { requirements: sanitize(data.requirements), createdAt: firestore_1.Timestamp.now() });
        console.log('Guardando puesto:', cleanData);
        const docRef = await (0, firestore_1.addDoc)((0, firestore_1.collection)(exports.db, 'jobPositions'), cleanData);
        console.log('Puesto creado:', docRef.id);
        return docRef.id;
    }
    catch (error) {
        console.error('Error al crear puesto:', error);
        throw error;
    }
}
exports.createJobPosition = createJobPosition;
async function getJobPositions() {
    try {
        const q = (0, firestore_1.query)((0, firestore_1.collection)(exports.db, 'jobPositions'), (0, firestore_1.orderBy)('createdAt', 'desc'));
        const snapshot = await (0, firestore_1.getDocs)(q);
        const positions = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        console.log('Puestos encontrados:', positions.length);
        return positions;
    }
    catch (error) {
        console.error('Error al obtener puestos:', error);
        throw error;
    }
}
exports.getJobPositions = getJobPositions;
async function getCompleteCV(cvId) {
    try {
        const cvDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(exports.db, 'cvs', cvId));
        if (!cvDoc.exists())
            throw new Error('CV no encontrado');
        const cv = Object.assign({ id: cvDoc.id }, cvDoc.data());
        const candidateDoc = await (0, firestore_1.getDoc)((0, firestore_1.doc)(exports.db, 'candidates', cv.candidateId));
        console.log('CV completo cargado');
        return Object.assign(Object.assign({}, cv), { candidate: Object.assign({ id: candidateDoc.id }, candidateDoc.data()) });
    }
    catch (error) {
        console.error('Error en getCompleteCV:', error);
        throw error;
    }
}
exports.getCompleteCV = getCompleteCV;
