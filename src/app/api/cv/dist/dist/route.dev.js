"use strict";

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

exports.__esModule = true;
exports.DELETE = exports.GET = exports.POST = void 0;

var server_1 = require("next/server");

var mammoth_1 = require("mammoth");

var openai_1 = require("../../../lib/openai");

var pdf_parser_1 = require("../../../lib/pdf-parser");

var firebase_1 = require("../../../lib/firebase"); // Importaciones adicionales para la función DELETE modificada


var app_1 = require("firebase/app");

var firestore_1 = require("firebase/firestore");

var storage_1 = require("firebase/storage"); // Tamaño máximo de archivo (5MB)


var MAX_FILE_SIZE = 5 * 1024 * 1024;

function extractTextFromDOCX(buffer) {
  return __awaiter(this, void 0, Promise, function () {
    var result, error_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2,, 3]);

          return [4
          /*yield*/
          , mammoth_1["default"].extractRawText({
            arrayBuffer: buffer
          })];

        case 1:
          result = _a.sent();
          return [2
          /*return*/
          , pdf_parser_1.normalizeText(result.value)];

        case 2:
          error_1 = _a.sent();
          console.error('Error al procesar DOCX:', error_1);
          throw new Error('Error al procesar archivo DOCX');

        case 3:
          return [2
          /*return*/
          ];
      }
    });
  });
}

function POST(request) {
  return __awaiter(this, void 0, void 0, function () {
    var formData, file, jobPositionId_1, fileInfo, validTypes, buffer, cvText, fileUrl, jobPositions, jobPosition, selectedPosition, analysis, candidateData, candidateId, cvData, cvId, completeCV, error_2, error_3;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 16,, 17]);

          return [4
          /*yield*/
          , request.formData()];

        case 1:
          formData = _a.sent();
          file = formData.get('cv');
          jobPositionId_1 = formData.get('jobPositionId');

          if (!file) {
            return [2
            /*return*/
            , server_1.NextResponse.json({
              success: false,
              error: 'No se ha subido ningún archivo'
            }, {
              status: 400
            })];
          }

          fileInfo = {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: new Date(file.lastModified).toISOString()
          };
          console.log('Procesando CV:', fileInfo); // Validate file size

          if (file.size > MAX_FILE_SIZE) {
            return [2
            /*return*/
            , server_1.NextResponse.json({
              success: false,
              error: 'El archivo es demasiado grande. El tamaño máximo permitido es 5MB.'
            }, {
              status: 400
            })];
          }

          validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
          console.log('Tipo de archivo detectado:', file.type);

          if (!validTypes.includes(file.type)) {
            return [2
            /*return*/
            , server_1.NextResponse.json({
              success: false,
              error: 'Tipo de archivo inválido. Por favor, sube un archivo PDF o DOCX',
              detectedType: file.type
            }, {
              status: 400
            })];
          }

          _a.label = 2;

        case 2:
          _a.trys.push([2, 14,, 15]); // Extract text from file


          console.log('Iniciando extracción de texto...');
          return [4
          /*yield*/
          , file.arrayBuffer()];

        case 3:
          buffer = _a.sent();
          cvText = '';
          if (!(file.type === 'application/pdf')) return [3
          /*break*/
          , 5];
          console.log('Procesando archivo PDF...');
          return [4
          /*yield*/
          , pdf_parser_1.parsePDF(buffer)];

        case 4:
          cvText = _a.sent();
          return [3
          /*break*/
          , 7];

        case 5:
          if (!(file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) return [3
          /*break*/
          , 7];
          console.log('Procesando archivo DOCX...');
          return [4
          /*yield*/
          , extractTextFromDOCX(buffer)];

        case 6:
          cvText = _a.sent();
          _a.label = 7;

        case 7:
          if (!cvText) {
            throw new Error('No se pudo extraer texto del archivo');
          }

          console.log('Extracción de texto exitosa. Caracteres:', cvText.length); // Upload file to Firebase Storage

          console.log('Subiendo archivo a almacenamiento...');
          return [4
          /*yield*/
          , firebase_1.uploadFileToStorage(file, 'cvs')];

        case 8:
          fileUrl = _a.sent();
          console.log('Archivo subido exitosamente:', fileUrl); // Get job positions

          console.log('Obteniendo puestos de trabajo...');
          return [4
          /*yield*/
          , firebase_1.getJobPositions()];

        case 9:
          jobPositions = _a.sent();

          if (jobPositions.length === 0) {
            return [2
            /*return*/
            , server_1.NextResponse.json({
              success: false,
              error: 'No se encontraron puestos de trabajo'
            }, {
              status: 400
            })];
          }

          console.log("Se encontraron " + jobPositions.length + " puestos de trabajo");
          jobPosition = void 0;

          if (jobPositionId_1) {
            selectedPosition = jobPositions.find(function (p) {
              return p.id === jobPositionId_1;
            });

            if (selectedPosition) {
              jobPosition = selectedPosition;
              console.log("Usando puesto seleccionado: " + jobPosition.title);
            } else {
              // Fallback to first position if specified ID not found
              jobPosition = jobPositions[0];
              console.log("Puesto con ID " + jobPositionId_1 + " no encontrado, usando primer puesto: " + jobPosition.title);
            }
          } else {
            // Default to first position
            jobPosition = jobPositions[0];
            console.log("Usando primer puesto para an\xE1lisis: " + jobPosition.title);
          } // Analyze CV against job position


          console.log('Iniciando análisis de CV...');
          return [4
          /*yield*/
          , openai_1.analyzeCVWithGPT(cvText, jobPosition)];

        case 10:
          analysis = _a.sent();
          console.log('Análisis completado'); // Create or update candidate

          console.log('Creando/actualizando registro de candidato...');
          candidateData = {
            name: analysis.name,
            title: analysis.title,
            email: analysis.email,
            phone: analysis.phone,
            location: analysis.location,
            birthDate: analysis.birthDate,
            age: analysis.age,
            experience: analysis.experience,
            skills: analysis.skills,
            summary: analysis.summary
          };
          return [4
          /*yield*/
          , firebase_1.createOrUpdateCandidate(candidateData)];

        case 11:
          candidateId = _a.sent(); // Create CV record

          console.log('Creando registro de CV...');
          cvData = {
            fileName: file.name,
            fileUrl: fileUrl,
            content: cvText,
            candidateId: candidateId
          };
          return [4
          /*yield*/
          , firebase_1.createCV(cvData)];

        case 12:
          cvId = _a.sent();
          return [4
          /*yield*/
          , firebase_1.getCompleteCV(cvId)];

        case 13:
          completeCV = _a.sent();
          return [2
          /*return*/
          , server_1.NextResponse.json({
            success: true,
            message: 'CV procesado exitosamente',
            data: __assign(__assign({}, completeCV), {
              analysis: {
                score: analysis.score,
                feedback: analysis.feedback,
                jobPosition: {
                  id: jobPosition.id,
                  title: jobPosition.title
                }
              }
            })
          })];

        case 14:
          error_2 = _a.sent();
          console.error('Error al procesar archivo:', error_2);
          return [2
          /*return*/
          , server_1.NextResponse.json({
            success: false,
            error: 'Error al procesar archivo',
            details: error_2 instanceof Error ? error_2.message : 'Error desconocido',
            fileInfo: fileInfo
          }, {
            status: 500
          })];

        case 15:
          return [3
          /*break*/
          , 17];

        case 16:
          error_3 = _a.sent();
          console.error('Error al manejar la solicitud:', error_3);
          return [2
          /*return*/
          , server_1.NextResponse.json({
            success: false,
            error: 'Error interno del servidor'
          }, {
            status: 500
          })];

        case 17:
          return [2
          /*return*/
          ];
      }
    });
  });
}

