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
exports.deleteAdminCV = exports.getAdminCompleteCV = exports.getAdminJobPositions = exports.createAdminCV = exports.createOrUpdateAdminCandidate = exports.sanitizeAdminData = exports.AdminTimestamp = exports.adminStorage = exports.adminDb = exports.adminApp = void 0;
var app_1 = require("firebase-admin/app");
var firestore_1 = require("firebase-admin/firestore"); // Usa AdminTimestamp
exports.AdminTimestamp = firestore_1.Timestamp;
var storage_1 = require("firebase-admin/storage");
// --- Configuración del Admin SDK ---
var serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './lectura-de-cvs-c6fbf04eb10f.json'; // Ajusta la ruta si es necesario
var storageBucketName = process.env.FIREBASE_STORAGE_BUCKET || 'appcv-e62ed.appspot.com'; // Asegúrate que sea correcto
var adminApp;
exports.adminApp = adminApp;
var adminDb;
exports.adminDb = adminDb;
var adminStorage;
exports.adminStorage = adminStorage;
var credentialInput = null; // Declarar fuera y inicializar
try {
    var credentialsEnvVar = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (credentialsEnvVar) {
        try {
            // Intenta parsear como JSON (común en Vercel/producción)
            credentialInput = JSON.parse(credentialsEnvVar);
            console.log('Usando credenciales de Firebase desde variable de entorno (JSON parseado).');
        }
        catch (e) {
            // Si falla el parseo, asume que es una ruta de archivo (desarrollo local)
            credentialInput = credentialsEnvVar;
            console.log('Usando credenciales de Firebase desde variable de entorno (ruta de archivo).');
        }
    }
    else {
        // Fallback a la ruta local si la variable de entorno no está definida
        credentialInput = serviceAccountPath; // Usa la ruta definida anteriormente
        console.log('Usando credenciales de Firebase desde ruta de archivo local.');
    }
    // Asegurarse de que credentialInput no sea null antes de usarlo
    if (!credentialInput) {
        throw new Error("No se pudieron determinar las credenciales de Firebase.");
    }
    if (!app_1.getApps().length) {
        exports.adminApp = adminApp = app_1.initializeApp({
            credential: app_1.cert(credentialInput),
            storageBucket: storageBucketName
        });
        console.log('Firebase Admin SDK inicializado.');
    }
    else {
        exports.adminApp = adminApp = app_1.getApps()[0]; // Obtener la instancia existente si ya fue inicializada
        console.log('Firebase Admin SDK ya estaba inicializado.');
    }
    exports.adminDb = adminDb = firestore_1.getFirestore(adminApp);
    exports.adminStorage = adminStorage = storage_1.getStorage(adminApp);
}
catch (error) {
    // Añadir más contexto al error
    var credentialType = typeof credentialInput === 'string' ? 'ruta' : 'objeto JSON';
    console.error("Error inicializando Firebase Admin SDK (usando " + credentialType + "):", error);
    // Considera lanzar el error o manejarlo según tu lógica de aplicación
    throw new Error("Error inicializando Firebase Admin SDK: " + (error instanceof Error ? error.message : String(error)));
}
// --- Funciones de Base de Datos (Admin SDK) ---
// Helper para sanitizar datos antes de guardar (eliminar undefined)
function sanitizeAdminData(obj) {
    return Object.fromEntries(Object.entries(obj).filter(function (_a) {
        var _ = _a[0], value = _a[1];
        return value !== undefined;
    }));
}
exports.sanitizeAdminData = sanitizeAdminData;
// Candidates (Admin SDK version)
function createOrUpdateAdminCandidate(data) {
    return __awaiter(this, void 0, Promise, function () {
        var candidatesRef, snapshot, candidateData, existingDocRef, docRef, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    console.log('[Admin] Procesando candidato:', data.email);
                    candidatesRef = adminDb.collection('candidates');
                    return [4 /*yield*/, candidatesRef.where('email', '==', data.email).get()];
                case 1:
                    snapshot = _a.sent();
                    candidateData = __assign(__assign({}, sanitizeAdminData(data)), { updatedAt: firestore_1.Timestamp.now() // Usar AdminTimestamp
                     });
                    // Eliminar id del objeto si existe, Firestore lo maneja
                    delete candidateData.id;
                    if (!!snapshot.empty) return [3 /*break*/, 3];
                    existingDocRef = snapshot.docs[0].ref;
                    return [4 /*yield*/, existingDocRef.set(candidateData, { merge: true })];
                case 2:
                    _a.sent();
                    console.log('[Admin] Candidato actualizado:', existingDocRef.id);
                    return [2 /*return*/, existingDocRef.id];
                case 3: return [4 /*yield*/, candidatesRef.add(__assign(__assign({}, candidateData), { createdAt: firestore_1.Timestamp.now() // Añadir createdAt en la creación
                     }))];
                case 4:
                    docRef = _a.sent();
                    console.log('[Admin] Nuevo candidato creado:', docRef.id);
                    return [2 /*return*/, docRef.id];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error('[Admin] Error en createOrUpdateAdminCandidate:', error_1);
                    throw new Error("Error al guardar candidato: " + (error_1 instanceof Error ? error_1.message : String(error_1)));
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.createOrUpdateAdminCandidate = createOrUpdateAdminCandidate;
// CVs (Admin SDK version)
function createAdminCV(data) {
    return __awaiter(this, void 0, Promise, function () {
        var cleanData, docRef, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    cleanData = __assign(__assign({}, sanitizeAdminData(data)), { createdAt: data.createdAt || firestore_1.Timestamp.now() });
                    return [4 /*yield*/, adminDb.collection('cvs').add(cleanData)];
                case 1:
                    docRef = _a.sent();
                    console.log('[Admin] CV creado:', docRef.id);
                    return [2 /*return*/, docRef.id];
                case 2:
                    error_2 = _a.sent();
                    console.error('[Admin] Error al crear CV:', error_2);
                    throw new Error("Error al guardar CV: " + (error_2 instanceof Error ? error_2.message : String(error_2)));
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.createAdminCV = createAdminCV;
// Job Positions
function getAdminJobPositions() {
    return __awaiter(this, void 0, Promise, function () {
        var snapshot, positions, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.group('[Admin] 📋 Obteniendo puestos de trabajo');
                    return [4 /*yield*/, adminDb.collection('jobPositions').get()];
                case 1:
                    snapshot = _a.sent();
                    if (snapshot.empty) {
                        console.log('⚠️ No se encontraron puestos de trabajo');
                        console.groupEnd();
                        return [2 /*return*/, []];
                    }
                    positions = snapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                    console.log('✅ Puestos recuperados:', positions.length);
                    console.groupEnd();
                    return [2 /*return*/, positions];
                case 2:
                    error_3 = _a.sent();
                    console.error('[Admin] ❌ Error al obtener puestos:', error_3);
                    throw new Error("Error al obtener puestos de trabajo: " + (error_3 instanceof Error ? error_3.message : String(error_3)));
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getAdminJobPositions = getAdminJobPositions;
// Get Complete CV with Candidate Info
function getAdminCompleteCV(cvId) {
    return __awaiter(this, void 0, void 0, function () {
        var cvDoc, cvData, candidateDoc, candidateData, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.group('[Admin] 📄 Obteniendo CV completo');
                    console.log('🔍 Buscando CV:', cvId);
                    return [4 /*yield*/, adminDb.collection('cvs').doc(cvId).get()];
                case 1:
                    cvDoc = _a.sent();
                    if (!cvDoc.exists) {
                        console.warn('⚠️ CV no encontrado');
                        console.groupEnd();
                        throw new Error('CV no encontrado');
                    }
                    cvData = cvDoc.data();
                    // Obtener datos del candidato
                    console.log('👤 Buscando candidato:', cvData.candidateId);
                    return [4 /*yield*/, adminDb.collection('candidates').doc(cvData.candidateId).get()];
                case 2:
                    candidateDoc = _a.sent();
                    if (!candidateDoc.exists) {
                        console.warn('⚠️ Candidato no encontrado');
                        console.groupEnd();
                        throw new Error('Candidato asociado no encontrado');
                    }
                    candidateData = candidateDoc.data();
                    console.log('✅ CV y candidato recuperados exitosamente');
                    console.groupEnd();
                    return [2 /*return*/, {
                            cv: __assign({ id: cvId }, cvData),
                            candidate: __assign({ id: candidateDoc.id }, candidateData)
                        }];
                case 3:
                    error_4 = _a.sent();
                    console.error('[Admin] ❌ Error al obtener CV completo:', error_4);
                    throw new Error("Error al obtener CV completo: " + (error_4 instanceof Error ? error_4.message : String(error_4)));
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getAdminCompleteCV = getAdminCompleteCV;
// Delete CV and associated file
function deleteAdminCV(cvId) {
    return __awaiter(this, void 0, Promise, function () {
        var cvDoc, cvData, fileRef, storageError_1, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    console.group('[Admin] 🗑️ Eliminando CV');
                    console.log('🔍 Buscando CV:', cvId);
                    return [4 /*yield*/, adminDb.collection('cvs').doc(cvId).get()];
                case 1:
                    cvDoc = _a.sent();
                    if (!cvDoc.exists) {
                        console.warn('⚠️ CV no encontrado');
                        console.groupEnd();
                        throw new Error('CV no encontrado');
                    }
                    cvData = cvDoc.data();
                    if (!cvData.fileUrl) return [3 /*break*/, 5];
                    console.log('🗑️ Eliminando archivo:', cvData.fileUrl);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    fileRef = adminStorage.bucket().file(cvData.fileUrl);
                    return [4 /*yield*/, fileRef["delete"]()];
                case 3:
                    _a.sent();
                    console.log('✅ Archivo eliminado de Storage');
                    return [3 /*break*/, 5];
                case 4:
                    storageError_1 = _a.sent();
                    console.error('⚠️ Error al eliminar archivo:', storageError_1);
                    return [3 /*break*/, 5];
                case 5: 
                // Eliminar el documento de Firestore
                return [4 /*yield*/, adminDb.collection('cvs').doc(cvId)["delete"]()];
                case 6:
                    // Eliminar el documento de Firestore
                    _a.sent();
                    console.log('✅ Documento eliminado de Firestore');
                    console.groupEnd();
                    return [3 /*break*/, 8];
                case 7:
                    error_5 = _a.sent();
                    console.error('[Admin] ❌ Error al eliminar CV:', error_5);
                    throw new Error("Error al eliminar CV: " + (error_5 instanceof Error ? error_5.message : String(error_5)));
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.deleteAdminCV = deleteAdminCV;
