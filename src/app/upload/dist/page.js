"use strict";
exports.__esModule = true;
var CVUpload_1 = require("../../components/CVUpload");
var ManualCVForm_1 = require("../../components/ManualCVForm");
function UploadPage() {
    return (React.createElement("main", { className: "min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12" },
        React.createElement("div", { className: "max-w-4xl mx-auto px-4" },
            React.createElement("div", { className: "text-center mb-8" },
                React.createElement("h1", { className: "text-3xl font-bold text-gray-900" }, "Cargar CV"),
                React.createElement("p", { className: "mt-2 text-gray-600" }, "Sube el CV de un candidato o ingr\u00E9salo manualmente")),
            React.createElement("div", { className: "space-y-8" },
                React.createElement("div", { className: "bg-white rounded-lg shadow p-6" },
                    React.createElement("h2", { className: "text-xl font-semibold text-gray-900 mb-4" }, "Carga Autom\u00E1tica"),
                    React.createElement(CVUpload_1["default"], null)),
                React.createElement(ManualCVForm_1["default"], null)))));
}
exports["default"] = UploadPage;