exports.POST = POST;

function GET(request) {
  return __awaiter(this, void 0, void 0, function () {
    var searchParams, page, limit, validPage, validLimit, cvs, totalItems, startIndex, endIndex, paginatedCVs, completeCVs, error_4;

    var _this = this;

    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 3,, 4]);

          searchParams = new URL(request.url).searchParams;
          page = parseInt(searchParams.get('page') || '1');
          limit = parseInt(searchParams.get('limit') || '20');
          validPage = isNaN(page) || page < 1 ? 1 : page;
          validLimit = isNaN(limit) || limit < 1 || limit > 100 ? 20 : limit;
          return [4
          /*yield*/
          , firebase_1.getCVs()];

        case 1:
          cvs = _a.sent();
          totalItems = cvs.length;
          startIndex = (validPage - 1) * validLimit;
          endIndex = startIndex + validLimit;
          paginatedCVs = cvs.slice(startIndex, endIndex);
          return [4
          /*yield*/
          , Promise.all(paginatedCVs.map(function (cv) {
            return __awaiter(_this, void 0, void 0, function () {
              var completeCV, error_5;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    if (!cv.id) return [2
                    /*return*/
                    , cv];
                    _a.label = 1;

                  case 1:
                    _a.trys.push([1, 3,, 4]);

                    return [4
                    /*yield*/
                    , firebase_1.getCompleteCV(cv.id)];

                  case 2:
                    completeCV = _a.sent();
                    return [2
                    /*return*/
                    , completeCV];

                  case 3:
                    error_5 = _a.sent();
                    console.error("Error al obtener datos completos para CV " + cv.id + ":", error_5);
                    return [2
                    /*return*/
                    , cv];
                  // Devolver el CV original si hay un error

                  case 4:
                    return [2
                    /*return*/
                    ];
                }
              });
            });
          }))];

        case 2:
          completeCVs = _a.sent();
          return [2
          /*return*/
          , server_1.NextResponse.json({
            success: true,
            data: completeCVs,
            pagination: {
              totalItems: totalItems,
              currentPage: validPage,
              totalPages: Math.ceil(totalItems / validLimit),
              itemsPerPage: validLimit
            }
          })];

        case 3:
          error_4 = _a.sent();
          console.error('Error al obtener CVs:', error_4);
          return [2
          /*return*/
          , server_1.NextResponse.json({
            success: false,
            error: 'Error al obtener CVs'
          }, {
            status: 500
          })];

        case 4:
          return [2
          /*return*/
          ];
      }
    });
  });
}

