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
exports.POST = void 0;
var server_1 = require("next/server");
var openai_1 = require("@lib/openai");
var vision_1 = require("@google-cloud/vision");
var path_1 = require("path");
var document_parser_1 = require("@lib/document-parser");
// Tamaño máximo de archivo (5MB)
var MAX_FILE_SIZE = 5 * 1024 * 1024;
function POST(request) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var client, credentialsPath, formData, file, preExtractedText, fileInfo, validTypes, extractedText, imageBlobs, fullText, i, visionResult, _c, _d, _e, _f, _g, pageText, fileBuffer, visionResult, error_1, analysis, candidateData, error_2, errorMessage;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    console.group('🔄 API Análisis - Procesamiento de CV');
                    _h.label = 1;
                case 1:
                    _h.trys.push([1, 21, 22, 23]);
                    // Initialize Google Vision Client
                    console.group('🔍 Inicialización de Google Vision');
                    client = void 0;
                    try {
                        console.log('Cargando credenciales...');
                        credentialsPath = path_1["default"].join(process.cwd(), 'lectura-de-cvs-c6fbf04eb10f.json');
                        console.log('📁 Ruta de credenciales:', credentialsPath);
                        client = new vision_1.ImageAnnotatorClient({
                            keyFilename: credentialsPath
                        });
                        console.log('✅ Cliente inicializado correctamente');
                    }
                    catch (initError) {
                        console.error('❌ Error de inicialización:', {
                            error: initError,
                            mensaje: initError instanceof Error ? initError.message : String(initError)
                        });
                        throw new Error("Fallo al inicializar Google Vision: " + (initError instanceof Error ? initError.message : String(initError)));
                    }
                    console.groupEnd();
                    // Validación del archivo
                    console.group('📋 Validación de archivo');
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _h.sent();
                    file = formData.get('file');
                    preExtractedText = formData.get('extractedText');
                    if (!file) {
                        console.warn('⚠️ No se recibió ningún archivo');
                        console.groupEnd();
                        console.groupEnd();
                        return [2 /*return*/, server_1.NextResponse.json({ success: false, error: 'No se ha subido ningún archivo' }, { status: 400 })];
                    }
                    fileInfo = {
                        nombre: file.name,
                        tipo: file.type,
                        tamaño: (file.size / 1024 / 1024).toFixed(2) + "MB",
                        ultimaModificacion: new Date(file.lastModified).toLocaleString()
                    };
                    console.log('📄 Información del archivo:', fileInfo);
                    if (file.size > MAX_FILE_SIZE) {
                        console.warn('⚠️ Archivo excede el límite de tamaño:', fileInfo.tamaño);
                        console.groupEnd();
                        console.groupEnd();
                        return [2 /*return*/, server_1.NextResponse.json({ success: false, error: 'El archivo es demasiado grande. El tamaño máximo permitido es 5MB.' }, { status: 400 })];
                    }
                    validTypes = [
                        'application/pdf',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    ];
                    if (!validTypes.includes(file.type)) {
                        console.warn('⚠️ Tipo de archivo no válido:', file.type);
                        console.groupEnd();
                        console.groupEnd();
                        return [2 /*return*/, server_1.NextResponse.json({
                                success: false,
                                error: 'Tipo de archivo inválido. Por favor, sube un archivo PDF o DOCX',
                                detectedType: file.type
                            }, { status: 400 })];
                    }
                    console.log('✅ Validación exitosa');
                    console.groupEnd();
                    // Extracción de texto
                    console.group('📑 Extracción de texto');
                    extractedText = null;
                    _h.label = 3;
                case 3:
                    _h.trys.push([3, 18, , 19]);
                    if (!(preExtractedText && preExtractedText.trim().length > 0)) return [3 /*break*/, 4];
                    console.log('✅ Usando texto pre-extraído:', {
                        caracteres: preExtractedText.length,
                        palabras: preExtractedText.split(/\s+/).length
                    });
                    extractedText = preExtractedText;
                    return [3 /*break*/, 17];
                case 4:
                    // Intentamos extraer el texto directamente
                    console.log('🔄 Intentando extracción directa...');
                    return [4 /*yield*/, document_parser_1.extractTextFromFile(file)];
                case 5:
                    extractedText = _h.sent();
                    if (!(extractedText && extractedText.trim().length > 0)) return [3 /*break*/, 6];
                    console.log('✅ Texto extraído directamente:', {
                        caracteres: extractedText.length,
                        palabras: extractedText.split(/\s+/).length
                    });
                    return [3 /*break*/, 17];
                case 6:
                    console.group('🔍 Proceso OCR');
                    console.log('⚠️ Extracción directa falló, iniciando OCR...');
                    if (!(file.type === 'application/pdf')) return [3 /*break*/, 13];
                    console.group('🖼️ Conversión PDF a imágenes');
                    return [4 /*yield*/, document_parser_1.convertPDFToImages(file)];
                case 7:
                    imageBlobs = _h.sent();
                    console.log('✅ Conversión completada:', {
                        numeroPaginas: imageBlobs.length,
                        tamañoTotal: (imageBlobs.reduce(function (acc, blob) { return acc + blob.size; }, 0) / 1024 / 1024).toFixed(2) + "MB"
                    });
                    console.groupEnd();
                    console.group('🔍 Procesamiento OCR por página');
                    fullText = '';
                    i = 0;
                    _h.label = 8;
                case 8:
                    if (!(i < imageBlobs.length)) return [3 /*break*/, 12];
                    console.log("\uD83D\uDCC4 Procesando p\u00E1gina " + (i + 1) + "/" + imageBlobs.length + "...");
                    _d = (_c = client).documentTextDetection;
                    _e = {};
                    _f = {};
                    _g = Uint8Array.bind;
                    return [4 /*yield*/, imageBlobs[i].arrayBuffer()];
                case 9: return [4 /*yield*/, _d.apply(_c, [(_e.image = (_f.content = new (_g.apply(Uint8Array, [void 0, _h.sent()]))(), _f),
                            _e)])];
                case 10:
                    visionResult = (_h.sent())[0];
                    if (visionResult === null || visionResult === void 0 ? void 0 : visionResult.error) {
                        throw new Error("Error de Google Vision API en p\u00E1gina " + (i + 1) + ": " + (visionResult.error.message || 'Error desconocido'));
                    }
                    pageText = ((_a = visionResult === null || visionResult === void 0 ? void 0 : visionResult.fullTextAnnotation) === null || _a === void 0 ? void 0 : _a.text) || '';
                    if (pageText.trim()) {
                        fullText += pageText + '\n\n';
                        console.log("\u2705 P\u00E1gina " + (i + 1) + " procesada:", {
                            caracteres: pageText.length,
                            palabras: pageText.split(/\s+/).length
                        });
                    }
                    _h.label = 11;
                case 11:
                    i++;
                    return [3 /*break*/, 8];
                case 12:
                    console.groupEnd();
                    extractedText = fullText.trim();
                    return [3 /*break*/, 16];
                case 13:
                    console.log('🔄 Procesando archivo directamente con OCR...');
                    return [4 /*yield*/, file.arrayBuffer()];
                case 14:
                    fileBuffer = _h.sent();
                    return [4 /*yield*/, client.documentTextDetection({
                            image: { content: new Uint8Array(fileBuffer) }
                        })];
                case 15:
                    visionResult = (_h.sent())[0];
                    if (visionResult === null || visionResult === void 0 ? void 0 : visionResult.error) {
                        throw new Error("Error de Google Vision API: " + (visionResult.error.message || 'Error desconocido'));
                    }
                    extractedText = (_b = visionResult === null || visionResult === void 0 ? void 0 : visionResult.fullTextAnnotation) === null || _b === void 0 ? void 0 : _b.text;
                    _h.label = 16;
                case 16:
                    if (!extractedText) {
                        throw new Error('No se pudo extraer texto del documento ni con OCR');
                    }
                    console.log('✅ OCR completado:', {
                        caracteres: extractedText.length,
                        palabras: extractedText.split(/\s+/).length,
                        lineas: extractedText.split('\n').length
                    });
                    console.groupEnd(); // Proceso OCR
                    _h.label = 17;
                case 17: return [3 /*break*/, 19];
                case 18:
                    error_1 = _h.sent();
                    console.error('❌ Error en extracción:', {
                        error: error_1,
                        tipo: error_1 instanceof Error ? error_1.name : typeof error_1,
                        mensaje: error_1 instanceof Error ? error_1.message : String(error_1)
                    });
                    throw new Error("Error al procesar el documento: " + (error_1 instanceof Error ? error_1.message : String(error_1)));
                case 19:
                    console.groupEnd(); // Extracción de texto
                    // Análisis con GPT
                    console.group('🤖 Análisis GPT');
                    console.log('🔄 Iniciando análisis del texto extraído...');
                    return [4 /*yield*/, openai_1.analyzeCVWithGPT(extractedText)];
                case 20:
                    analysis = _h.sent();
                    console.log('✅ Análisis completado:', {
                        nombre: analysis.name,
                        experiencia: analysis.experience.length,
                        habilidades: analysis.skills.length
                    });
                    console.groupEnd();
                    candidateData = {
                        name: analysis.name.trim(),
                        title: analysis.title ? analysis.title.trim() : null,
                        email: analysis.email.trim().toLowerCase(),
                        phone: analysis.phone ? analysis.phone.replace(/\D/g, '') : null,
                        location: analysis.location ? analysis.location.trim() : null,
                        birthDate: analysis.birthDate ? analysis.birthDate.trim() : 'No especificada',
                        age: analysis.age,
                        experience: analysis.experience.map(function (exp) { return exp.trim(); }),
                        skills: analysis.skills.map(function (skill) { return skill.trim(); }),
                        summary: analysis.summary ? analysis.summary.trim() : null
                    };
                    console.log('✅ Análisis completado exitosamente');
                    return [2 /*return*/, server_1.NextResponse.json({
                            success: true,
                            message: 'CV analizado exitosamente',
                            data: {
                                candidateData: candidateData,
                                fileName: file.name,
                                rawContent: extractedText // Incluimos el contenido raw para referencia
                            }
                        })];
                case 21:
                    error_2 = _h.sent();
                    console.group('❌ Error en API Análisis');
                    console.error('Detalles del error:', {
                        error: error_2,
                        tipo: error_2 instanceof Error ? error_2.name : typeof error_2,
                        mensaje: error_2 instanceof Error ? error_2.message : String(error_2),
                        stack: error_2 instanceof Error ? error_2.stack : undefined
                    });
                    console.groupEnd();
                    errorMessage = error_2 instanceof Error ? error_2.message : String(error_2);
                    return [2 /*return*/, server_1.NextResponse.json({ success: false, error: "Error en el an\u00E1lisis: " + errorMessage }, { status: 500 })];
                case 22:
                    console.groupEnd(); // API Análisis - Procesamiento de CV
                    return [7 /*endfinally*/];
                case 23: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
