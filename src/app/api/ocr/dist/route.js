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
exports.DELETE = exports.GET = exports.POST = void 0;
var server_1 = require("next/server");
var openai_1 = require("../../../lib/openai");
var document_parser_1 = require("../../../lib/document-parser");
var firebase_1 = require("../../../lib/firebase");
// Tamaño máximo de archivo (5MB)
var MAX_FILE_SIZE = 5 * 1024 * 1024;
function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var formData, file, jobPositionId_1, fileInfo, validTypes, extractedText, fileUrl, jobPositions, jobPosition, selectedPosition, analysis, candidateData, candidateId, cvData, cvId, completeCV, error_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 12, , 13]);
                    return [4 /*yield*/, request.formData()];
                case 1:
                    formData = _a.sent();
                    file = formData.get('file');
                    jobPositionId_1 = formData.get('jobPositionId');
                    if (!file) {
                        return [2 /*return*/, server_1.NextResponse.json({ success: false, error: 'No se ha subido ningún archivo' }, { status: 400 })];
                    }
                    fileInfo = {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        lastModified: new Date(file.lastModified).toISOString()
                    };
                    console.log('Procesando CV:', fileInfo);
                    // Validate file size
                    if (file.size > MAX_FILE_SIZE) {
                        return [2 /*return*/, server_1.NextResponse.json({
                                success: false,
                                error: 'El archivo es demasiado grande. El tamaño máximo permitido es 5MB.'
                            }, { status: 400 })];
                    }
                    validTypes = [
                        'application/pdf',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    ];
                    console.log('Tipo de archivo detectado:', file.type);
                    if (!validTypes.includes(file.type)) {
                        return [2 /*return*/, server_1.NextResponse.json({
                                success: false,
                                error: 'Tipo de archivo inválido. Por favor, sube un archivo PDF o DOCX',
                                detectedType: file.type
                            }, { status: 400 })];
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 10, , 11]);
                    // Extract text from file
                    console.log('Iniciando extracción de texto...');
                    return [4 /*yield*/, document_parser_1.extractTextFromFile(file)];
                case 3:
                    extractedText = _a.sent();
                    if (!extractedText) {
                        throw new Error('No se pudo extraer texto del archivo');
                    }
                    console.log('Extracción de texto exitosa. Caracteres:', extractedText.length);
                    // Upload file to Firebase Storage
                    console.log('Subiendo archivo a almacenamiento...');
                    return [4 /*yield*/, firebase_1.uploadFileToStorage(file, 'cvs')];
                case 4:
                    fileUrl = _a.sent();
                    console.log('Archivo subido exitosamente:', fileUrl);
                    // Get job positions
                    console.log('Obteniendo puestos de trabajo...');
                    return [4 /*yield*/, firebase_1.getJobPositions()];
                case 5:
                    jobPositions = _a.sent();
                    if (jobPositions.length === 0) {
                        return [2 /*return*/, server_1.NextResponse.json({ success: false, error: 'No se encontraron puestos de trabajo' }, { status: 400 })];
                    }
                    console.log("Se encontraron " + jobPositions.length + " puestos de trabajo");
                    jobPosition = void 0;
                    if (jobPositionId_1) {
                        selectedPosition = jobPositions.find(function (p) { return p.id === jobPositionId_1; });
                        if (selectedPosition) {
                            jobPosition = selectedPosition;
                            console.log("Usando puesto seleccionado: " + jobPosition.title);
                        }
                        else {
                            // Fallback to first position if specified ID not found
                            jobPosition = jobPositions[0];
                            console.log("Puesto con ID " + jobPositionId_1 + " no encontrado, usando primer puesto: " + jobPosition.title);
                        }
                    }
                    else {
                        // Default to first position
                        jobPosition = jobPositions[0];
                        console.log("Usando primer puesto para an\u00E1lisis: " + jobPosition.title);
                    }
                    // Analyze CV with GPT
                    console.log('Iniciando análisis de CV con GPT...');
                    return [4 /*yield*/, openai_1.analyzeCVWithGPT(extractedText, jobPosition)];
                case 6:
                    analysis = _a.sent();
                    console.log('Análisis completado');
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
                    // Create or update candidate in Firestore
                    console.log('Creando/actualizando registro de candidato...');
                    return [4 /*yield*/, firebase_1.createOrUpdateCandidate(candidateData)];
                case 7:
                    candidateId = _a.sent();
                    // Create CV record
                    console.log('Creando registro de CV...');
                    cvData = {
                        fileName: file.name,
                        fileUrl: fileUrl,
                        content: extractedText,
                        candidateId: candidateId
                    };
                    return [4 /*yield*/, firebase_1.createCV(cvData)];
                case 8:
                    cvId = _a.sent();
                    return [4 /*yield*/, firebase_1.getCompleteCV(cvId)];
                case 9:
                    completeCV = _a.sent();
                    return [2 /*return*/, server_1.NextResponse.json({
                            success: true,
                            message: 'CV procesado exitosamente',
                            data: __assign(__assign({}, completeCV), { analysis: {
                                    score: analysis.score,
                                    feedback: analysis.feedback,
                                    jobPosition: {
                                        id: jobPosition.id,
                                        title: jobPosition.title
                                    }
                                } })
                        })];
                case 10:
                    error_1 = _a.sent();
                    console.error('Error al procesar archivo:', error_1);
                    return [2 /*return*/, server_1.NextResponse.json({
                            success: false,
                            error: 'Error al procesar archivo',
                            details: error_1 instanceof Error ? error_1.message : 'Error desconocido',
                            fileInfo: fileInfo
                        }, { status: 500 })];
                case 11: return [3 /*break*/, 13];
                case 12:
                    error_2 = _a.sent();
                    console.error('Error al manejar la solicitud:', error_2);
                    return [2 /*return*/, server_1.NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 })];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var searchParams, page, limit, validPage, validLimit, cvs, totalItems, startIndex, endIndex, paginatedCVs, completeCVs, error_3;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    searchParams = new URL(request.url).searchParams;
                    page = parseInt(searchParams.get('page') || '1');
                    limit = parseInt(searchParams.get('limit') || '20');
                    validPage = isNaN(page) || page < 1 ? 1 : page;
                    validLimit = isNaN(limit) || limit < 1 || limit > 100 ? 20 : limit;
                    return [4 /*yield*/, firebase_1.getCVs()];
                case 1:
                    cvs = _a.sent();
                    totalItems = cvs.length;
                    startIndex = (validPage - 1) * validLimit;
                    endIndex = startIndex + validLimit;
                    paginatedCVs = cvs.slice(startIndex, endIndex);
                    return [4 /*yield*/, Promise.all(paginatedCVs.map(function (cv) { return __awaiter(_this, void 0, void 0, function () {
                            var completeCV, error_4;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!cv.id)
                                            return [2 /*return*/, cv];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, firebase_1.getCompleteCV(cv.id)];
                                    case 2:
                                        completeCV = _a.sent();
                                        return [2 /*return*/, completeCV];
                                    case 3:
                                        error_4 = _a.sent();
                                        console.error("Error al obtener datos completos para CV " + cv.id + ":", error_4);
                                        return [2 /*return*/, cv]; // Devolver el CV original si hay un error
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    completeCVs = _a.sent();
                    return [2 /*return*/, server_1.NextResponse.json({
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
                    error_3 = _a.sent();
                    console.error('Error al obtener CVs:', error_3);
                    return [2 /*return*/, server_1.NextResponse.json({ success: false, error: 'Error al obtener CVs' }, { status: 500 })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.GET = GET;
function DELETE(request) {
    return __awaiter(this, void 0, void 0, function () {
        var searchParams, cvId, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    searchParams = new URL(request.url).searchParams;
                    cvId = searchParams.get('id');
                    if (!cvId) {
                        return [2 /*return*/, server_1.NextResponse.json({ success: false, error: 'ID de CV no proporcionado' }, { status: 400 })];
                    }
                    console.log("Iniciando eliminaci\u00F3n de CV con ID: " + cvId);
                    return [4 /*yield*/, firebase_1.deleteCV(cvId)];
                case 1:
                    _a.sent();
                    console.log("CV con ID " + cvId + " eliminado correctamente");
                    return [2 /*return*/, server_1.NextResponse.json({
                            success: true,
                            message: 'CV eliminado exitosamente',
                            id: cvId
                        })];
                case 2:
                    error_5 = _a.sent();
                    console.error('Error al eliminar CV:', error_5);
                    return [2 /*return*/, server_1.NextResponse.json({
                            success: false,
                            error: 'Error al eliminar CV',
                            details: error_5 instanceof Error ? error_5.message : 'Error desconocido'
                        }, { status: 500 })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.DELETE = DELETE;
