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
exports.normalizeText = exports.extractTextFromFile = void 0;
var mammoth_1 = require("mammoth");
function extractTextFromFile(file) {
    return __awaiter(this, void 0, Promise, function () {
        var buffer, pdf, maxPages, textContent, totalTextLength, pageNo, page, content, pageText, averageTextPerPage, extractedText, pdfError_1, result, extractedText, docxError_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 16, , 17]);
                    return [4 /*yield*/, file.arrayBuffer()];
                case 1:
                    buffer = _a.sent();
                    if (!(file.type === 'application/pdf')) return [3 /*break*/, 11];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 9, , 10]);
                    if (typeof window === 'undefined' || !window.pdfjsLib) {
                        throw new Error('PDF.js no está cargado');
                    }
                    return [4 /*yield*/, window.pdfjsLib.getDocument({ data: buffer }).promise];
                case 3:
                    pdf = _a.sent();
                    maxPages = pdf.numPages;
                    textContent = [];
                    totalTextLength = 0;
                    pageNo = 1;
                    _a.label = 4;
                case 4:
                    if (!(pageNo <= maxPages)) return [3 /*break*/, 8];
                    return [4 /*yield*/, pdf.getPage(pageNo)];
                case 5:
                    page = _a.sent();
                    return [4 /*yield*/, page.getTextContent()];
                case 6:
                    content = _a.sent();
                    pageText = content.items
                        .map(function (item) { return item.str; })
                        .join(' ');
                    textContent.push(pageText);
                    totalTextLength += pageText.length;
                    _a.label = 7;
                case 7:
                    pageNo++;
                    return [3 /*break*/, 4];
                case 8:
                    averageTextPerPage = totalTextLength / maxPages;
                    if (averageTextPerPage < 100) { // Umbral de caracteres por página
                        throw new Error('Este parece ser un PDF escaneado o una imagen. ' +
                            'Por favor, asegúrese de subir un PDF con texto seleccionable. ' +
                            'Si tiene un PDF escaneado, necesitará convertirlo primero usando un software de OCR.');
                    }
                    extractedText = normalizeText(textContent.join('\n'));
                    if (!extractedText.trim()) {
                        throw new Error('No se pudo extraer texto del PDF. ' +
                            'Por favor, asegúrese de que el archivo contenga texto seleccionable y no esté protegido.');
                    }
                    return [2 /*return*/, extractedText];
                case 9:
                    pdfError_1 = _a.sent();
                    console.error('Error al procesar PDF:', pdfError_1);
                    if (pdfError_1 instanceof Error) {
                        // Propagar errores específicos sobre PDFs escaneados o sin texto
                        if (pdfError_1.message.includes('PDF escaneado') ||
                            pdfError_1.message.includes('texto seleccionable')) {
                            throw pdfError_1;
                        }
                    }
                    throw new Error('Error al procesar el PDF. ' +
                        'Por favor, verifique que el archivo no esté dañado o protegido.');
                case 10: return [3 /*break*/, 15];
                case 11:
                    if (!(file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) return [3 /*break*/, 15];
                    _a.label = 12;
                case 12:
                    _a.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, mammoth_1["default"].extractRawText({
                            arrayBuffer: buffer
                        })];
                case 13:
                    result = _a.sent();
                    extractedText = normalizeText(result.value);
                    if (!extractedText.trim()) {
                        throw new Error('No se pudo extraer texto del documento DOCX. ' +
                            'Por favor, asegúrese de que el archivo contenga texto y no esté protegido.');
                    }
                    return [2 /*return*/, extractedText];
                case 14:
                    docxError_1 = _a.sent();
                    console.error('Error al procesar DOCX:', docxError_1);
                    throw new Error('Error al procesar el documento DOCX. ' +
                        'Por favor, verifique que el archivo no esté dañado o protegido.');
                case 15: throw new Error('Formato de archivo no soportado. ' +
                    'Por favor, suba un archivo PDF o DOCX con texto seleccionable.');
                case 16:
                    error_1 = _a.sent();
                    console.error('Error al extraer texto:', error_1);
                    if (error_1 instanceof Error) {
                        throw error_1; // Propagar el error con el mensaje detallado
                    }
                    throw new Error('Error desconocido al procesar el archivo');
                case 17: return [2 /*return*/];
            }
        });
    });
}
exports.extractTextFromFile = extractTextFromFile;
// Añadir esta función si no existe
function normalizeText(text) {
    if (!text)
        return '';
    return text
        .replace(/[\r\n]+/g, '\n') // Replace multiple line breaks with single
        .replace(/\s+/g, ' ') // Replace multiple spaces with single
        .trim(); // Remove leading/trailing whitespace
}
exports.normalizeText = normalizeText;
