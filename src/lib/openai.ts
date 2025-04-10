import { type JobPosition } from './firebase';

interface CVAnalysis {
  name: string;
  title: string;
  birthDate: string;
  age: number | null;
  email: string;
  phone: string;
  experience: string;
  location: string;
  skills: string[];
  summary: string;
  score: number;
  feedback: string;
}

export async function analyzeCVWithGPT(cvText: string, jobPosition: JobPosition): Promise<CVAnalysis> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('Clave de API de OpenAI no configurada');
    }

    const prompt = `
      Analiza este CV y los requisitos del puesto, luego extrae la información y proporciona una puntuación.
      
      Requisitos del Puesto:
      Título: ${jobPosition.title}
      Descripción: ${jobPosition.description}
      Habilidades Requeridas: ${jobPosition.requirements.skills.join(', ')}
      Experiencia: ${jobPosition.requirements.experience || 'No especificada'}
      Educación: ${jobPosition.requirements.education || 'No especificada'}
      
      Texto del CV:
      ${cvText}
      
      Por favor, extrae y analiza la siguiente información en formato JSON:
      1. Nombre completo del candidato
      2. Título o puesto actual
      3. Fecha de nacimiento (si está disponible)
      4. Edad (si está disponible o se puede calcular)
      5. Correo electrónico
      6. Número de teléfono (preferentemente WhatsApp)
      7. Ubicación (ciudad/provincia)
      8. Experiencia laboral (resumen de empresas y períodos)
      9. Habilidades principales (array de strings)
      10. Resumen profesional (breve descripción del perfil)
      11. Puntuación (0-100) basada en qué tan bien el candidato cumple con los requisitos del puesto
      12. Retroalimentación explicando la puntuación y la adecuación al puesto
      
      Formatea tu respuesta como JSON válido así:
      {
        "name": "Nombre Completo",
        "title": "Título o Puesto Actual",
        "birthDate": "DD/MM/YYYY o No especificada",
        "age": null o número,
        "email": "correo@ejemplo.com",
        "phone": "número de teléfono",
        "location": "Ciudad, Provincia",
        "experience": "Resumen de experiencia",
        "skills": ["Habilidad 1", "Habilidad 2", ...],
        "summary": "Resumen profesional",
        "score": 85,
        "feedback": "Explicación detallada"
      }
      
      Si algún dato no está disponible en el CV, usa valores por defecto apropiados o indica "No especificado".
      Para la edad, usa null si no está disponible.
      El resumen debe ser conciso pero informativo.
      Las habilidades deben ser identificadas basándose en el contexto y la experiencia mencionada.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
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
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error de API OpenAI: ${error.error?.message || 'Error desconocido'}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    // Validar el formato de la respuesta
    if (!result.name || !result.email || !result.score) {
      throw new Error('Formato de respuesta inválido de OpenAI');
    }

    return {
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
      feedback: result.feedback || '',
    };

  } catch (error) {
    console.error('Error analizando CV:', error);
    throw new Error('Error al analizar CV: ' + (error instanceof Error ? error.message : 'Error desconocido'));
  }
}
