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
exports.POST = exports.runtime = void 0;
var server_1 = require("next/server");
var openai_1 = require("@lib/openai");
var vision_1 = require("@google-cloud/vision");
var firebase_admin_1 = require("@lib/firebase-admin");
var firebase_storage_1 = require("@lib/firebase-storage");
// Configuración explícita para Node.js Runtime en Vercel
exports.runtime = 'nodejs';
// Tamaño máximo permitido: 5MB
var MAX_FILE_SIZE = 5 * 1024 * 1024;
function POST(request) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var credentialsEnv, credentials, client, formData, file, fileInfo, validTypes, fileBuffer, _b, _c, extractedText, visionResult, visionError_1, fileUrl, analysis, candidateData, candidateId, cvData, cvId, completeCV, error_1, errorMessage;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log("--- OCR API Route Handler Invoked ---");
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 13, , 14]);
                    console.log("[Paso 1] Verificando credenciales de Google Vision");
                    credentialsEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
                    if (!credentialsEnv) {
                        throw new Error("La variable de entorno GOOGLE_APPLICATION_CREDENTIALS_JSON no está definida.");
                    }
                    credentials = JSON.parse(credentialsEnv);
                    client = new vision_1.ImageAnnotatorClient({ credentials: credentials });
                    console.log("[Paso 2] Cliente de Google Vision inicializado correctamente.");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _d.sent();
                    file = formData.get('file');
                    if (!file) {
                        return [2 /*return*/, server_1.NextResponse.json({ success: false, error: 'No se ha subido ningún archivo' }, { status: 400 })];
                    }
                    fileInfo = {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        lastModified: new Date(file.lastModified).toISOString()
                    };
                    console.log('[Paso 3] Archivo recibido:', fileInfo);
                    if (file.size > MAX_FILE_SIZE) {
                        return [2 /*return*/, server_1.NextResponse.json({ success: false, error: 'El archivo supera los 5MB permitidos.' }, { status: 400 })];
                    }
                    validTypes = [
                        'application/pdf',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    ];
                    if (!validTypes.includes(file.type)) {
                        return [2 /*return*/, server_1.NextResponse.json({ success: false, error: 'Tipo de archivo no soportado. Usa PDF o DOCX.', detectedType: file.type }, { status: 400 })];
                    }
                    _c = (_b = Buffer).from;
                    return [4 /*yield*/, file.arrayBuffer()];
                case 3:
                    fileBuffer = _c.apply(_b, [_d.sent()]);
                    console.log("[Paso 4] Buffer del archivo generado correctamente");
                    extractedText = null;
                    _d.label = 4;
                case 4:
                    _d.trys.push([4, 6, , 7]);
                    console.log("[Paso 5] Enviando archivo a Google Vision para OCR...");
                    return [4 /*yield*/, client.documentTextDetection({
                            image: { content: fileBuffer }
                        })];
                case 5:
                    visionResult = (_d.sent())[0];
                    if (visionResult === null || visionResult === void 0 ? void 0 : visionResult.error) {
                        throw new Error("Google Vision Error: " + visionResult.error.message);
                    }
                    extractedText = (_a = visionResult === null || visionResult === void 0 ? void 0 : visionResult.fullTextAnnotation) === null || _a === void 0 ? void 0 : _a.text;
                    console.log("[Paso 6] Texto extraído (primeros 300 caracteres):", extractedText === null || extractedText === void 0 ? void 0 : extractedText.slice(0, 300));
                    return [3 /*break*/, 7];
                case 6:
                    visionError_1 = _d.sent();
                    throw new Error("Error usando Google Vision API: " + (visionError_1 instanceof Error ? visionError_1.message : String(visionError_1)));
                case 7:
                    if (!extractedText) {
                        throw new Error("No se pudo extraer texto del archivo.");
                    }
                    console.log("[Paso 7] Subiendo archivo a almacenamiento...");
                    return [4 /*yield*/, firebase_storage_1.uploadFileToStorage(file, 'cvs')];
                case 8:
                    fileUrl = _d.sent();
                    console.log("[Paso 8] Archivo subido exitosamente a:", fileUrl);
                    console.log("[Paso 9] Enviando texto a OpenAI para análisis...");
                    return [4 /*yield*/, openai_1.analyzeCVWithGPT(extractedText)];
                case 9:
                    analysis = _d.sent();
                    console.log("[Paso 10] Análisis recibido de OpenAI:", analysis);
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
                    console.log("[Paso 11] Guardando candidato en Firebase:", candidateData);
                    return [4 /*yield*/, firebase_admin_1.createOrUpdateAdminCandidate(candidateData)];
                case 10:
                    candidateId = _d.sent();
                    cvData = {
                        fileName: file.name,
                        fileUrl: fileUrl,
                        content: extractedText,
                        candidateId: candidateId
                    };
                    return [4 /*yield*/, firebase_admin_1.createAdminCV(cvData)];
                case 11:
                    cvId = _d.sent();
                    console.log("[Paso 12] CV creado con ID:", cvId);
                    return [4 /*yield*/, firebase_admin_1.getAdminCompleteCV(cvId)];
                case 12:
                    completeCV = _d.sent();
                    console.log("[Paso 13] CV completo recuperado de Firebase:", completeCV);
                    return [2 /*return*/, server_1.NextResponse.json({
                            success: true,
                            message: 'CV analizado correctamente',
                            data: {
                                candidateData: candidateData,
                                fileUrl: fileUrl,
                                fileName: file.name,
                                extractedText: extractedText
                            }
                        })];
                case 13:
                    error_1 = _d.sent();
                    errorMessage = error_1 instanceof Error ? error_1.message : String(error_1);
                    console.error('[ERROR] En el endpoint OCR:', errorMessage);
                    return [2 /*return*/, server_1.NextResponse.json({ success: false, error: "Error en la API: " + errorMessage }, { status: 500 })];
                case 14: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
