'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
function OCRStatus(_a) {
    var isProcessing = _a.isProcessing, _b = _a.progress, progress = _b === void 0 ? 0 : _b, message = _a.message;
    var _c = react_1.useState('.'), dots = _c[0], setDots = _c[1];
    react_1.useEffect(function () {
        if (!isProcessing)
            return;
        var interval = setInterval(function () {
            setDots(function (prev) {
                if (prev === '...')
                    return '.';
                return prev + '.';
            });
        }, 500);
        return function () { return clearInterval(interval); };
    }, [isProcessing]);
    if (!isProcessing)
        return null;
    return (React.createElement("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4" },
        React.createElement("div", { className: "flex items-start" },
            React.createElement("div", { className: "flex-shrink-0" },
                React.createElement("svg", { className: "h-5 w-5 text-yellow-400", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor" },
                    React.createElement("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" }))),
            React.createElement("div", { className: "ml-3 flex-1" },
                React.createElement("h3", { className: "text-sm font-medium text-yellow-800" }, "Procesamiento con OCR en progreso"),
                React.createElement("div", { className: "mt-2 text-sm text-yellow-700" },
                    React.createElement("p", null,
                        message || 'El documento está siendo procesado con reconocimiento óptico de caracteres',
                        React.createElement("span", { className: "inline-block w-6" }, dots))),
                progress > 0 && (React.createElement("div", { className: "mt-3" },
                    React.createElement("div", { className: "relative" },
                        React.createElement("div", { className: "overflow-hidden h-2 text-xs flex rounded bg-yellow-200" },
                            React.createElement("div", { style: { width: progress + "%" }, className: "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500 transition-all duration-500" }))),
                    React.createElement("div", { className: "text-xs text-yellow-700 mt-1 text-right" },
                        progress,
                        "%")))))));
}
exports["default"] = OCRStatus;
