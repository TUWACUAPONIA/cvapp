'use client';
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
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var document_parser_1 = require("@/lib/document-parser");
function CVUpload() {
    var _this = this;
    var _a = react_1.useState(null), file = _a[0], setFile = _a[1];
    var _b = react_1.useState(false), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var _d = react_1.useState(null), previewData = _d[0], setPreviewData = _d[1];
    var _e = react_1.useState(false), editMode = _e[0], setEditMode = _e[1];
    var _f = react_1.useState(""), selectedJobPosition = _f[0], setSelectedJobPosition = _f[1];
    var _g = react_1.useState([]), jobPositions = _g[0], setJobPositions = _g[1];
    var _h = react_1.useState("initial"), processingStep = _h[0], setProcessingStep = _h[1]; // initial, preview, ocr, ready
    var router = navigation_1.useRouter();
    // Cargar puestos de trabajo al iniciar
    react_1.useEffect(function () {
        function fetchJobPositions() {
            return __awaiter(this, void 0, void 0, function () {
                var response, data, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, fetch('/api/job-positions')];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, response.json()];
                        case 2:
                            data = _a.sent();
                            if (data.success) {
                                setJobPositions(data.data);
                                if (data.data.length > 0) {
                                    setSelectedJobPosition(data.data[0].id);
                                }
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.error("Error al cargar puestos de trabajo:", error_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        fetchJobPositions();
    }, []);
    var analyzeTextWithAI = function (text) { return __awaiter(_this, void 0, Promise, function () {
        var emailMatch, phoneMatch, lines, possibleName, skillKeywords, detectedSkills;
        return __generator(this, function (_a) {
            emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            phoneMatch = text.match(/(\+?\d{1,4}[ -]?)?(\(?\d{1,}\)?[ -]?)?\d{1,}[ -]?\d{1,}[ -]?\d{1,}/);
            lines = text.split('\n').filter(function (line) { return line.trim().length > 0; });
            possibleName = lines.length > 0 ? lines[0] : 'Nombre no detectado';
            skillKeywords = ['JavaScript', 'Python', 'React', 'Node.js', 'HTML', 'CSS', 'SQL',
                'Java', 'C++', 'TypeScript', 'Angular', 'Vue', 'Firebase', 'AWS',
                'MongoDB', 'Express', 'Git', 'Docker', 'Kubernetes', 'REST', 'API'];
            detectedSkills = skillKeywords.filter(function (skill) {
                return text.toLowerCase().includes(skill.toLowerCase());
            });
            return [2 /*return*/, {
                    name: possibleName,
                    title: lines.length > 1 ? lines[1] : null,
                    email: emailMatch ? emailMatch[0] : '',
                    phone: phoneMatch ? phoneMatch[0] : null,
                    location: null,
                    birthDate: null,
                    age: null,
                    experience: null,
                    skills: detectedSkills,
                    summary: text.substring(0, 200) + '...'
                }];
        });
    }); };
    var handleFileChange = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var selectedFile, extractedText, candidateData, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(e.target.files && e.target.files[0])) return [3 /*break*/, 6];
                    selectedFile = e.target.files[0];
                    setFile(selectedFile);
                    setError(null);
                    setLoading(true);
                    setProcessingStep("initial");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, document_parser_1.extractTextFromFile(selectedFile)];
                case 2:
                    extractedText = _a.sent();
                    // Si el texto está vacío o es muy corto, es posible que sea un PDF escaneado
                    if (!extractedText || extractedText.trim().length < 50) {
                        setProcessingStep("ocr");
                        setError("El documento parece estar escaneado o no contiene texto extraíble. Intentando con OCR...");
                        // En un caso real, aquí llamaríamos al endpoint de OCR
                        // Por ahora simulamos una espera
                        setTimeout(function () {
                            // Simulación de resultado de OCR (en producción se usaría un endpoint real)
                            var mockOcrResult = "Este es un texto simulado de OCR para demostración. Contiene información del CV como nombre@ejemplo.com y teléfono +123456789 JavaScript Python React";
                            analyzeTextWithAI(mockOcrResult).then(function (candidateData) {
                                setPreviewData({
                                    candidateData: candidateData,
                                    cvText: mockOcrResult,
                                    originalText: mockOcrResult
                                });
                                setProcessingStep("preview");
                                setLoading(false);
                            });
                        }, 2000);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, analyzeTextWithAI(extractedText)];
                case 3:
                    candidateData = _a.sent();
                    setPreviewData({
                        candidateData: candidateData,
                        cvText: extractedText,
                        originalText: extractedText
                    });
                    setProcessingStep("preview");
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    console.error('Error al extraer texto:', err_1);
                    setError(err_1 instanceof Error ? err_1.message : 'Error al procesar el archivo');
                    setPreviewData(null);
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleCandidateDataChange = function (field, value) {
        var _a;
        if (!previewData)
            return;
        setPreviewData(__assign(__assign({}, previewData), { candidateData: __assign(__assign({}, previewData.candidateData), (_a = {}, _a[field] = value, _a)) }));
    };
    var handleSkillsChange = function (skillsText) {
        if (!previewData)
            return;
        var skills = skillsText.split(',')
            .map(function (s) { return s.trim(); })
            .filter(function (s) { return s.length > 0; });
        handleCandidateDataChange('skills', skills);
    };
    var confirmAndProceed = function () {
        if (!previewData)
            return;
        setProcessingStep("ready");
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var formData, response, data, err_2, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!file || !previewData || !selectedJobPosition)
                        return [2 /*return*/];
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    formData = new FormData();
                    formData.append('cv', file);
                    formData.append('candidateData', JSON.stringify(previewData.candidateData));
                    formData.append('cvText', previewData.cvText);
                    formData.append('jobPositionId', selectedJobPosition);
                    return [4 /*yield*/, fetch('/api/cv', {
                            method: 'POST',
                            body: formData
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.error || 'Error al procesar el archivo');
                    }
                    router.push('/dashboard');
                    return [3 /*break*/, 6];
                case 4:
                    err_2 = _a.sent();
                    console.error('Error:', err_2);
                    errorMessage = err_2 instanceof Error ? err_2.message : 'Ocurrió un error al subir el archivo';
                    setError(errorMessage);
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var renderForm = function () {
        var _a;
        if (processingStep === "initial" || loading) {
            return (React.createElement("div", { className: "space-y-4" },
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Archivo CV (PDF o DOCX)"),
                    React.createElement("input", { type: "file", accept: ".pdf,.docx", onChange: handleFileChange, disabled: loading, className: "mt-1 block w-full text-sm text-gray-500\r\n                file:mr-4 file:py-2 file:px-4\r\n                file:rounded-md file:border-0\r\n                file:text-sm file:font-semibold\r\n                file:bg-blue-50 file:text-blue-700\r\n                hover:file:bg-blue-100" })),
                loading && (React.createElement("div", { className: "flex justify-center" },
                    React.createElement("div", { className: "animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" }))),
                processingStep === "ocr" && (React.createElement("div", { className: "bg-yellow-50 p-4 rounded-md" },
                    React.createElement("p", { className: "text-yellow-700" }, "Intentando procesar el documento usando OCR. Esto puede tomar unos momentos...")))));
        }
        if (processingStep === "preview" && previewData) {
            return (React.createElement("div", { className: "space-y-6" },
                React.createElement("div", { className: "bg-blue-50 p-4 rounded-md" },
                    React.createElement("p", { className: "text-blue-700 font-medium" }, "Por favor, revisa y edita la informaci\u00F3n extra\u00EDda antes de continuar.")),
                React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Nombre completo"),
                        React.createElement("input", { type: "text", value: previewData.candidateData.name, onChange: function (e) { return handleCandidateDataChange('name', e.target.value); }, className: "mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" })),
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "T\u00EDtulo o puesto actual"),
                        React.createElement("input", { type: "text", value: previewData.candidateData.title || '', onChange: function (e) { return handleCandidateDataChange('title', e.target.value); }, className: "mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" })),
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Email"),
                        React.createElement("input", { type: "email", value: previewData.candidateData.email, onChange: function (e) { return handleCandidateDataChange('email', e.target.value); }, className: "mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" })),
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Tel\u00E9fono"),
                        React.createElement("input", { type: "text", value: previewData.candidateData.phone || '', onChange: function (e) { return handleCandidateDataChange('phone', e.target.value); }, className: "mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" })),
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Ubicaci\u00F3n"),
                        React.createElement("input", { type: "text", value: previewData.candidateData.location || '', onChange: function (e) { return handleCandidateDataChange('location', e.target.value); }, className: "mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" })),
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Fecha de nacimiento"),
                        React.createElement("input", { type: "text", placeholder: "DD/MM/AAAA", value: previewData.candidateData.birthDate || '', onChange: function (e) { return handleCandidateDataChange('birthDate', e.target.value); }, className: "mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" })),
                    React.createElement("div", { className: "md:col-span-2" },
                        React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Experiencia"),
                        React.createElement("textarea", { value: previewData.candidateData.experience || '', onChange: function (e) { return handleCandidateDataChange('experience', e.target.value); }, rows: 3, className: "mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" })),
                    React.createElement("div", { className: "md:col-span-2" },
                        React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Habilidades (separadas por comas)"),
                        React.createElement("input", { type: "text", value: previewData.candidateData.skills.join(', '), onChange: function (e) { return handleSkillsChange(e.target.value); }, className: "mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" })),
                    React.createElement("div", { className: "md:col-span-2" },
                        React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Resumen profesional"),
                        React.createElement("textarea", { value: previewData.candidateData.summary || '', onChange: function (e) { return handleCandidateDataChange('summary', e.target.value); }, rows: 4, className: "mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" }))),
                React.createElement("div", { className: "pt-4 border-t border-gray-200" },
                    React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Texto completo del CV"),
                    React.createElement("textarea", { value: previewData.cvText, onChange: function (e) { return setPreviewData(__assign(__assign({}, previewData), { cvText: e.target.value })); }, rows: 10, className: "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm" })),
                React.createElement("div", { className: "flex justify-end space-x-3" },
                    React.createElement("button", { type: "button", onClick: function () {
                            setFile(null);
                            setPreviewData(null);
                            setProcessingStep("initial");
                        }, className: "px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" }, "Cancelar"),
                    React.createElement("button", { type: "button", onClick: confirmAndProceed, className: "px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700" }, "Confirmar y continuar"))));
        }
        if (processingStep === "ready" && previewData) {
            return (React.createElement("div", { className: "space-y-6" },
                React.createElement("div", { className: "bg-green-50 p-4 rounded-md" },
                    React.createElement("p", { className: "text-green-700 font-medium" }, "Informaci\u00F3n validada correctamente. Por favor selecciona un puesto de trabajo y sube el CV.")),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Selecciona un puesto para evaluar el CV"),
                    React.createElement("select", { value: selectedJobPosition, onChange: function (e) { return setSelectedJobPosition(e.target.value); }, className: "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" }, jobPositions.map(function (job) { return (React.createElement("option", { key: job.id, value: job.id }, job.title)); }))),
                React.createElement("div", null,
                    React.createElement("h3", { className: "text-lg font-medium text-gray-900" }, "Informaci\u00F3n a enviar:"),
                    React.createElement("div", { className: "mt-3 bg-gray-50 p-4 rounded-md" },
                        React.createElement("p", null,
                            React.createElement("span", { className: "font-medium" }, "Nombre:"),
                            " ",
                            previewData.candidateData.name),
                        React.createElement("p", null,
                            React.createElement("span", { className: "font-medium" }, "Email:"),
                            " ",
                            previewData.candidateData.email),
                        React.createElement("p", null,
                            React.createElement("span", { className: "font-medium" }, "Habilidades:"),
                            " ",
                            previewData.candidateData.skills.join(', ')),
                        React.createElement("p", null,
                            React.createElement("span", { className: "font-medium" }, "Puesto a evaluar:"),
                            " ",
                            ((_a = jobPositions.find(function (j) { return j.id === selectedJobPosition; })) === null || _a === void 0 ? void 0 : _a.title) || 'No seleccionado'))),
                React.createElement("div", { className: "flex justify-between" },
                    React.createElement("button", { type: "button", onClick: function () { return setProcessingStep("preview"); }, className: "px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50" }, "Volver a editar"),
                    React.createElement("button", { type: "submit", disabled: loading, onClick: handleSubmit, className: "px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700" }, loading ? 'Procesando...' : 'Subir y analizar CV'))));
        }
        return null;
    };
    return (React.createElement("div", { className: "bg-white rounded-lg shadow-sm p-6" },
        React.createElement("h1", { className: "text-2xl font-bold text-gray-900 mb-4" }, "Subir CV"),
        React.createElement("p", { className: "text-gray-600 mb-6" }, "Sube un CV en formato PDF o DOCX para analizarlo y encontrar las mejores oportunidades."),
        error && (React.createElement("div", { className: "bg-red-50 text-red-700 p-4 rounded-md mb-6 text-sm" }, error)),
        React.createElement("form", { className: "space-y-4" }, renderForm()),
        processingStep === "initial" && !loading && (React.createElement("div", { className: "mt-6" },
            React.createElement("h2", { className: "text-lg font-medium text-gray-900 mb-2" }, "\u00BFQu\u00E9 sucede despu\u00E9s?"),
            React.createElement("ul", { className: "list-disc list-inside text-gray-600 space-y-1" },
                React.createElement("li", null, "Tu CV ser\u00E1 analizado autom\u00E1ticamente"),
                React.createElement("li", null, "Podr\u00E1s revisar y editar la informaci\u00F3n extra\u00EDda"),
                React.createElement("li", null, "Se evaluar\u00E1 el perfil contra los requisitos del puesto"),
                React.createElement("li", null, "Recibir\u00E1s una puntuaci\u00F3n y retroalimentaci\u00F3n detallada"))))));
}
exports["default"] = CVUpload;
