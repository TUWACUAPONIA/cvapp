'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { extractTextFromFile } from '@/lib/document-parser';

interface PreviewData {
  candidateData: {
    name: string;
    title: string | null;
    email: string;
    phone: string | null;
    location: string | null;
    birthDate: string | null;
    age: number | null;
    experience: string | null;
    skills: string[];
    summary: string | null;
  };
  cvText: string;
  originalText: string;
}

export default function CVUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedJobPosition, setSelectedJobPosition] = useState<string>("");
  const [jobPositions, setJobPositions] = useState<any[]>([]);
  const [processingStep, setProcessingStep] = useState<string>("initial"); // initial, preview, ocr, ready
  const router = useRouter();

  // Cargar puestos de trabajo al iniciar
  useEffect(() => {
    async function fetchJobPositions() {
      try {
        const response = await fetch('/api/job-positions');
        const data = await response.json();
        if (data.success) {
          setJobPositions(data.data);
          if (data.data.length > 0) {
            setSelectedJobPosition(data.data[0].id);
          }
        }
      } catch (error) {
        console.error("Error al cargar puestos de trabajo:", error);
      }
    }
    
    fetchJobPositions();
  }, []);

  const analyzeTextWithAI = async (text: string): Promise<PreviewData['candidateData']> => {
    // Esta función simularía un análisis local básico mientras esperamos la respuesta de la API
    // En producción, esto sería reemplazado por el análisis completo de la API
    
    // Análisis básico para extraer información del texto
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/(\+?\d{1,4}[ -]?)?(\(?\d{1,}\)?[ -]?)?\d{1,}[ -]?\d{1,}[ -]?\d{1,}/);
    
    // Dividir el texto en líneas y buscar posibles nombres en las primeras líneas
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const possibleName = lines.length > 0 ? lines[0] : 'Nombre no detectado';
    
    // Extraer posibles habilidades basadas en palabras clave comunes
    const skillKeywords = ['JavaScript', 'Python', 'React', 'Node.js', 'HTML', 'CSS', 'SQL', 
                          'Java', 'C++', 'TypeScript', 'Angular', 'Vue', 'Firebase', 'AWS',
                          'MongoDB', 'Express', 'Git', 'Docker', 'Kubernetes', 'REST', 'API'];
    
    const detectedSkills = skillKeywords.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
    
    return {
      name: possibleName,
      title: lines.length > 1 ? lines[1] : null,
      email: emailMatch ? emailMatch[0] : '',
      phone: phoneMatch ? phoneMatch[0] : null,
      location: null,
      birthDate: null,
      age: null,
      experience: null,
      skills: detectedSkills,
      summary: text.substring(0, 200) + '...'
    };
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);
      setLoading(true);
      setProcessingStep("initial");

      try {
        // Intentar extracting texto normalmente
        const extractedText = await extractTextFromFile(selectedFile);
        
        // Si el texto está vacío o es muy corto, es posible que sea un PDF escaneado
        if (!extractedText || extractedText.trim().length < 50) {
          setProcessingStep("ocr");
          setError("El documento parece estar escaneado o no contiene texto extraíble. Intentando con OCR...");
          
          // En un caso real, aquí llamaríamos al endpoint de OCR
          // Por ahora simulamos una espera
          setTimeout(() => {
            // Simulación de resultado de OCR (en producción se usaría un endpoint real)
            const mockOcrResult = "Este es un texto simulado de OCR para demostración. Contiene información del CV como nombre@ejemplo.com y teléfono +123456789 JavaScript Python React";
            
            analyzeTextWithAI(mockOcrResult).then(candidateData => {
              setPreviewData({
                candidateData,
                cvText: mockOcrResult,
                originalText: mockOcrResult
              });
              setProcessingStep("preview");
              setLoading(false);
            });
          }, 2000);
          return;
        }
        
        // Análisis básico del texto para la vista previa
        const candidateData = await analyzeTextWithAI(extractedText);
        
        setPreviewData({
          candidateData,
          cvText: extractedText,
          originalText: extractedText
        });
        
        setProcessingStep("preview");
      } catch (err) {
        console.error('Error al extraer texto:', err);
        setError(err instanceof Error ? err.message : 'Error al procesar el archivo');
        setPreviewData(null);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCandidateDataChange = (field: keyof PreviewData['candidateData'], value: any) => {
    if (!previewData) return;
    
    setPreviewData({
      ...previewData,
      candidateData: {
        ...previewData.candidateData,
        [field]: value
      }
    });
  };

  const handleSkillsChange = (skillsText: string) => {
    if (!previewData) return;
    
    const skills = skillsText.split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    handleCandidateDataChange('skills', skills);
  };

  const confirmAndProceed = () => {
    if (!previewData) return;
    setProcessingStep("ready");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !previewData || !selectedJobPosition) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('cv', file);
      formData.append('candidateData', JSON.stringify(previewData.candidateData));
      formData.append('cvText', previewData.cvText);
      formData.append('jobPositionId', selectedJobPosition);

      const response = await fetch('/api/cv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el archivo');
      }

      router.push('/dashboard');
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error al subir el archivo';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (processingStep === "initial" || loading) {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Archivo CV (PDF o DOCX)
            </label>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              disabled={loading}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          
          {loading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          {processingStep === "ocr" && (
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-yellow-700">Intentando procesar el documento usando OCR. Esto puede tomar unos momentos...</p>
            </div>
          )}
        </div>
      );
    }
    
    if (processingStep === "preview" && previewData) {
      return (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-blue-700 font-medium">
              Por favor, revisa y edita la información extraída antes de continuar.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
              <input
                type="text"
                value={previewData.candidateData.name}
                onChange={(e) => handleCandidateDataChange('name', e.target.value)}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Título o puesto actual</label>
              <input
                type="text"
                value={previewData.candidateData.title || ''}
                onChange={(e) => handleCandidateDataChange('title', e.target.value)}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={previewData.candidateData.email}
                onChange={(e) => handleCandidateDataChange('email', e.target.value)}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input
                type="text"
                value={previewData.candidateData.phone || ''}
                onChange={(e) => handleCandidateDataChange('phone', e.target.value)}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Ubicación</label>
              <input
                type="text"
                value={previewData.candidateData.location || ''}
                onChange={(e) => handleCandidateDataChange('location', e.target.value)}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de nacimiento</label>
              <input
                type="text"
                placeholder="DD/MM/AAAA"
                value={previewData.candidateData.birthDate || ''}
                onChange={(e) => handleCandidateDataChange('birthDate', e.target.value)}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Experiencia</label>
              <textarea
                value={previewData.candidateData.experience || ''}
                onChange={(e) => handleCandidateDataChange('experience', e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Habilidades (separadas por comas)</label>
              <input
                type="text"
                value={previewData.candidateData.skills.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Resumen profesional</label>
              <textarea
                value={previewData.candidateData.summary || ''}
                onChange={(e) => handleCandidateDataChange('summary', e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Texto completo del CV</label>
            <textarea
              value={previewData.cvText}
              onChange={(e) => setPreviewData({...previewData, cvText: e.target.value})}
              rows={10}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreviewData(null);
                setProcessingStep("initial");
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmAndProceed}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Confirmar y continuar
            </button>
          </div>
        </div>
      );
    }
    
    if (processingStep === "ready" && previewData) {
      return (
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-md">
            <p className="text-green-700 font-medium">
              Información validada correctamente. Por favor selecciona un puesto de trabajo y sube el CV.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona un puesto para evaluar el CV
            </label>
            <select
              value={selectedJobPosition}
              onChange={(e) => setSelectedJobPosition(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {jobPositions.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">Información a enviar:</h3>
            <div className="mt-3 bg-gray-50 p-4 rounded-md">
              <p><span className="font-medium">Nombre:</span> {previewData.candidateData.name}</p>
              <p><span className="font-medium">Email:</span> {previewData.candidateData.email}</p>
              <p><span className="font-medium">Habilidades:</span> {previewData.candidateData.skills.join(', ')}</p>
              <p><span className="font-medium">Puesto a evaluar:</span> {
                jobPositions.find(j => j.id === selectedJobPosition)?.title || 'No seleccionado'
              }</p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setProcessingStep("preview")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Volver a editar
            </button>
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Procesando...' : 'Subir y analizar CV'}
            </button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Subir CV
      </h1>
      <p className="text-gray-600 mb-6">
        Sube un CV en formato PDF o DOCX para analizarlo y encontrar las mejores oportunidades.
      </p>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-4">
        {renderForm()}
      </form>

      {processingStep === "initial" && !loading && (
        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            ¿Qué sucede después?
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Tu CV será analizado automáticamente</li>
            <li>Podrás revisar y editar la información extraída</li>
            <li>Se evaluará el perfil contra los requisitos del puesto</li>
            <li>Recibirás una puntuación y retroalimentación detallada</li>
          </ul>
        </div>
      )}
    </div>
  );
}
