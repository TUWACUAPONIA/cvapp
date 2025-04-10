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
function ManualCVForm() {
    var _this = this;
    var _a = react_1.useState(false), isSubmitting = _a[0], setIsSubmitting = _a[1];
    var _b = react_1.useState({
        fullName: '',
        email: '',
        phone: '',
        education: '',
        experience: '',
        skills: '',
        languages: '',
        summary: ''
    }), formData = _b[0], setFormData = _b[1];
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, fetch('/api/cv', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(formData)
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Error al guardar el CV');
                    }
                    // Clear form after successful submission
                    setFormData({
                        fullName: '',
                        email: '',
                        phone: '',
                        education: '',
                        experience: '',
                        skills: '',
                        languages: '',
                        summary: ''
                    });
                    alert('¡CV guardado exitosamente!');
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error al enviar CV:', error_1);
                    alert('Error al guardar el CV. Por favor, intente nuevamente.');
                    return [3 /*break*/, 5];
                case 4:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
    };
    return (React.createElement("form", { onSubmit: handleSubmit, className: "space-y-6 bg-white p-6 rounded-lg shadow mt-8" },
        React.createElement("h2", { className: "text-xl font-semibold text-gray-900 mb-4" }, "Entrada Manual de CV"),
        React.createElement("div", null,
            React.createElement("label", { htmlFor: "fullName", className: "block text-sm font-medium text-gray-700" }, "Nombre Completo"),
            React.createElement("input", { type: "text", name: "fullName", id: "fullName", value: formData.fullName, onChange: handleChange, className: "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500", required: true, disabled: isSubmitting })),
        React.createElement("div", null,
            React.createElement("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700" }, "Correo Electr\u00F3nico"),
            React.createElement("input", { type: "email", name: "email", id: "email", value: formData.email, onChange: handleChange, className: "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500", required: true, disabled: isSubmitting })),
        React.createElement("div", null,
            React.createElement("label", { htmlFor: "phone", className: "block text-sm font-medium text-gray-700" }, "Tel\u00E9fono"),
            React.createElement("input", { type: "tel", name: "phone", id: "phone", value: formData.phone, onChange: handleChange, className: "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500", required: true, disabled: isSubmitting })),
        React.createElement("div", null,
            React.createElement("label", { htmlFor: "education", className: "block text-sm font-medium text-gray-700" }, "Educaci\u00F3n"),
            React.createElement("textarea", { name: "education", id: "education", value: formData.education, onChange: handleChange, rows: 3, className: "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500", required: true, disabled: isSubmitting })),
        React.createElement("div", null,
            React.createElement("label", { htmlFor: "experience", className: "block text-sm font-medium text-gray-700" }, "Experiencia Laboral"),
            React.createElement("textarea", { name: "experience", id: "experience", value: formData.experience, onChange: handleChange, rows: 4, className: "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500", required: true, disabled: isSubmitting })),
        React.createElement("div", null,
            React.createElement("label", { htmlFor: "skills", className: "block text-sm font-medium text-gray-700" }, "Habilidades"),
            React.createElement("textarea", { name: "skills", id: "skills", value: formData.skills, onChange: handleChange, rows: 3, className: "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500", required: true, disabled: isSubmitting })),
        React.createElement("div", null,
            React.createElement("label", { htmlFor: "languages", className: "block text-sm font-medium text-gray-700" }, "Idiomas"),
            React.createElement("input", { type: "text", name: "languages", id: "languages", value: formData.languages, onChange: handleChange, className: "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500", required: true, disabled: isSubmitting })),
        React.createElement("div", null,
            React.createElement("label", { htmlFor: "summary", className: "block text-sm font-medium text-gray-700" }, "Resumen del CV"),
            React.createElement("textarea", { name: "summary", id: "summary", value: formData.summary, onChange: handleChange, rows: 4, className: "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500", required: true, disabled: isSubmitting })),
        React.createElement("div", null,
            React.createElement("button", { type: "submit", className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed", disabled: isSubmitting }, isSubmitting ? 'Guardando...' : 'Guardar CV'))));
}
exports["default"] = ManualCVForm;
