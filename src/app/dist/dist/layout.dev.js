"use strict";

exports.__esModule = true;
exports.metadata = void 0;

require("./globals.css");

var google_1 = require("next/font/google");

var Navigation_1 = require("../components/Navigation");

var inter = google_1.Inter({
  subsets: ['latin']
});
exports.metadata = {
  title: 'AppCV - Sistema de Gestión de CVs con IA',
  description: 'Analiza, evalúa y gestiona CVs de manera inteligente utilizando inteligencia artificial'
};

function RootLayout(_a) {
  var children = _a.children;
  return React.createElement("html", {
    lang: "es",
    className: "h-full bg-gray-50"
  }, React.createElement("body", {
    className: inter.className + " h-full"
  }, React.createElement("div", {
    className: "min-h-full"
  }, React.createElement(Navigation_1["default"], null), React.createElement("main", null, children))));
}

exports["default"] = RootLayout;