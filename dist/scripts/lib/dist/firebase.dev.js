"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCompleteCV = exports.getJobPositions = exports.createJobPosition = exports.getCVs = exports.deleteCV = exports.createCV = exports.deleteCandidate = exports.createOrUpdateCandidate = exports.deleteFileFromStorage = exports.uploadFileToStorage = exports.checkFirestoreConnection = exports.db = exports.storage = exports.firebaseConfig = void 0; // firebase.ts

var app_1 = require("firebase/app");

var storage_1 = require("firebase/storage");

var firestore_1 = require("firebase/firestore"); // Firebase configuration


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
} // Inicialización segura de Firebase


var app;

try {
  app = (0, app_1.getApp)();
  console.log('Firebase ya estaba inicializado.');
} catch (e) {
  app = (0, app_1.initializeApp)(exports.firebaseConfig);
  console.log('Firebase inicializado correctamente.');
} // Inicializar servicios


exports.storage = (0, storage_1.getStorage)(app);
exports.db = (0, firestore_1.initializeFirestore)(app, {
  experimentalForceLongPolling: true
}); // Función para verificar la conexión a Firestore

function checkFirestoreConnection() {
  var testRef, docSnap;
  return regeneratorRuntime.async(function checkFirestoreConnection$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log('Verificando conexión a Firestore...'); // Intentar escribir un documento de prueba

          testRef = (0, firestore_1.doc)(exports.db, 'test_connection', 'test_doc');
          _context.next = 5;
          return regeneratorRuntime.awrap((0, firestore_1.setDoc)(testRef, {
            timestamp: firestore_1.Timestamp.now(),
            message: 'Test de conexión exitoso'
          }));

        case 5:
          console.log('✓ Escritura en Firestore exitosa'); // Intentar leer el documento

          _context.next = 8;
          return regeneratorRuntime.awrap((0, firestore_1.getDoc)(testRef));

        case 8:
          docSnap = _context.sent;

          if (!docSnap.exists()) {
            _context.next = 17;
            break;
          }

          console.log('✓ Lectura en Firestore exitosa:', docSnap.data()); // Limpiar el documento de prueba

          _context.next = 13;
          return regeneratorRuntime.awrap((0, firestore_1.deleteDoc)(testRef));

        case 13:
          console.log('✓ Limpieza de documento de prueba completada');
          return _context.abrupt("return", true);

        case 17:
          throw new Error('No se pudo leer el documento de prueba');

        case 18:
          _context.next = 24;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](0);
          console.error('❌ Error al verificar la conexión a Firestore:', _context.t0);
          throw _context.t0;

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 20]]);
}

exports.checkFirestoreConnection = checkFirestoreConnection; // Verificar la configuración inicial

console.log('Configuración de Firebase:', {
  projectId: exports.firebaseConfig.projectId,
  storageBucket: exports.firebaseConfig.storageBucket,
  authDomain: exports.firebaseConfig.authDomain
});

function sanitize(obj) {
  return Object.fromEntries(Object.entries(obj).filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        _ = _ref2[0],
        value = _ref2[1];

    return value !== undefined;
  }));
} // Storage


function uploadFileToStorage(file, folder) {
  var timestamp, safeFilename, uniqueFilename, filePath, storageRef, buffer, blob, snapshot, downloadURL;
  return regeneratorRuntime.async(function uploadFileToStorage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          timestamp = Date.now();
          safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          uniqueFilename = "".concat(timestamp, "-").concat(safeFilename);
          filePath = "".concat(folder, "/").concat(uniqueFilename);
          storageRef = (0, storage_1.ref)(exports.storage, filePath);
          console.log('Subiendo archivo:', filePath);
          _context2.next = 9;
          return regeneratorRuntime.awrap(file.arrayBuffer());

        case 9:
          buffer = _context2.sent;
          blob = new Blob([buffer], {
            type: file.type
          });
          _context2.next = 13;
          return regeneratorRuntime.awrap((0, storage_1.uploadBytes)(storageRef, blob));

        case 13:
          snapshot = _context2.sent;
          _context2.next = 16;
          return regeneratorRuntime.awrap((0, storage_1.getDownloadURL)(snapshot.ref));

        case 16:
          downloadURL = _context2.sent;
          console.log('Archivo subido exitosamente:', downloadURL);
          return _context2.abrupt("return", downloadURL);

        case 21:
          _context2.prev = 21;
          _context2.t0 = _context2["catch"](0);
          console.error('Error al subir archivo:', _context2.t0);
          throw _context2.t0;

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 21]]);
}

