"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

console.log("Ejecutando prueba.js..."); // Log inicial

try {
  var testConnection = function testConnection() {
    var dummyImageBuffer, _ref, _ref2, result;

    return regeneratorRuntime.async(function testConnection$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("Iniciando prueba de conexión a Google Vision...");
            _context.prev = 1;
            // Intentar una operación simple (detección de texto en una imagen vacía o dummy)
            dummyImageBuffer = Buffer.from(''); // Buffer vacío

            _context.next = 5;
            return regeneratorRuntime.awrap(client.documentTextDetection({
              image: {
                content: dummyImageBuffer
              },
              features: [{
                type: 'DOCUMENT_TEXT_DETECTION'
              }] // Especificar la característica requerida

            }));

          case 5:
            _ref = _context.sent;
            _ref2 = _slicedToArray(_ref, 1);
            result = _ref2[0];
            // Si no lanza error, la autenticación y conexión básica funcionan.
            console.log("Prueba de conexión a Google Vision exitosa (puede no detectar texto, es normal):", result);
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](1);
            console.error("Error durante la prueba de conexión a Google Vision:", _context.t0);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 11]]);
  }; // Llamar a la función de prueba solo si la inicialización fue exitosa


  console.log("Cargando @google-cloud/vision...");

  var _require = require('@google-cloud/vision'),
      ImageAnnotatorClient = _require.ImageAnnotatorClient;

  console.log("@google-cloud/vision cargado.");
  console.log("Cargando credenciales..."); // Asegúrate de que la ruta al archivo JSON sea correcta y relativa a prueba.js

  var credentials = require('./lectura-de-cvs-c6fbf04eb10f.json');

  console.log("Credenciales cargadas.");
  console.log("Inicializando cliente de Google Vision...");
  var client = new ImageAnnotatorClient({
    credentials: credentials
  });
  console.log("Cliente de Google Vision inicializado.");
  testConnection();
} catch (initializationError) {
  // Capturar errores durante require() o la inicialización del cliente
  console.error("Error durante la inicialización o carga de módulos:", initializationError);
}