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
var emptyForm = {
    title: '',
    description: '',
    requirements: {
        skills: '',
        experience: '',
        education: ''
    },
    location: ''
};
function JobPositions() {
    var _this = this;
    var _a = react_1.useState([]), positions = _a[0], setPositions = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var _d = react_1.useState(false), showForm = _d[0], setShowForm = _d[1];
    var _e = react_1.useState(emptyForm), formData = _e[0], setFormData = _e[1];
    var _f = react_1.useState(null), editingId = _f[0], setEditingId = _f[1];
    var fetchPositions = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    return [4 /*yield*/, fetch('/api/job-positions')];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.error || 'Error al obtener los puestos');
                    }
                    setPositions(data.data);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : 'Error al cargar los puestos');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        fetchPositions();
    }, []);
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var jobData, url, response, data, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    jobData = {
                        title: formData.title,
                        description: formData.description,
                        requirements: {
                            skills: formData.requirements.skills.split(',').map(function (s) { return s.trim(); }),
                            experience: formData.requirements.experience || null,
                            education: formData.requirements.education || null
                        },
                        location: formData.location || null
                    };
                    url = editingId
                        ? "/api/job-positions?id=" + editingId
                        : '/api/job-positions';
                    return [4 /*yield*/, fetch(url, {
                            method: editingId ? 'PUT' : 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(jobData)
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.error || 'Error al guardar el puesto');
                    }
                    // Refresh positions list
                    return [4 /*yield*/, fetchPositions()];
                case 4:
                    // Refresh positions list
                    _a.sent();
                    // Reset form
                    setFormData(emptyForm);
                    setShowForm(false);
                    setEditingId(null);
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    setError(err_2 instanceof Error ? err_2.message : 'Error al guardar el puesto');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleEdit = function (position) {
        if (!position.id)
            return;
        setFormData({
            title: position.title,
            description: position.description,
            requirements: {
                skills: position.requirements.skills.join(', '),
                experience: position.requirements.experience || '',
                education: position.requirements.education || ''
            },
            location: position.location || ''
        });
        setEditingId(position.id);
        setShowForm(true);
    };
    var handleDelete = function (id) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm('¿Estás seguro de que deseas eliminar este puesto?')) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, fetch("/api/job-positions?id=" + id, {
                            method: 'DELETE'
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!response.ok) {
                        throw new Error(data.error || 'Error al eliminar el puesto');
                    }
                    return [4 /*yield*/, fetchPositions()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_3 = _a.sent();
                    setError(err_3 instanceof Error ? err_3.message : 'Error al eliminar el puesto');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    if (loading) {
        return React.createElement("div", { className: "text-center py-4" }, "Cargando puestos publicados...");
    }
    if (error) {
        return React.createElement("div", { className: "text-red-600 py-4" }, error);
    }
    return (React.createElement("div", { className: "space-y-6" },
        React.createElement("div", { className: "flex justify-between items-center" },
            React.createElement("h3", { className: "text-lg font-medium text-gray-900" },
                positions.length,
                " ",
                positions.length === 1 ? 'puesto publicado' : 'puestos publicados'),
            React.createElement("button", { onClick: function () {
                    setFormData(emptyForm);
                    setEditingId(null);
                    setShowForm(!showForm);
                }, className: "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors" }, showForm ? 'Cancelar' : 'Nuevo Puesto')),
        showForm && (React.createElement("form", { onSubmit: handleSubmit, className: "bg-white p-6 rounded-lg shadow-sm border border-gray-200" },
            React.createElement("div", { className: "space-y-4" },
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "T\u00EDtulo"),
                    React.createElement("input", { type: "text", value: formData.title, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { title: e.target.value })); }, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", required: true })),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Descripci\u00F3n"),
                    React.createElement("textarea", { value: formData.description, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { description: e.target.value })); }, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", rows: 3, required: true })),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Habilidades (separadas por comas)"),
                    React.createElement("input", { type: "text", value: formData.requirements.skills, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { requirements: __assign(__assign({}, formData.requirements), { skills: e.target.value }) })); }, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", required: true })),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Experiencia"),
                    React.createElement("input", { type: "text", value: formData.requirements.experience, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { requirements: __assign(__assign({}, formData.requirements), { experience: e.target.value }) })); }, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" })),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Educaci\u00F3n"),
                    React.createElement("input", { type: "text", value: formData.requirements.education, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { requirements: __assign(__assign({}, formData.requirements), { education: e.target.value }) })); }, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" })),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-gray-700" }, "Ubicaci\u00F3n"),
                    React.createElement("input", { type: "text", value: formData.location, onChange: function (e) { return setFormData(__assign(__assign({}, formData), { location: e.target.value })); }, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" })),
                React.createElement("div", { className: "flex justify-end space-x-3" },
                    React.createElement("button", { type: "button", onClick: function () {
                            setFormData(emptyForm);
                            setShowForm(false);
                            setEditingId(null);
                        }, className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" }, "Cancelar"),
                    React.createElement("button", { type: "submit", className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" },
                        editingId ? 'Actualizar' : 'Crear',
                        " Puesto"))))),
        React.createElement("div", { className: "space-y-6" },
            positions.map(function (position) { return (React.createElement("div", { key: position.id, className: "bg-white shadow rounded-lg p-6 border border-gray-200" },
                React.createElement("div", { className: "flex justify-between items-start" },
                    React.createElement("h3", { className: "text-lg font-medium text-gray-900" }, position.title),
                    React.createElement("div", { className: "space-x-2" },
                        React.createElement("button", { onClick: function () { return position.id && handleEdit(position); }, className: "text-blue-600 hover:text-blue-800 text-sm font-medium" }, "Editar"),
                        React.createElement("button", { onClick: function () { return position.id && handleDelete(position.id); }, className: "text-red-600 hover:text-red-800 text-sm font-medium" }, "Eliminar"))),
                React.createElement("p", { className: "mt-2 text-gray-600" }, position.description),
                React.createElement("div", { className: "mt-4" },
                    React.createElement("h4", { className: "text-sm font-medium text-gray-900" }, "Requisitos:"),
                    React.createElement("ul", { className: "mt-2 space-y-2" },
                        React.createElement("li", { className: "text-sm text-gray-600" },
                            React.createElement("span", { className: "font-medium" }, "Habilidades:"),
                            ' ',
                            position.requirements.skills.join(', ')),
                        position.requirements.experience && (React.createElement("li", { className: "text-sm text-gray-600" },
                            React.createElement("span", { className: "font-medium" }, "Experiencia:"),
                            ' ',
                            position.requirements.experience)),
                        position.requirements.education && (React.createElement("li", { className: "text-sm text-gray-600" },
                            React.createElement("span", { className: "font-medium" }, "Educaci\u00F3n:"),
                            ' ',
                            position.requirements.education)))),
                position.location && (React.createElement("div", { className: "mt-4" },
                    React.createElement("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" }, position.location))))); }),
            positions.length === 0 && !showForm && (React.createElement("div", { className: "text-center text-gray-500 py-4" }, "No hay puestos publicados. Haz clic en \"Nuevo Puesto\" para crear uno.")))));
}
exports["default"] = JobPositions;
