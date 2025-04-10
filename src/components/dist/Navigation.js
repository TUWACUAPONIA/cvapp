'use client';
"use strict";
exports.__esModule = true;
var link_1 = require("next/link");
var navigation_1 = require("next/navigation");
var navigation = [
    {
        name: 'Inicio',
        href: '/',
        description: 'Página principal'
    },
    {
        name: 'Subir CV',
        href: '/upload',
        description: 'Cargar y analizar nuevos CVs'
    },
    {
        name: 'Dashboard',
        href: '/dashboard',
        description: 'Ver y gestionar CVs y puestos'
    },
    {
        name: 'Prueba',
        href: '/test',
        description: 'Probar extracción de texto'
    }
];
function Navigation() {
    var pathname = navigation_1.usePathname();
    return (React.createElement("nav", { className: "bg-white shadow" },
        React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
            React.createElement("div", { className: "flex justify-between h-16" },
                React.createElement("div", { className: "flex" },
                    React.createElement("div", { className: "flex-shrink-0 flex items-center" },
                        React.createElement("span", { className: "text-xl font-bold text-blue-600" }, "AppCV")),
                    React.createElement("div", { className: "hidden sm:ml-6 sm:flex sm:space-x-8" }, navigation.map(function (item) {
                        var isActive = pathname === item.href;
                        return (React.createElement(link_1["default"], { key: item.href, href: item.href, className: "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium " + (isActive
                                ? 'border-blue-500 text-gray-900'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'), title: item.description }, item.name));
                    }))))),
        React.createElement("div", { className: "sm:hidden" },
            React.createElement("div", { className: "pt-2 pb-3 space-y-1" }, navigation.map(function (item) {
                var isActive = pathname === item.href;
                return (React.createElement(link_1["default"], { key: item.href, href: item.href, className: "block pl-3 pr-4 py-2 border-l-4 text-base font-medium " + (isActive
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'), title: item.description }, item.name));
            })))));
}
exports["default"] = Navigation;
