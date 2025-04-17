"use strict";
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
exports.deleteFileFromStorage = exports.uploadFileToStorage = void 0;
var app_1 = require("firebase-admin/app");
var storage_1 = require("firebase-admin/storage");
// --- Configuración del Admin SDK ---
// Asegúrate de que esta inicialización se ejecute solo una vez.
// Puedes mover esto a un archivo centralizado como 'firebase-admin-core.ts'
// y exportar la app o el storage inicializado.
// Intenta obtener las credenciales desde variables de entorno (recomendado para Vercel)
// o desde un archivo local (menos seguro para producción).
var serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './lectura-de-cvs-c6fbf04eb10f.json'; // Ajusta la ruta si es necesario
try {
    if (!app_1.getApps().length) {
        app_1.initializeApp({
            credential: app_1.cert(serviceAccountPath),
            // Asegúrate de que el nombre del bucket sea correcto.
            // Puedes obtenerlo de tu consola de Firebase.
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'appcv-e62ed.appspot.com'
        });
        console.log('Firebase Admin SDK inicializado.');
    }
}
catch (error) {
    console.error("Error inicializando Firebase Admin SDK:", error);
    // Considera lanzar el error o manejarlo según tu lógica de aplicación
}
// --- Funciones de Storage con Admin SDK ---
var getAdminBucket = function () {
    // Obtiene el bucket por defecto configurado en initializeApp
    return storage_1.getStorage().bucket();
};
function uploadFileToStorage(file, folder) {
    return __awaiter(this, void 0, Promise, function () {
        var bucket, timestamp, safeFilename, uniqueFilename, filePath, fileUpload, buffer, _a, _b, signedUrl, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    bucket = getAdminBucket();
                    timestamp = Date.now();
                    safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                    uniqueFilename = timestamp + "-" + safeFilename;
                    filePath = folder + "/" + uniqueFilename;
                    fileUpload = bucket.file(filePath);
                    console.log('Subiendo archivo (Admin SDK):', filePath);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 5, , 6]);
                    _b = (_a = Buffer).from;
                    return [4 /*yield*/, file.arrayBuffer()];
                case 2:
                    buffer = _b.apply(_a, [_c.sent()]);
                    return [4 /*yield*/, fileUpload.save(buffer, {
                            metadata: {
                                contentType: file.type
                            }
                        })];
                case 3:
                    _c.sent();
                    console.log('Archivo subido exitosamente (Admin SDK):', filePath);
                    return [4 /*yield*/, fileUpload.getSignedUrl({
                            action: 'read',
                            expires: Date.now() + 60 * 60 * 1000
                        })];
                case 4:
                    signedUrl = (_c.sent())[0];
                    // Alternativa: Si hiciste el archivo público (public: true arriba)
                    // const publicUrl = fileUpload.publicUrl();
                    // return publicUrl;
                    console.log('URL firmada generada:', signedUrl);
                    return [2 /*return*/, signedUrl]; // Devuelve la URL firmada
                case 5:
                    error_1 = _c.sent();
                    console.error('Error al subir archivo (Admin SDK):', error_1);
                    // Asegúrate de que el error se propague para que la API lo maneje
                    throw new Error("Error al subir archivo a Firebase Storage: " + (error_1 instanceof Error ? error_1.message : String(error_1)));
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.uploadFileToStorage = uploadFileToStorage;
function deleteFileFromStorage(fileUrl) {
    return __awaiter(this, void 0, Promise, function () {
        var decodedPath, url, pathSegments, bucketName_1, pathStartIndex, segments, pathWithQuery, path, bucket, file, exists, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Extraer la ruta del archivo de la URL (puede necesitar ajustes si usas URLs firmadas)
                    // Esta lógica asume URLs públicas o un formato predecible.
                    // Si usas URLs firmadas consistentemente, puede que no necesites eliminar por URL,
                    // sino por la ruta del archivo que deberías guardar en tu base de datos.
                    if (!fileUrl || typeof fileUrl !== 'string') {
                        console.warn('URL inválida para eliminar:', fileUrl);
                        return [2 /*return*/];
                    }
                    decodedPath = '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    url = new URL(fileUrl);
                    pathSegments = url.pathname.split('/');
                    bucketName_1 = getAdminBucket().name;
                    pathStartIndex = pathSegments.findIndex(function (segment) { return segment && segment !== bucketName_1; });
                    if (pathStartIndex > -1) {
                        decodedPath = decodeURIComponent(pathSegments.slice(pathStartIndex).join('/'));
                    }
                    // Fallback para formato /o/ (común en URLs de Firebase Storage)
                    if (!decodedPath && fileUrl.includes('/o/')) {
                        segments = fileUrl.split('/o/');
                        if (segments.length >= 2) {
                            pathWithQuery = segments[1];
                            path = pathWithQuery.split('?')[0];
                            if (path) {
                                decodedPath = decodeURIComponent(path);
                            }
                        }
                    }
                    if (!decodedPath) {
                        console.warn('No se pudo extraer la ruta del archivo de la URL para eliminar:', fileUrl);
                        return [2 /*return*/];
                    }
                    console.log('Intentando eliminar archivo (Admin SDK) con path:', decodedPath);
                    bucket = getAdminBucket();
                    file = bucket.file(decodedPath);
                    return [4 /*yield*/, file.exists()];
                case 2:
                    exists = (_a.sent())[0];
                    if (!exists) return [3 /*break*/, 4];
                    return [4 /*yield*/, file["delete"]()];
                case 3:
                    _a.sent();
                    console.log('Archivo eliminado de Storage (Admin SDK):', decodedPath);
                    return [3 /*break*/, 5];
                case 4:
                    console.log('El archivo no existe en Storage, no se necesita eliminar:', decodedPath);
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    // Capturar errores específicos de la URL o de la eliminación
                    console.error("Error en deleteFileFromStorage (Admin SDK) para path \"" + decodedPath + "\" (ignorado):", error_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.deleteFileFromStorage = deleteFileFromStorage;
