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
exports.analyzeCVWithGPT = void 0;
function analyzeCVWithGPT(cvText, jobPosition) {
    var _a;
    return __awaiter(this, void 0, Promise, function () {
        var apiKey, prompt, response, error, data, result, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    apiKey = process.env.OPENAI_API_KEY;
                    if (!apiKey) {
                        throw new Error('Clave de API de OpenAI no configurada');
                    }
                    prompt = "\n      Analiza este CV y los requisitos del puesto, luego extrae la informaci\u00F3n y proporciona una puntuaci\u00F3n.\n      \n      Requisitos del Puesto:\n      T\u00EDtulo: " + jobPosition.title + "\n      Descripci\u00F3n: " + jobPosition.description + "\n      Habilidades Requeridas: " + jobPosition.requirements.skills.join(', ') + "\n      Experiencia: " + (jobPosition.requirements.experience || 'No especificada') + "\n      Educaci\u00F3n: " + (jobPosition.requirements.education || 'No especificada') + "\n      \n      Texto del CV:\n      " + cvText + "\n      \n      Por favor, extrae y analiza la siguiente informaci\u00F3n en formato JSON:\n      1. Nombre completo del candidato\n      2. T\u00EDtulo o puesto actual\n      3. Fecha de nacimiento (si est\u00E1 disponible)\n      4. Edad (si est\u00E1 disponible o se puede calcular)\n      5. Correo electr\u00F3nico\n      6. N\u00FAmero de tel\u00E9fono (preferentemente WhatsApp)\n      7. Ubicaci\u00F3n (ciudad/provincia)\n      8. Experiencia laboral (resumen de empresas y per\u00EDodos)\n      9. Habilidades principales (array de strings)\n      10. Resumen profesional (breve descripci\u00F3n del perfil)\n      11. Puntuaci\u00F3n (0-100) basada en qu\u00E9 tan bien el candidato cumple con los requisitos del puesto\n      12. Retroalimentaci\u00F3n explicando la puntuaci\u00F3n y la adecuaci\u00F3n al puesto\n      \n      Formatea tu respuesta como JSON v\u00E1lido as\u00ED:\n      {\n        \"name\": \"Nombre Completo\",\n        \"title\": \"T\u00EDtulo o Puesto Actual\",\n        \"birthDate\": \"DD/MM/YYYY o No especificada\",\n        \"age\": null o n\u00FAmero,\n        \"email\": \"correo@ejemplo.com\",\n        \"phone\": \"n\u00FAmero de tel\u00E9fono\",\n        \"location\": \"Ciudad, Provincia\",\n        \"experience\": \"Resumen de experiencia\",\n        \"skills\": [\"Habilidad 1\", \"Habilidad 2\", ...],\n        \"summary\": \"Resumen profesional\",\n        \"score\": 85,\n        \"feedback\": \"Explicaci\u00F3n detallada\"\n      }\n      \n      Si alg\u00FAn dato no est\u00E1 disponible en el CV, usa valores por defecto apropiados o indica \"No especificado\".\n      Para la edad, usa null si no est\u00E1 disponible.\n      El resumen debe ser conciso pero informativo.\n      Las habilidades deben ser identificadas bas\u00E1ndose en el contexto y la experiencia mencionada.\n    ";
                    return [4 /*yield*/, fetch('https://api.openai.com/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer " + apiKey
                            },
                            body: JSON.stringify({
                                model: 'gpt-4-turbo-preview',
                                messages: [
                                    {
                                        role: 'system',
                                        content: 'Eres un asistente profesional de RRHH analizando CVs. Extrae información con precisión y proporciona evaluaciones justas basadas en los requisitos del puesto.'
                                    },
                                    {
                                        role: 'user',
                                        content: prompt
                                    }
                                ],
                                temperature: 0.3,
                                max_tokens: 1000,
                                response_format: { type: "json_object" }
                            })
                        })];
                case 1:
                    response = _b.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    error = _b.sent();
                    throw new Error("Error de API OpenAI: " + (((_a = error.error) === null || _a === void 0 ? void 0 : _a.message) || 'Error desconocido'));
                case 3: return [4 /*yield*/, response.json()];
                case 4:
                    data = _b.sent();
                    result = JSON.parse(data.choices[0].message.content);
                    // Validar el formato de la respuesta
                    if (!result.name || !result.email || !result.score) {
                        throw new Error('Formato de respuesta inválido de OpenAI');
                    }
                    return [2 /*return*/, {
                            name: result.name,
                            title: result.title || 'No especificado',
                            birthDate: result.birthDate || 'No especificada',
                            age: result.age || null,
                            email: result.email,
                            phone: result.phone || '',
                            location: result.location || '',
                            experience: result.experience || '',
                            skills: result.skills || [],
                            summary: result.summary || '',
                            score: result.score,
                            feedback: result.feedback || ''
                        }];
                case 5:
                    error_1 = _b.sent();
                    console.error('Error analizando CV:', error_1);
                    throw new Error('Error al analizar CV: ' + (error_1 instanceof Error ? error_1.message : 'Error desconocido'));
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.analyzeCVWithGPT = analyzeCVWithGPT;