exports.uploadFileToStorage = uploadFileToStorage;

function deleteFileFromStorage(fileUrl) {
  var fileRef;
  return regeneratorRuntime.async(function deleteFileFromStorage$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          fileRef = (0, storage_1.ref)(exports.storage, fileUrl);
          _context3.next = 4;
          return regeneratorRuntime.awrap((0, storage_1.deleteObject)(fileRef));

        case 4:
          console.log('Archivo eliminado de Storage:', fileUrl);
          _context3.next = 11;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.error('Error al eliminar archivo:', _context3.t0);
          throw _context3.t0;

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
}

exports.deleteFileFromStorage = deleteFileFromStorage; // Candidates

function createOrUpdateCandidate(data) {
  var candidatesRef, q, snapshot, candidateData, _docRef, docRef;

  return regeneratorRuntime.async(function createOrUpdateCandidate$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          console.log('Procesando candidato:', data.email);
          candidatesRef = (0, firestore_1.collection)(exports.db, 'candidates');
          q = (0, firestore_1.query)(candidatesRef, (0, firestore_1.where)('email', '==', data.email));
          _context4.next = 6;
          return regeneratorRuntime.awrap((0, firestore_1.getDocs)(q));

        case 6:
          snapshot = _context4.sent;
          candidateData = Object.assign(Object.assign({}, sanitize(data)), {
            updatedAt: firestore_1.Timestamp.now()
          });

          if (snapshot.empty) {
            _context4.next = 14;
            break;
          }

          _docRef = snapshot.docs[0].ref;
          _context4.next = 12;
          return regeneratorRuntime.awrap((0, firestore_1.setDoc)(_docRef, candidateData, {
            merge: true
          }));

        case 12:
          console.log('Candidato actualizado:', _docRef.id);
          return _context4.abrupt("return", _docRef.id);

        case 14:
          _context4.next = 16;
          return regeneratorRuntime.awrap((0, firestore_1.addDoc)(candidatesRef, Object.assign(Object.assign({}, candidateData), {
            createdAt: firestore_1.Timestamp.now()
          })));

        case 16:
          docRef = _context4.sent;
          console.log('Nuevo candidato creado:', docRef.id);
          return _context4.abrupt("return", docRef.id);

        case 21:
          _context4.prev = 21;
          _context4.t0 = _context4["catch"](0);
          console.error('Error en createOrUpdateCandidate:', _context4.t0);
          throw _context4.t0;

        case 25:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 21]]);
}

exports.createOrUpdateCandidate = createOrUpdateCandidate;

function deleteCandidate(candidateId) {
  return regeneratorRuntime.async(function deleteCandidate$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap((0, firestore_1.deleteDoc)((0, firestore_1.doc)(exports.db, 'candidates', candidateId)));

        case 3:
          console.log('Candidato eliminado:', candidateId);
          _context5.next = 10;
          break;

        case 6:
          _context5.prev = 6;
          _context5.t0 = _context5["catch"](0);
          console.error('Error al eliminar candidato:', _context5.t0);
          throw _context5.t0;

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 6]]);
}

exports.deleteCandidate = deleteCandidate; // CVs

function createCV(data) {
  var cleanData, docRef;
  return regeneratorRuntime.async(function createCV$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          cleanData = Object.assign(Object.assign({}, sanitize(data)), {
            createdAt: firestore_1.Timestamp.now()
          });
          _context6.next = 4;
          return regeneratorRuntime.awrap((0, firestore_1.addDoc)((0, firestore_1.collection)(exports.db, 'cvs'), cleanData));

        case 4:
          docRef = _context6.sent;
          console.log('CV creado:', docRef.id);
          return _context6.abrupt("return", docRef.id);

        case 9:
          _context6.prev = 9;
          _context6.t0 = _context6["catch"](0);
          console.error('Error al crear CV:', _context6.t0);
          throw _context6.t0;

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 9]]);
}

exports.createCV = createCV;

function deleteCV(cvId) {
  var cvDoc, cv;
  return regeneratorRuntime.async(function deleteCV$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap((0, firestore_1.getDoc)((0, firestore_1.doc)(exports.db, 'cvs', cvId)));

        case 3:
          cvDoc = _context7.sent;

          if (cvDoc.exists()) {
            _context7.next = 6;
            break;
          }

          throw new Error('CV no encontrado');

        case 6:
          cv = cvDoc.data();
          _context7.next = 9;
          return regeneratorRuntime.awrap(deleteFileFromStorage(cv.fileUrl));

        case 9:
          _context7.next = 11;
          return regeneratorRuntime.awrap((0, firestore_1.deleteDoc)((0, firestore_1.doc)(exports.db, 'cvs', cvId)));

        case 11:
          console.log('CV eliminado:', cvId);
          _context7.next = 18;
          break;

        case 14:
          _context7.prev = 14;
          _context7.t0 = _context7["catch"](0);
          console.error('Error al eliminar CV:', _context7.t0);
          throw _context7.t0;

        case 18:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 14]]);
}