exports.GET = GET; // Función DELETE modificada

function DELETE(request) {
  return __awaiter(this, void 0, void 0, function () {
    var searchParams, cvId, app, db, cvRef, cvSnap, cvData, fileError_1, error_6;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 9,, 10]);

          searchParams = new URL(request.url).searchParams;
          cvId = searchParams.get('id');

          if (!cvId) {
            return [2
            /*return*/
            , server_1.NextResponse.json({
              success: false,
              error: 'ID de CV no proporcionado'
            }, {
              status: 400
            })];
          }

          console.log("Iniciando eliminaci\xF3n de CV con ID: " + cvId); // Inicializar Firebase directamente para esta operación

          app = app_1.initializeApp({
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
          }, 'deleteApp');
          db = firestore_1.getFirestore(app);
          cvRef = firestore_1.doc(db, 'cvs', cvId);
          return [4
          /*yield*/
          , firestore_1.getDoc(cvRef)];

        case 1:
          cvSnap = _a.sent();
          if (!cvSnap.exists()) return [3
          /*break*/
          , 6];
          cvData = cvSnap.data();
          console.log("CV encontrado con ID: " + cvId);
          if (!cvData.fileUrl) return [3
          /*break*/
          , 5];
          console.log("CV tiene fileUrl: " + cvData.fileUrl);
          if (!!cvData.fileUrl.includes('example.com')) return [3
          /*break*/
          , 4];
          _a.label = 2;

        case 2:
          _a.trys.push([2, 4,, 5]);

          return [4
          /*yield*/
          , safeDeleteStorageFile(cvData.fileUrl, app)];

        case 3:
          _a.sent();

          return [3
          /*break*/
          , 5];

        case 4:
          fileError_1 = _a.sent();
          console.log("Error al eliminar archivo (continuando): " + fileError_1.message);
          return [3
          /*break*/
          , 5];

        case 5:
          console.log('Eliminando documento de CV');
          return [3
          /*break*/
          , 7];

        case 6:
          console.log("CV con ID " + cvId + " no encontrado, nada que eliminar");
          _a.label = 7;

        case 7:
          // Eliminar el documento de CV directamente
          return [4
          /*yield*/
          , firestore_1.deleteDoc(cvRef)];

        case 8:
          // Eliminar el documento de CV directamente
          _a.sent();

          console.log("Documento de CV eliminado: " + cvId);
          return [2
          /*return*/
          , server_1.NextResponse.json({
            success: true,
            message: 'CV eliminado exitosamente',
            id: cvId
          })];

        case 9:
          error_6 = _a.sent();
          console.error('Error al eliminar CV:', error_6);
          return [2
          /*return*/
          , server_1.NextResponse.json({
            success: false,
            error: 'Error al eliminar CV',
            details: error_6 instanceof Error ? error_6.message : 'Error desconocido'
          }, {
            status: 500
          })];

        case 10:
          return [2
          /*return*/
          ];
      }
    });
  });
}

exports.DELETE = DELETE; // Función auxiliar para eliminación segura de archivos

function safeDeleteStorageFile(fileUrl, app) {
  return __awaiter(this, void 0, void 0, function () {
    var segments, pathWithQuery, path, decodedPath, storage, fileRef, error_7;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2,, 3]); // Validaciones estrictas


          if (!fileUrl || typeof fileUrl !== 'string') {
            console.log('URL no válida (undefined o no string)');
            return [2
            /*return*/
            ];
          }

          if (fileUrl.includes('example.com')) {
            console.log('URL de ejemplo detectada, ignorando:', fileUrl);
            return [2
            /*return*/
            ];
          }

          if (!fileUrl.includes('firebasestorage.googleapis.com')) {
            console.log('No es una URL de Firebase Storage:', fileUrl);
            return [2
            /*return*/
            ];
          } // Intentar extraer el path de la URL


          segments = fileUrl.split('/o/');

          if (segments.length < 2) {
            console.log('Formato de URL no reconocido:', fileUrl);
            return [2
            /*return*/
            ];
          }

          pathWithQuery = segments[1];
          path = pathWithQuery.split('?')[0];

          if (!path) {
            console.log('No se pudo extraer la ruta del archivo:', fileUrl);
            return [2
            /*return*/
            ];
          } // Decodificar el path y eliminar


          decodedPath = decodeURIComponent(path);
          console.log('Eliminando archivo con path:', decodedPath);
          storage = storage_1.getStorage(app);
          fileRef = storage_1.ref(storage, decodedPath);
          return [4
          /*yield*/
          , storage_1.deleteObject(fileRef)];

        case 1:
          _a.sent();

          console.log('Archivo eliminado correctamente');
          return [3
          /*break*/
          , 3];

        case 2:
          error_7 = _a.sent();
          console.log('Error al eliminar archivo (ignorado):', error_7); // No propagar el error

          return [3
          /*break*/
          , 3];

        case 3:
          return [2
          /*return*/
          ];
      }
    });
  });
}