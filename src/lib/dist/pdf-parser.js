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
exports.normalizeText = exports.parsePDF = void 0;
var buffer_1 = require("buffer");
var PDFParser = require('pdf2json');
function parsePDF(buffer) {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            try {
                if (!buffer || buffer.byteLength === 0) {
                    throw new Error('Buffer inválido o vacío');
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var pdfParser = new PDFParser(null, 1);
                        pdfParser.on('pdfParser_dataReady', function (pdfData) {
                            try {
                                console.log('PDF data recibida, procesando...');
                                if (!pdfData || !pdfData.Pages || !Array.isArray(pdfData.Pages)) {
                                    console.error('Estructura de PDF inválida:', pdfData);
                                    throw new Error('Formato de PDF inválido o corrupto');
                                }
                                console.log("Procesando " + pdfData.Pages.length + " p\u00E1ginas...");
                                var text_1 = '';
                                pdfData.Pages.forEach(function (page, pageIndex) {
                                    if (page.Texts && Array.isArray(page.Texts)) {
                                        console.log("P\u00E1gina " + (pageIndex + 1) + ": " + page.Texts.length + " elementos de texto");
                                        page.Texts.forEach(function (textItem) {
                                            if (textItem.R && Array.isArray(textItem.R)) {
                                                textItem.R.forEach(function (item) {
                                                    if (item.T) {
                                                        try {
                                                            var decodedText = decodeURIComponent(item.T);
                                                            text_1 += decodedText + ' ';
                                                        }
                                                        catch (decodeError) {
                                                            console.warn('Error decodificando texto:', item.T);
                                                            text_1 += item.T + ' ';
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                        text_1 += '\n';
                                    }
                                    else {
                                        console.warn("P\u00E1gina " + (pageIndex + 1) + ": No se encontraron elementos de texto");
                                    }
                                });
                                var normalizedText = normalizeText(text_1);
                                if (!normalizedText.trim()) {
                                    console.error('No se encontró texto después de la normalización');
                                    throw new Error('No se pudo extraer texto del PDF. El archivo podría estar escaneado o ser una imagen');
                                }
                                console.log("Texto extra\u00EDdo exitosamente. Longitud: " + normalizedText.length + " caracteres");
                                resolve(normalizedText);
                            }
                            catch (error) {
                                console.error('Error procesando contenido PDF:', error);
                                reject(new Error('Error al procesar contenido del PDF: ' + (error instanceof Error ? error.message : 'Error desconocido')));
                            }
                        });
                        pdfParser.on('pdfParser_dataError', function (errData) {
                            console.error('Error parseando PDF:', errData);
                            reject(new Error('Error al parsear PDF: ' + (errData.parserError || 'Error desconocido')));
                        });
                        try {
                            console.log('Iniciando parseo de PDF...');
                            var uint8Array = new Uint8Array(buffer);
                            pdfParser.parseBuffer(buffer_1.Buffer.from(uint8Array));
                        }
                        catch (error) {
                            console.error('Error leyendo buffer PDF:', error);
                            reject(new Error('Error al leer buffer del PDF: ' + (error instanceof Error ? error.message : 'Error desconocido')));
                        }
                    })];
            }
            catch (error) {
                console.error('Error general parseando PDF:', error);
                if (error instanceof Error) {
                    if (error.message.includes('escaneado') || error.message.includes('imagen')) {
                        throw new Error('El PDF parece ser un documento escaneado. Por favor, asegúrate de que el PDF contenga texto seleccionable.');
                    }
                    if (error.message.includes('contraseña') || error.message.includes('password')) {
                        throw new Error('El archivo PDF está protegido con contraseña');
                    }
                    if (error.message.includes('corrupto') || error.message.includes('inválido')) {
                        throw new Error('El archivo PDF parece estar corrupto o es inválido');
                    }
                    throw new Error('Error al procesar archivo PDF: ' + error.message);
                }
                throw new Error('Error al procesar archivo PDF: Error desconocido');
            }
            return [2 /*return*/];
        });
    });
}
exports.parsePDF = parsePDF;
function normalizeText(text) {
    if (!text)
        return '';
    var normalized = text
        .replace(/[\r\n]+/g, '\n') // Reemplazar múltiples saltos de línea con uno solo
        .replace(/\s+/g, ' ') // Reemplazar múltiples espacios con uno solo
        .replace(/[^\x20-\x7E\náéíóúÁÉÍÓÚñÑüÜ]/g, '') // Mantener caracteres imprimibles y acentos
        .replace(/%20/g, ' ') // Reemplazar espacios codificados en URL
        .replace(/%2C/g, ',') // Reemplazar comas codificadas en URL
        .replace(/%[0-9A-F]{2}/g, ' ') // Reemplazar otros caracteres codificados en URL con espacios
        .trim(); // Remover espacios al inicio y final
    console.log('Texto normalizado:', {
        originalLength: text.length,
        normalizedLength: normalized.length,
        sample: normalized.substring(0, 100) + '...'
    });
    return normalized;
}
exports.normalizeText = normalizeText;
