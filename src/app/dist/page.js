"use strict";
exports.__esModule = true;
var link_1 = require("next/link");
function QuickLink(_a) {
    var href = _a.href, title = _a.title, description = _a.description, icon = _a.icon;
    return (React.createElement(link_1["default"], { href: href, className: "relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 hover:bg-gray-50 rounded-lg shadow transition-colors" },
        React.createElement("div", null,
            React.createElement("span", { className: "rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white" }, icon)),
        React.createElement("div", { className: "mt-4" },
            React.createElement("h3", { className: "text-lg font-medium" },
                React.createElement("span", { className: "absolute inset-0", "aria-hidden": "true" }),
                title),
            React.createElement("p", { className: "mt-2 text-sm text-gray-500" }, description)),
        React.createElement("span", { className: "pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400", "aria-hidden": "true" },
            React.createElement("svg", { className: "h-6 w-6", fill: "currentColor", viewBox: "0 0 24 24" },
                React.createElement("path", { d: "M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" })))));
}
function HomePage() {
    return (React.createElement("div", { className: "min-h-screen bg-gray-50 py-8" },
        React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
            React.createElement("div", { className: "text-center" },
                React.createElement("h1", { className: "text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl" },
                    React.createElement("span", { className: "block" }, "Sistema de Gesti\u00F3n"),
                    React.createElement("span", { className: "block text-blue-600" }, "de CVs con IA")),
                React.createElement("p", { className: "mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl" }, "Analiza, eval\u00FAa y gestiona CVs de manera inteligente utilizando tecnolog\u00EDa de punta")),
            React.createElement("div", { className: "mt-16" },
                React.createElement("div", { className: "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" },
                    React.createElement(QuickLink, { href: "/upload", title: "Subir CV", description: "Carga y analiza nuevos CVs utilizando inteligencia artificial", icon: React.createElement("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" })) }),
                    React.createElement(QuickLink, { href: "/dashboard", title: "Dashboard", description: "Visualiza y gestiona todos los CVs procesados", icon: React.createElement("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" })) }),
                    React.createElement(QuickLink, { href: "/requirements", title: "Requisitos", description: "Gestiona los requisitos y perfiles de los puestos de trabajo", icon: React.createElement("svg", { className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" })) }))),
            React.createElement("div", { className: "mt-16" },
                React.createElement("div", { className: "bg-white shadow sm:rounded-lg" },
                    React.createElement("div", { className: "px-4 py-5 sm:p-6" },
                        React.createElement("h3", { className: "text-lg leading-6 font-medium text-gray-900" }, "Caracter\u00EDsticas Principales"),
                        React.createElement("div", { className: "mt-5" },
                            React.createElement("div", { className: "space-y-4" },
                                React.createElement("div", { className: "flex items-start" },
                                    React.createElement("div", { className: "flex-shrink-0" },
                                        React.createElement("svg", { className: "h-6 w-6 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }))),
                                    React.createElement("p", { className: "ml-3 text-sm text-gray-700" }, "Extracci\u00F3n autom\u00E1tica de informaci\u00F3n de CVs en PDF y DOCX")),
                                React.createElement("div", { className: "flex items-start" },
                                    React.createElement("div", { className: "flex-shrink-0" },
                                        React.createElement("svg", { className: "h-6 w-6 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }))),
                                    React.createElement("p", { className: "ml-3 text-sm text-gray-700" }, "An\u00E1lisis y evaluaci\u00F3n utilizando GPT-4")),
                                React.createElement("div", { className: "flex items-start" },
                                    React.createElement("div", { className: "flex-shrink-0" },
                                        React.createElement("svg", { className: "h-6 w-6 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }))),
                                    React.createElement("p", { className: "ml-3 text-sm text-gray-700" }, "Gesti\u00F3n completa de candidatos y requisitos"))))))))));
}
exports["default"] = HomePage;
