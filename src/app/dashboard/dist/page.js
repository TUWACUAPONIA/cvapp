"use strict";
exports.__esModule = true;
var CVList_1 = require("../../components/CVList");
var JobPositions_1 = require("../../components/JobPositions");
function DashboardPage() {
    return (React.createElement("div", { className: "min-h-screen bg-gray-50 py-8" },
        React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
            React.createElement("div", { className: "mb-8" },
                React.createElement("h1", { className: "text-2xl font-bold text-gray-900" }, "Panel de Control"),
                React.createElement("p", { className: "mt-1 text-sm text-gray-500" }, "Gestiona los CVs, candidatos y puestos desde aqu\u00ED")),
            React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8" },
                React.createElement("div", { className: "bg-white shadow rounded-lg divide-y divide-gray-200" },
                    React.createElement("div", { className: "p-6" },
                        React.createElement("h2", { className: "text-lg font-medium text-gray-900" }, "Puestos Publicados"),
                        React.createElement("p", { className: "mt-1 text-sm text-gray-500" }, "Lista de puestos de trabajo disponibles")),
                    React.createElement("div", { className: "px-6 py-4" },
                        React.createElement(JobPositions_1["default"], null))),
                React.createElement("div", { className: "bg-white shadow rounded-lg divide-y divide-gray-200" },
                    React.createElement("div", { className: "p-6" },
                        React.createElement("h2", { className: "text-lg font-medium text-gray-900" }, "CVs Cargados"),
                        React.createElement("p", { className: "mt-1 text-sm text-gray-500" }, "Lista de todos los CVs procesados con sus evaluaciones")),
                    React.createElement("div", { className: "px-6 py-4" },
                        React.createElement(CVList_1["default"], null)))))));
}
exports["default"] = DashboardPage;
