"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.checkFirestoreConnection = exports.getCompleteCV = exports.getCVs = exports.createCV = exports.deleteJobPosition = exports.updateJobPosition = exports.getJobPositions = exports.createJobPosition = exports.deleteCV = exports.deleteDocument = exports.deleteCandidate = exports.createOrUpdateCandidate = exports.deleteFileFromStorage = exports.uploadFileToStorage = exports.app = exports.db = exports.storage = exports.firebaseConfig = void 0;
var app_1 = require("firebase/app");
var storage_1 = require("firebase/storage");
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
console.log('Inicializando Firebase con configuración:', {
    projectId: exports.firebaseConfig.projectId,
    storageBucket: exports.firebaseConfig.storageBucket,
    authDomain: exports.firebaseConfig.authDomain
});
if (!exports.firebaseConfig.storageBucket) {
    throw new Error('Firebase Storage Bucket no configurado. Por favor, verifica las variables de entorno.');
}
// Initialize Firebase
var app;
exports.app = app;
try {
    exports.app = app = app_1.getApp();
    console.log('Firebase ya estaba inicializado.');
}
catch (e) {
    exports.app = app = app_1.initializeApp(exports.firebaseConfig);
    console.log('Firebase inicializado correctamente.');
}
// Initialize services
exports.storage = storage_1.getStorage(app);
exports.db = firestore_1.getFirestore(app);
function sanitize(obj) {
    return Object.fromEntries(Object.entries(obj).filter(function (_a) {
        var _ = _a[0], value = _a[1];
        return value !== undefined;
    }));
}
// Storage
function uploadFileToStorage(file, folder) {
    return __awaiter(this, void 0, Promise, function () {
        var timestamp, safeFilename, uniqueFilename, filePath, storageRef, buffer, blob, snapshot, downloadURL, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    timestamp = Date.now();
                    safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                    uniqueFilename = timestamp + "-" + safeFilename;
                    filePath = folder + "/" + uniqueFilename;
                    storageRef = storage_1.ref(exports.storage, filePath);
                    console.log('Subiendo archivo:', filePath);
                    return [4 /*yield*/, file.arrayBuffer()];
                case 1:
                    buffer = _a.sent();
                    blob = new Blob([buffer], { type: file.type });
                    return [4 /*yield*/, storage_1.uploadBytes(storageRef, blob)];
                case 2:
                    snapshot = _a.sent();
                    return [4 /*yield*/, storage_1.getDownloadURL(snapshot.ref)];
                case 3:
                    downloadURL = _a.sent();
                    console.log('Archivo subido exitosamente:', downloadURL);
                    return [2 /*return*/, downloadURL];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error al subir archivo:', error_1);
                    throw error_1;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.uploadFileToStorage = uploadFileToStorage;
// Reemplaza completamente la función deleteFileFromStorage
function deleteFileFromStorage(fileUrl) {
    return __awaiter(this, void 0, Promise, function () {
        var segments, pathWithQuery, path, decodedPath, fileRef, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Si la URL no parece válida (no es una URL de Firebase Storage), ignorarla
                    if (!fileUrl || typeof fileUrl !== 'string' || fileUrl.includes('example.com')) {
                        console.log('URL inválida o de prueba detectada, ignorando:', fileUrl);
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // Solo proceder si es una URL de Firebase Storage
                    if (!fileUrl.includes('firebasestorage.googleapis.com')) {
                        console.log('URL no es de Firebase Storage, ignorando:', fileUrl);
                        return [2 /*return*/];
                    }
                    segments = fileUrl.split('/o/');
                    if (segments.length < 2) {
                        console.log('Formato de URL no reconocido, ignorando:', fileUrl);
                        return [2 /*return*/];
                    }
                    pathWithQuery = segments[1];
                    path = pathWithQuery.split('?')[0];
                    if (!path) {
                        console.log('No se pudo extraer la ruta del archivo, ignorando:', fileUrl);
                        return [2 /*return*/];
                    }
                    decodedPath = decodeURIComponent(path);
                    console.log('Intentando eliminar archivo con path:', decodedPath);
                    fileRef = storage_1.ref(exports.storage, decodedPath);
                    return [4 /*yield*/, storage_1.deleteObject(fileRef)];
                case 2:
                    _a.sent();
                    console.log('Archivo eliminado de Storage:', decodedPath);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    // Capturar cualquier error pero no propagarlo
                    console.error('Error en deleteFileFromStorage (ignorado):', error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.deleteFileFromStorage = deleteFileFromStorage;
// Candidates
function createOrUpdateCandidate(data) {
    return __awaiter(this, void 0, Promise, function () {
        var candidatesRef, q, snapshot, candidateData, docRef_1, docRef, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    console.log('Procesando candidato:', data.email);
                    candidatesRef = firestore_1.collection(exports.db, 'candidates');
                    q = firestore_1.query(candidatesRef, firestore_1.where('email', '==', data.email));
                    return [4 /*yield*/, firestore_1.getDocs(q)];
                case 1:
                    snapshot = _a.sent();
                    candidateData = __assign(__assign({}, sanitize(data)), { updatedAt: firestore_1.Timestamp.now() });
                    if (!!snapshot.empty) return [3 /*break*/, 3];
                    docRef_1 = snapshot.docs[0].ref;
                    return [4 /*yield*/, firestore_1.setDoc(docRef_1, candidateData, { merge: true })];
                case 2:
                    _a.sent();
                    console.log('Candidato actualizado:', docRef_1.id);
                    return [2 /*return*/, docRef_1.id];
                case 3: return [4 /*yield*/, firestore_1.addDoc(candidatesRef, __assign(__assign({}, candidateData), { createdAt: firestore_1.Timestamp.now() }))];
                case 4:
                    docRef = _a.sent();
                    console.log('Nuevo candidato creado:', docRef.id);
                    return [2 /*return*/, docRef.id];
                case 5:
                    error_3 = _a.sent();
                    console.error('Error en createOrUpdateCandidate:', error_3);
                    throw error_3;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.createOrUpdateCandidate = createOrUpdateCandidate;
function deleteCandidate(candidateId) {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, deleteDocument('candidates', candidateId)];
        });
    });
}
exports.deleteCandidate = deleteCandidate;
// Generic document operations
function deleteDocument(collectionName, docId) {
    return __awaiter(this, void 0, Promise, function () {
        var docRef, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!collectionName || !docId) {
                        throw new Error('Nombre de colección o ID inválido');
                    }
                    docRef = firestore_1.doc(exports.db, collectionName, docId);
                    return [4 /*yield*/, firestore_1.deleteDoc(docRef)];
                case 1:
                    _a.sent();
                    console.log("\uD83D\uDDD1\uFE0F Documento eliminado de " + collectionName + " con ID: " + docId);
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error("\u274C Error al eliminar documento de " + collectionName + " con ID " + docId + ":", error_4);
                    throw error_4;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.deleteDocument = deleteDocument;
// También reemplaza la función deleteCV
function deleteCV(id) {
    return __awaiter(this, void 0, Promise, function () {
        var cvDoc, cv, fileError_1, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, firestore_1.getDoc(firestore_1.doc(exports.db, 'cvs', id))];
                case 1:
                    cvDoc = _a.sent();
                    if (!cvDoc.exists()) {
                        console.log("CV con ID " + id + " no encontrado, continuando con la operaci\u00F3n");
                        return [2 /*return*/];
                    }
                    cv = cvDoc.data();
                    if (!cv.fileUrl) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    console.log("Intentando eliminar archivo para CV " + id + ":", cv.fileUrl);
                    return [4 /*yield*/, deleteFileFromStorage(cv.fileUrl)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    fileError_1 = _a.sent();
                    console.error("Error al eliminar archivo (ignorado) para CV " + id + ":", fileError_1);
                    return [3 /*break*/, 5];
                case 5:
                    // Eliminar documento
                    console.log("Eliminando documento de CV con ID: " + id);
                    return [4 /*yield*/, deleteDocument('cvs', id)];
                case 6:
                    _a.sent();
                    console.log("CV eliminado con \u00E9xito: " + id);
                    return [3 /*break*/, 8];
                case 7:
                    error_5 = _a.sent();
                    console.error('Error en deleteCV:', error_5);
                    throw error_5;
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.deleteCV = deleteCV;
// Job Positions
function createJobPosition(data) {
    return __awaiter(this, void 0, Promise, function () {
        var cleanData, docRef, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    cleanData = __assign(__assign({}, sanitize(data)), { requirements: sanitize(data.requirements), createdAt: firestore_1.Timestamp.now() });
                    console.log('Guardando puesto:', cleanData);
                    return [4 /*yield*/, firestore_1.addDoc(firestore_1.collection(exports.db, 'jobPositions'), cleanData)];
                case 1:
                    docRef = _a.sent();
                    console.log('Puesto creado con éxito:', docRef.id);
                    return [2 /*return*/, docRef.id];
                case 2:
                    error_6 = _a.sent();
                    console.error('Error al crear el puesto:', error_6);
                    throw error_6;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.createJobPosition = createJobPosition;
function getJobPositions() {
    return __awaiter(this, void 0, Promise, function () {
        var jobsCollection, q, snapshot, positions, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    jobsCollection = firestore_1.collection(exports.db, 'jobPositions');
                    q = firestore_1.query(jobsCollection, firestore_1.orderBy('createdAt', 'desc'));
                    return [4 /*yield*/, firestore_1.getDocs(q)];
                case 1:
                    snapshot = _a.sent();
                    positions = snapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                    console.log('Puestos encontrados:', positions.length);
                    return [2 /*return*/, positions];
                case 2:
                    error_7 = _a.sent();
                    console.error('Error al obtener los puestos:', error_7);
                    throw error_7;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getJobPositions = getJobPositions;
function updateJobPosition(id, data) {
    return __awaiter(this, void 0, Promise, function () {
        var docRef, updateData, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    docRef = firestore_1.doc(exports.db, 'jobPositions', id);
                    updateData = __assign(__assign({}, sanitize(data)), { updatedAt: firestore_1.Timestamp.now() });
                    return [4 /*yield*/, firestore_1.setDoc(docRef, updateData, { merge: true })];
                case 1:
                    _a.sent();
                    console.log('Puesto actualizado con éxito:', id);
                    return [3 /*break*/, 3];
                case 2:
                    error_8 = _a.sent();
                    console.error('Error al actualizar el puesto:', error_8);
                    throw error_8;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.updateJobPosition = updateJobPosition;
function deleteJobPosition(id) {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, deleteDocument('jobPositions', id)];
        });
    });
}
exports.deleteJobPosition = deleteJobPosition;
// CVs
function createCV(data) {
    return __awaiter(this, void 0, Promise, function () {
        var cleanData, docRef, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    cleanData = __assign(__assign({}, sanitize(data)), { createdAt: firestore_1.Timestamp.now() });
                    return [4 /*yield*/, firestore_1.addDoc(firestore_1.collection(exports.db, 'cvs'), cleanData)];
                case 1:
                    docRef = _a.sent();
                    console.log('CV creado:', docRef.id);
                    return [2 /*return*/, docRef.id];
                case 2:
                    error_9 = _a.sent();
                    console.error('Error al crear CV:', error_9);
                    throw error_9;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.createCV = createCV;
function getCVs() {
    return __awaiter(this, void 0, Promise, function () {
        var cvsCollection, q, snapshot, cvs, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    cvsCollection = firestore_1.collection(exports.db, 'cvs');
                    q = firestore_1.query(cvsCollection, firestore_1.orderBy('createdAt', 'desc'));
                    return [4 /*yield*/, firestore_1.getDocs(q)];
                case 1:
                    snapshot = _a.sent();
                    cvs = snapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                    console.log('CVs encontrados:', cvs.length);
                    return [2 /*return*/, cvs];
                case 2:
                    error_10 = _a.sent();
                    console.error('Error al obtener CVs:', error_10);
                    throw error_10;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getCVs = getCVs;
function getCompleteCV(cvId) {
    return __awaiter(this, void 0, void 0, function () {
        var cvDoc, cv, candidateDoc, error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, firestore_1.getDoc(firestore_1.doc(exports.db, 'cvs', cvId))];
                case 1:
                    cvDoc = _a.sent();
                    if (!cvDoc.exists())
                        throw new Error('CV no encontrado');
                    cv = __assign({ id: cvDoc.id }, cvDoc.data());
                    return [4 /*yield*/, firestore_1.getDoc(firestore_1.doc(exports.db, 'candidates', cv.candidateId))];
                case 2:
                    candidateDoc = _a.sent();
                    console.log('CV completo cargado');
                    return [2 /*return*/, __assign(__assign({}, cv), { candidate: __assign({ id: candidateDoc.id }, candidateDoc.data()) })];
                case 3:
                    error_11 = _a.sent();
                    console.error('Error en getCompleteCV:', error_11);
                    throw error_11;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getCompleteCV = getCompleteCV;
// Connection check
function checkFirestoreConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var testRef, docSnap, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    console.log('Verificando conexión a Firestore...');
                    testRef = firestore_1.doc(exports.db, 'test_connection', 'test_doc');
                    return [4 /*yield*/, firestore_1.setDoc(testRef, {
                            timestamp: firestore_1.Timestamp.now(),
                            message: 'Test de conexión exitoso'
                        })];
                case 1:
                    _a.sent();
                    console.log('✓ Escritura en Firestore exitosa');
                    return [4 /*yield*/, firestore_1.getDoc(testRef)];
                case 2:
                    docSnap = _a.sent();
                    if (!docSnap.exists()) return [3 /*break*/, 4];
                    console.log('✓ Lectura en Firestore exitosa:', docSnap.data());
                    // Limpiar el documento de prueba
                    return [4 /*yield*/, firestore_1.deleteDoc(testRef)];
                case 3:
                    // Limpiar el documento de prueba
                    _a.sent();
                    console.log('✓ Limpieza de documento de prueba completada');
                    return [2 /*return*/, true];
                case 4: throw new Error('No se pudo leer el documento de prueba');
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_12 = _a.sent();
                    console.error('❌ Error al verificar la conexión a Firestore:', error_12);
                    throw error_12;
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.checkFirestoreConnection = checkFirestoreConnection;
