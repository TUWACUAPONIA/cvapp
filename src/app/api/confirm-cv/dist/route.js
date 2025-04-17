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
var firebase_admin_1 = require("@lib/firebase-admin");
var firebase_storage_1 = require("@lib/firebase-storage");
function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var formData, file, analysisDataString, confirmationPayload, fileUrl, candidateId, cvData, cvId, error_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.group('🔄 API Confirm CV - Guardado Final');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _a.sent();
                    file = formData.get('file');
                    analysisDataString = formData.get('analysisData');
                    // Validación básica de entrada
                    if (!file) {
                        console.warn('⚠️ No se recibió archivo en la confirmación.');
                        throw new Error('No se proporcionó el archivo para guardar.');
                    }
                    if (!analysisDataString) {
                        console.warn('⚠️ No se recibieron datos de análisis en la confirmación.');
                        throw new Error('No se proporcionaron los datos de análisis para guardar.');
                    }
                    console.log('📄 Archivo recibido:', file.name, file.type);
                    console.log('📊 Datos de análisis (string) recibidos:', analysisDataString.substring(0, 100) + '...');
                    confirmationPayload = void 0;
                    try {
                        confirmationPayload = JSON.parse(analysisDataString);
                        console.log('✅ Datos de análisis parseados:', confirmationPayload.analysis.name);
                    }
                    catch (parseError) {
                        console.error('❌ Error al parsear JSON de analysisData:', parseError);
                        throw new Error('Los datos de análisis recibidos no son válidos.');
                    }
                    // 1. Subir el archivo a Firebase Storage
                    console.log('📤 Subiendo archivo a Storage...');
                    return [4 /*yield*/, firebase_storage_1.uploadFileToStorage(file, 'cvs')];
                case 3:
                    fileUrl = _a.sent();
                    console.log('✅ Archivo subido:', fileUrl);
                    // 2. Preparar y guardar datos del candidato
                    console.log('👤 Guardando/Actualizando candidato en Firestore...');
                    return [4 /*yield*/, firebase_admin_1.createOrUpdateAdminCandidate(confirmationPayload.analysis)];
                case 4:
                    candidateId = _a.sent();
                    console.log('✅ Candidato guardado/actualizado:', candidateId);
                    cvData = {
                        fileName: file.name,
                        fileUrl: fileUrl,
                        content: confirmationPayload.extractedText,
                        candidateId: candidateId,
                        createdAt: firebase_admin_1.AdminTimestamp.now(),
                        status: 'pending_review'
                    };
                    console.log('📄 Guardando CV en Firestore...');
                    return [4 /*yield*/, firebase_admin_1.createAdminCV(cvData)];
                case 5:
                    cvId = _a.sent();
                    console.log('✅ CV guardado:', cvId);
                    console.log('🎉 Proceso de guardado completado exitosamente.');
                    console.groupEnd(); // API Confirm CV - Guardado Final
                    return [2 /*return*/, server_1.NextResponse.json({
                            success: true,
                            message: "CV de " + confirmationPayload.analysis.name + " guardado correctamente (ID: " + cvId + ").",
                            data: {
                                candidateId: candidateId,
                                cvId: cvId,
                                fileUrl: fileUrl
                            }
                        })];
                case 6:
                    error_1 = _a.sent();
                    console.error('❌ Error en API Confirm CV:', {
                        error: error_1,
                        tipo: error_1 instanceof Error ? error_1.name : typeof error_1,
                        mensaje: error_1 instanceof Error ? error_1.message : String(error_1),
                        stack: error_1 instanceof Error ? error_1.stack : undefined
                    });
                    console.groupEnd(); // API Confirm CV - Guardado Final
                    errorMessage = error_1 instanceof Error ? error_1.message : String(error_1);
                    return [2 /*return*/, server_1.NextResponse.json({ success: false, error: "Error al guardar el CV: " + errorMessage }, { status: 500 })];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
