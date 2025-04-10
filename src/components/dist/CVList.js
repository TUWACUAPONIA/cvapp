'use client';
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
var react_1 = require("react");
function formatDate(timestamp) {
    if (!(timestamp === null || timestamp === void 0 ? void 0 : timestamp.seconds)) {
        return 'Fecha no disponible';
    }
    return new Date(timestamp.seconds * 1000).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
function CVList() {
    var _this = this;
    var _a = react_1.useState([]), cvs = _a[0], setCvs = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var fetchCVs = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    return [4 /*yield*/, fetch('/api/cv')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.error || 'Error al obtener los CVs');
                    }
                    setCvs(data.data);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : 'Error al cargar los CVs');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function (cvId) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('¿Estás seguro de que deseas eliminar este CV?')) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, fetch("/api/cv?id=" + cvId, {
                            method: 'DELETE'
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.error || 'Error al eliminar el CV');
                    }
                    // Actualizar la lista después de eliminar
                    return [4 /*yield*/, fetchCVs()];
                case 4:
                    // Actualizar la lista después de eliminar
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    setError(err_2 instanceof Error ? err_2.message : 'Error al eliminar el CV');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        fetchCVs();
    }, []);
    if (loading) {
        return (React.createElement("div", { className: "flex justify-center items-center min-h-[200px]" },
            React.createElement("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" })));
    }
    if (error) {
        return (React.createElement("div", { className: "bg-red-50 p-4 rounded-md text-red-700" },
            React.createElement("h3", { className: "text-sm font-medium" }, "Error"),
            React.createElement("p", { className: "mt-1 text-sm" }, error)));
    }
    if (cvs.length === 0) {
        return (React.createElement("div", { className: "text-center py-8 text-gray-500" }, "No hay CVs cargados a\u00FAn."));
    }
    return (React.createElement("div", { className: "space-y-6" }, cvs.map(function (cv) { return (React.createElement("div", { key: cv.id, className: "bg-white shadow rounded-lg p-6" },
        React.createElement("div", { className: "flex justify-between items-start" },
            React.createElement("div", null,
                React.createElement("h3", { className: "text-lg font-semibold text-gray-900" }, cv.candidate.name),
                React.createElement("p", { className: "text-sm text-gray-600" }, cv.candidate.title || 'Sin título especificado')),
            React.createElement("button", { onClick: function () { return cv.id && handleDelete(cv.id); }, className: "text-red-600 hover:text-red-800 text-sm font-medium" }, "Eliminar")),
        React.createElement("div", { className: "mt-4 grid grid-cols-1 md:grid-cols-2 gap-4" },
            React.createElement("div", null,
                React.createElement("h4", { className: "text-sm font-medium text-gray-700" }, "Informaci\u00F3n de Contacto"),
                React.createElement("dl", { className: "mt-2 text-sm text-gray-600" },
                    React.createElement("div", { className: "mt-1" },
                        React.createElement("dt", { className: "inline font-medium" }, "Email:"),
                        React.createElement("dd", { className: "inline ml-1" }, cv.candidate.email)),
                    cv.candidate.phone && (React.createElement("div", { className: "mt-1" },
                        React.createElement("dt", { className: "inline font-medium" }, "Tel\u00E9fono:"),
                        React.createElement("dd", { className: "inline ml-1" }, cv.candidate.phone))),
                    cv.candidate.location && (React.createElement("div", { className: "mt-1" },
                        React.createElement("dt", { className: "inline font-medium" }, "Ubicaci\u00F3n:"),
                        React.createElement("dd", { className: "inline ml-1" }, cv.candidate.location))))),
            React.createElement("div", null,
                React.createElement("h4", { className: "text-sm font-medium text-gray-700" }, "Detalles"),
                React.createElement("dl", { className: "mt-2 text-sm text-gray-600" },
                    cv.candidate.birthDate && (React.createElement("div", { className: "mt-1" },
                        React.createElement("dt", { className: "inline font-medium" }, "Fecha de Nacimiento:"),
                        React.createElement("dd", { className: "inline ml-1" }, cv.candidate.birthDate))),
                    cv.candidate.age && (React.createElement("div", { className: "mt-1" },
                        React.createElement("dt", { className: "inline font-medium" }, "Edad:"),
                        React.createElement("dd", { className: "inline ml-1" },
                            cv.candidate.age,
                            " a\u00F1os"))),
                    cv.candidate.experience && (React.createElement("div", { className: "mt-1" },
                        React.createElement("dt", { className: "inline font-medium" }, "Experiencia:"),
                        React.createElement("dd", { className: "inline ml-1" }, cv.candidate.experience)))))),
        cv.candidate.skills.length > 0 && (React.createElement("div", { className: "mt-4" },
            React.createElement("h4", { className: "text-sm font-medium text-gray-700" }, "Habilidades"),
            React.createElement("div", { className: "mt-2 flex flex-wrap gap-2" }, cv.candidate.skills.map(function (skill, index) { return (React.createElement("span", { key: index, className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" }, skill)); })))),
        cv.candidate.summary && (React.createElement("div", { className: "mt-4" },
            React.createElement("h4", { className: "text-sm font-medium text-gray-700" }, "Resumen"),
            React.createElement("p", { className: "mt-1 text-sm text-gray-600" }, cv.candidate.summary))),
        cv.analysis && (React.createElement("div", { className: "mt-4 border-t pt-4" },
            React.createElement("div", { className: "flex items-center" },
                React.createElement("h4", { className: "text-sm font-medium text-gray-700" }, "Puntuaci\u00F3n"),
                React.createElement("span", { className: "ml-2 text-sm font-semibold " + (cv.analysis.score >= 70 ? 'text-green-600' :
                        cv.analysis.score >= 50 ? 'text-yellow-600' :
                            'text-red-600') },
                    cv.analysis.score,
                    "%")),
            React.createElement("p", { className: "mt-1 text-sm text-gray-600" }, cv.analysis.feedback))),
        React.createElement("div", { className: "mt-4 text-xs text-gray-500" },
            "Subido el ",
            formatDate(cv.createdAt)))); })));
}
exports["default"] = CVList;
