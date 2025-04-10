'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
function CVPreview(_a) {
    var candidate = _a.candidate, onEdit = _a.onEdit, onCancel = _a.onCancel, onConfirm = _a.onConfirm;
    var _b = react_1.useState('info'), activeTab = _b[0], setActiveTab = _b[1];
    var handleSkillsChange = function (skillsText) {
        var skills = skillsText.split(',')
            .map(function (s) { return s.trim(); })
            .filter(function (s) { return s.length > 0; });
        onEdit('skills', skills);
    };
    return (React.createElement("div", { className: "bg-white rounded-lg shadow-sm overflow-hidden" },
        React.createElement("div", { className: "border-b border-gray-200" },
            React.createElement("div", { className: "p-4 sm:p-6" },
                React.createElement("div", { className: "flex items-center justify-between" },
                    React.createElement("h2", { className: "text-lg font-medium text-gray-900" }, "Previsualizaci\u00F3n de CV"),
                    React.createElement("div", { className: "flex space-x-2" },
                        React.createElement("button", { onClick: onCancel, className: "px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50" }, "Cancelar"),
                        React.createElement("button", { onClick: onConfirm, className: "px-3 py-1 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700" }, "Confirmar"))),
                React.createElement("p", { className: "mt-1 text-sm text-gray-500" }, "Revisa y edita la informaci\u00F3n extra\u00EDda del CV")),
            React.createElement("div", { className: "border-b border-gray-200" },
                React.createElement("nav", { className: "-mb-px flex", "aria-label": "Tabs" },
                    React.createElement("button", { onClick: function () { return setActiveTab('info'); }, className: (activeTab === 'info'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300') + " w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm" }, "Informaci\u00F3n Personal"),
                    React.createElement("button", { onClick: function () { return setActiveTab('skills'); }, className: (activeTab === 'skills'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300') + " w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm" }, "Habilidades"),
                    React.createElement("button", { onClick: function () { return setActiveTab('experience'); }, className: (activeTab === 'experience'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300') + " w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm" }, "Experiencia")))),
        React.createElement("div", { className: "p-4 sm:p-6" },
            activeTab === 'info' && (React.createElement("div", { className: "space-y-6" },
                React.createElement("div", { className: "grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6" },
                    React.createElement("div", { className: "sm:col-span-3" },
                        React.createElement("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700" }, "Nombre completo"),
                        React.createElement("div", { className: "mt-1" },
                            React.createElement("input", { type: "text", id: "name", value: candidate.name, onChange: function (e) { return onEdit('name', e.target.value); }, className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" }))),
                    React.createElement("div", { className: "sm:col-span-3" },
                        React.createElement("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700" }, "Cargo o T\u00EDtulo"),
                        React.createElement("div", { className: "mt-1" },
                            React.createElement("input", { type: "text", id: "title", value: candidate.title || '', onChange: function (e) { return onEdit('title', e.target.value); }, className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" }))),
                    React.createElement("div", { className: "sm:col-span-3" },
                        React.createElement("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700" }, "Correo electr\u00F3nico"),
                        React.createElement("div", { className: "mt-1" },
                            React.createElement("input", { type: "email", id: "email", value: candidate.email, onChange: function (e) { return onEdit('email', e.target.value); }, className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" }))),
                    React.createElement("div", { className: "sm:col-span-3" },
                        React.createElement("label", { htmlFor: "phone", className: "block text-sm font-medium text-gray-700" }, "Tel\u00E9fono"),
                        React.createElement("div", { className: "mt-1" },
                            React.createElement("input", { type: "text", id: "phone", value: candidate.phone || '', onChange: function (e) { return onEdit('phone', e.target.value); }, className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" }))),
                    React.createElement("div", { className: "sm:col-span-3" },
                        React.createElement("label", { htmlFor: "location", className: "block text-sm font-medium text-gray-700" }, "Ubicaci\u00F3n"),
                        React.createElement("div", { className: "mt-1" },
                            React.createElement("input", { type: "text", id: "location", value: candidate.location || '', onChange: function (e) { return onEdit('location', e.target.value); }, className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" }))),
                    React.createElement("div", { className: "sm:col-span-3" },
                        React.createElement("label", { htmlFor: "birthDate", className: "block text-sm font-medium text-gray-700" }, "Fecha de nacimiento"),
                        React.createElement("div", { className: "mt-1" },
                            React.createElement("input", { type: "text", id: "birthDate", placeholder: "DD/MM/AAAA", value: candidate.birthDate || '', onChange: function (e) { return onEdit('birthDate', e.target.value); }, className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" })))))),
            activeTab === 'skills' && (React.createElement("div", { className: "space-y-6" },
                React.createElement("div", null,
                    React.createElement("label", { htmlFor: "skills", className: "block text-sm font-medium text-gray-700" }, "Habilidades (separadas por comas)"),
                    React.createElement("div", { className: "mt-1" },
                        React.createElement("input", { type: "text", id: "skills", value: candidate.skills.join(', '), onChange: function (e) { return handleSkillsChange(e.target.value); }, className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" }))),
                React.createElement("div", null,
                    React.createElement("h3", { className: "text-sm font-medium text-gray-700" }, "Vista previa de habilidades"),
                    React.createElement("div", { className: "mt-2 flex flex-wrap gap-2" }, candidate.skills.map(function (skill, index) { return (React.createElement("span", { key: index, className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" }, skill)); })),
                    candidate.skills.length === 0 && (React.createElement("p", { className: "mt-2 text-sm text-gray-500 italic" }, "No se han detectado habilidades"))))),
            activeTab === 'experience' && (React.createElement("div", { className: "space-y-6" },
                React.createElement("div", null,
                    React.createElement("label", { htmlFor: "experience", className: "block text-sm font-medium text-gray-700" }, "Experiencia"),
                    React.createElement("div", { className: "mt-1" },
                        React.createElement("textarea", { id: "experience", rows: 4, value: candidate.experience || '', onChange: function (e) { return onEdit('experience', e.target.value); }, className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" }))),
                React.createElement("div", null,
                    React.createElement("label", { htmlFor: "summary", className: "block text-sm font-medium text-gray-700" }, "Resumen profesional"),
                    React.createElement("div", { className: "mt-1" },
                        React.createElement("textarea", { id: "summary", rows: 4, value: candidate.summary || '', onChange: function (e) { return onEdit('summary', e.target.value); }, className: "shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" }))))))));
}
exports["default"] = CVPreview;