exports.deleteCV = deleteCV;

function getCVs() {
  var q, snapshot, cvs;
  return regeneratorRuntime.async(function getCVs$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          q = (0, firestore_1.query)((0, firestore_1.collection)(exports.db, 'cvs'), (0, firestore_1.orderBy)('createdAt', 'desc'));
          _context8.next = 4;
          return regeneratorRuntime.awrap((0, firestore_1.getDocs)(q));

        case 4:
          snapshot = _context8.sent;
          cvs = snapshot.docs.map(function (doc) {
            return Object.assign({
              id: doc.id
            }, doc.data());
          });
          console.log('CVs encontrados:', cvs.length);
          return _context8.abrupt("return", cvs);

        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](0);
          console.error('Error al obtener CVs:', _context8.t0);
          throw _context8.t0;

        case 14:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

exports.getCVs = getCVs; // Job Positions

function createJobPosition(data) {
  var cleanData, docRef;
  return regeneratorRuntime.async(function createJobPosition$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          cleanData = Object.assign(Object.assign({}, sanitize(data)), {
            requirements: sanitize(data.requirements),
            createdAt: firestore_1.Timestamp.now()
          });
          console.log('Guardando puesto:', cleanData);
          _context9.next = 5;
          return regeneratorRuntime.awrap((0, firestore_1.addDoc)((0, firestore_1.collection)(exports.db, 'jobPositions'), cleanData));

        case 5:
          docRef = _context9.sent;
          console.log('Puesto creado:', docRef.id);
          return _context9.abrupt("return", docRef.id);

        case 10:
          _context9.prev = 10;
          _context9.t0 = _context9["catch"](0);
          console.error('Error al crear puesto:', _context9.t0);
          throw _context9.t0;

        case 14:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

exports.createJobPosition = createJobPosition;

function getJobPositions() {
  var q, snapshot, positions;
  return regeneratorRuntime.async(function getJobPositions$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          q = (0, firestore_1.query)((0, firestore_1.collection)(exports.db, 'jobPositions'), (0, firestore_1.orderBy)('createdAt', 'desc'));
          _context10.next = 4;
          return regeneratorRuntime.awrap((0, firestore_1.getDocs)(q));

        case 4:
          snapshot = _context10.sent;
          positions = snapshot.docs.map(function (doc) {
            return Object.assign({
              id: doc.id
            }, doc.data());
          });
          console.log('Puestos encontrados:', positions.length);
          return _context10.abrupt("return", positions);

        case 10:
          _context10.prev = 10;
          _context10.t0 = _context10["catch"](0);
          console.error('Error al obtener puestos:', _context10.t0);
          throw _context10.t0;

        case 14:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

exports.getJobPositions = getJobPositions;

function getCompleteCV(cvId) {
  var cvDoc, cv, candidateDoc;
  return regeneratorRuntime.async(function getCompleteCV$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return regeneratorRuntime.awrap((0, firestore_1.getDoc)((0, firestore_1.doc)(exports.db, 'cvs', cvId)));

        case 3:
          cvDoc = _context11.sent;

          if (cvDoc.exists()) {
            _context11.next = 6;
            break;
          }

          throw new Error('CV no encontrado');

        case 6:
          cv = Object.assign({
            id: cvDoc.id
          }, cvDoc.data());
          _context11.next = 9;
          return regeneratorRuntime.awrap((0, firestore_1.getDoc)((0, firestore_1.doc)(exports.db, 'candidates', cv.candidateId)));

        case 9:
          candidateDoc = _context11.sent;
          console.log('CV completo cargado');
          return _context11.abrupt("return", Object.assign(Object.assign({}, cv), {
            candidate: Object.assign({
              id: candidateDoc.id
            }, candidateDoc.data())
          }));

        case 14:
          _context11.prev = 14;
          _context11.t0 = _context11["catch"](0);
          console.error('Error en getCompleteCV:', _context11.t0);
          throw _context11.t0;

        case 18:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 14]]);
}

exports.getCompleteCV = getCompleteCV;