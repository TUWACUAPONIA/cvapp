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
exports.deleteJobPosition = exports.updateJobPosition = exports.getJobPositions = exports.createJobPosition = void 0;
var firestore_1 = require("firebase/firestore");
var firebase_1 = require("./firebase");
// Collection name constant
var COLLECTION = 'jobPositions';
function sanitize(obj) {
    return Object.fromEntries(Object.entries(obj).filter(function (_a) {
        var _ = _a[0], value = _a[1];
        return value !== undefined;
    }));
}
function createJobPosition(data) {
    return __awaiter(this, void 0, Promise, function () {
        var cleanData, docRef, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    cleanData = __assign(__assign({}, sanitize(data)), { requirements: sanitize(data.requirements), createdAt: firestore_1.Timestamp.now() });
                    console.log('Guardando puesto:', cleanData);
                    return [4 /*yield*/, firestore_1.addDoc(firestore_1.collection(firebase_1.db, 'jobPositions'), cleanData)];
                case 1:
                    docRef = _a.sent();
                    console.log('Puesto creado con éxito:', docRef.id);
                    return [2 /*return*/, docRef.id];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error al crear el puesto:', error_1);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.createJobPosition = createJobPosition;
function getJobPositions() {
    return __awaiter(this, void 0, Promise, function () {
        var jobsCollection, q, snapshot, positions, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    jobsCollection = firestore_1.collection(firebase_1.db, 'jobPositions');
                    q = firestore_1.query(jobsCollection, firestore_1.orderBy('createdAt', 'desc'));
                    return [4 /*yield*/, firestore_1.getDocs(q)];
                case 1:
                    snapshot = _a.sent();
                    positions = snapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); });
                    console.log('Puestos encontrados:', positions.length);
                    return [2 /*return*/, positions];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error al obtener los puestos:', error_2);
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getJobPositions = getJobPositions;
function updateJobPosition(id, data) {
    return __awaiter(this, void 0, Promise, function () {
        var docRef, updateData, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    docRef = firestore_1.doc(firebase_1.db, 'jobPositions', id);
                    updateData = __assign(__assign({}, sanitize(data)), { updatedAt: firestore_1.Timestamp.now() });
                    return [4 /*yield*/, firestore_1.setDoc(docRef, updateData, { merge: true })];
                case 1:
                    _a.sent();
                    console.log('Puesto actualizado con éxito:', id);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error al actualizar el puesto:', error_3);
                    throw error_3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.updateJobPosition = updateJobPosition;
function deleteJobPosition(id) {
    return __awaiter(this, void 0, Promise, function () {
        var docRef, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    docRef = firestore_1.doc(firebase_1.db, 'jobPositions', id);
                    return [4 /*yield*/, firestore_1.deleteDoc(docRef)];
                case 1:
                    _a.sent();
                    console.log('Puesto eliminado con éxito:', id);
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.error('Error al eliminar el puesto:', error_4);
                    throw error_4;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.deleteJobPosition = deleteJobPosition;
