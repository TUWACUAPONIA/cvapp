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
exports.getCompleteCV = exports.deleteCV = exports.getCVs = exports.createCV = void 0;
var firestore_1 = require("firebase/firestore");
var firebase_1 = require("./firebase");
// Collection name constant
var COLLECTION = 'cvs';
function sanitize(obj) {
    return Object.fromEntries(Object.entries(obj).filter(function (_a) {
        var _ = _a[0], value = _a[1];
        return value !== undefined;
    }));
}
function createCV(data) {
    return __awaiter(this, void 0, Promise, function () {
        var cleanData, docRef, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    cleanData = __assign(__assign({}, sanitize(data)), { createdAt: firestore_1.Timestamp.now() });
                    return [4 /*yield*/, firestore_1.addDoc(firestore_1.collection(firebase_1.db, COLLECTION), cleanData)];
                case 1:
                    docRef = _a.sent();
                    console.log('CV creado:', docRef.id);
                    return [2 /*return*/, docRef.id];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error al crear CV:', error_1);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.createCV = createCV;
function getCVs() {
    return __awaiter(this, void 0, Promise, function () {
        var cvsCollection, q, snapshot, cvs, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    cvsCollection = firestore_1.collection(firebase_1.db, COLLECTION);
                    q = firestore_1.query(cvsCollection, firestore_1.orderBy('createdAt', 'desc'));
                    return [4 /*yield*/, firestore_1.getDocs(q)];
                case 1:
                    snapshot = _a.sent();
                    cvs = snapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                    console.log('CVs encontrados:', cvs.length);
                    return [2 /*return*/, cvs];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error al obtener CVs:', error_2);
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getCVs = getCVs;
function deleteCV(id) {
    return __awaiter(this, void 0, Promise, function () {
        var docRef, cvDoc, cv, error_3, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    docRef = firestore_1.doc(firebase_1.db, COLLECTION, id);
                    return [4 /*yield*/, firestore_1.getDoc(docRef)];
                case 1:
                    cvDoc = _a.sent();
                    if (!cvDoc.exists()) {
                        throw new Error('CV no encontrado');
                    }
                    cv = cvDoc.data();
                    if (!cv.fileUrl) return [3 /*break*/, 5];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, firebase_1.deleteFileFromStorage(cv.fileUrl)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    console.error('Error al eliminar archivo:', error_3);
                    return [3 /*break*/, 5];
                case 5: 
                // Delete document from Firestore
                return [4 /*yield*/, firestore_1.deleteDoc(docRef)];
                case 6:
                    // Delete document from Firestore
                    _a.sent();
                    console.log('CV eliminado con éxito:', id);
                    return [3 /*break*/, 8];
                case 7:
                    error_4 = _a.sent();
                    console.error('Error al eliminar CV:', error_4);
                    throw error_4;
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.deleteCV = deleteCV;
function getCompleteCV(cvId) {
    return __awaiter(this, void 0, void 0, function () {
        var cvDoc, cv, candidateDoc, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, firestore_1.getDoc(firestore_1.doc(firebase_1.db, COLLECTION, cvId))];
                case 1:
                    cvDoc = _a.sent();
                    if (!cvDoc.exists())
                        throw new Error('CV no encontrado');
                    cv = __assign({ id: cvDoc.id }, cvDoc.data());
                    return [4 /*yield*/, firestore_1.getDoc(firestore_1.doc(firebase_1.db, 'candidates', cv.candidateId))];
                case 2:
                    candidateDoc = _a.sent();
                    console.log('CV completo cargado');
                    return [2 /*return*/, __assign(__assign({}, cv), { candidate: __assign({ id: candidateDoc.id }, candidateDoc.data()) })];
                case 3:
                    error_5 = _a.sent();
                    console.error('Error en getCompleteCV:', error_5);
                    throw error_5;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getCompleteCV = getCompleteCV;
