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
function FirebaseTest() {
    var _this = this;
    var _a = react_1.useState(''), status = _a[0], setStatus = _a[1];
    var _b = react_1.useState(false), loading = _b[0], setLoading = _b[1];
    var testConnection = function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setStatus('Iniciando prueba de conexión...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch('/api/test-firebase')];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (response.ok) {
                        setStatus('Conexión exitosa: ' + data.message + '\n\nLogs:\n' + data.logs.join('\n'));
                    }
                    else {
                        setStatus('Error: ' + data.error + '\n\nLogs:\n' + data.logs.join('\n'));
                    }
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    setStatus('Error al realizar la prueba: ' + (error_1 instanceof Error ? error_1.message : 'Error desconocido'));
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { className: "p-4 bg-white rounded-lg shadow" },
        React.createElement("h2", { className: "text-lg font-semibold mb-4" }, "Prueba de Conexi\u00F3n Firebase"),
        React.createElement("button", { onClick: testConnection, disabled: loading, className: "px-4 py-2 rounded-md text-white " + (loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700') }, loading ? 'Probando...' : 'Probar Conexión'),
        status && (React.createElement("div", { className: "mt-4 p-4 rounded-md whitespace-pre-wrap font-mono text-sm overflow-auto max-h-[500px] " + (status.includes('Error')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : status.includes('exitosa')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200') },
            React.createElement("div", { className: "space-y-1" }, status.split('\n').map(function (line, index) { return (React.createElement("div", { key: index, className: "" + (line.includes('Error') ? 'text-red-700 font-semibold' :
                    line.includes('exitosa') ? 'text-green-700 font-semibold' :
                        line.startsWith('✓') ? 'text-green-600' :
                            line.startsWith('⚠') ? 'text-yellow-600' :
                                '') }, line)); }))))));
}
exports["default"] = FirebaseTest;
