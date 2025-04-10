'use client';

import { useState, useEffect } from 'react';
import { type CV, type Candidate } from '../lib/firebase';

interface CompleteCVData extends CV {
  candidate: Candidate;
  analysis?: {
    score: number;
    feedback: string;
  };
}

function formatDate(timestamp: { seconds: number } | undefined): string {
  if (!timestamp?.seconds) {
    return 'Fecha no disponible';
  }
  return new Date(timestamp.seconds * 1000).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function CVList() {
  const [cvs, setCvs] = useState<CompleteCVData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCVs = async () => {
    try {
      const response = await fetch('/api/cv');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener los CVs');
      }

      setCvs(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los CVs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cvId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este CV?')) {
      return;
    }

    try {
      const response = await fetch(`/api/cv?id=${cvId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar el CV');
      }

      // Actualizar la lista después de eliminar
      await fetchCVs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el CV');
    }
  };

  useEffect(() => {
    fetchCVs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700">
        <h3 className="text-sm font-medium">Error</h3>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  if (cvs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay CVs cargados aún.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {cvs.map((cv) => (
        <div key={cv.id} className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {cv.candidate.name}
              </h3>
              <p className="text-sm text-gray-600">{cv.candidate.title || 'Sin título especificado'}</p>
            </div>
            <button
              onClick={() => cv.id && handleDelete(cv.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Eliminar
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Información de Contacto</h4>
              <dl className="mt-2 text-sm text-gray-600">
                <div className="mt-1">
                  <dt className="inline font-medium">Email:</dt>
                  <dd className="inline ml-1">{cv.candidate.email}</dd>
                </div>
                {cv.candidate.phone && (
                  <div className="mt-1">
                    <dt className="inline font-medium">Teléfono:</dt>
                    <dd className="inline ml-1">{cv.candidate.phone}</dd>
                  </div>
                )}
                {cv.candidate.location && (
                  <div className="mt-1">
                    <dt className="inline font-medium">Ubicación:</dt>
                    <dd className="inline ml-1">{cv.candidate.location}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700">Detalles</h4>
              <dl className="mt-2 text-sm text-gray-600">
                {cv.candidate.birthDate && (
                  <div className="mt-1">
                    <dt className="inline font-medium">Fecha de Nacimiento:</dt>
                    <dd className="inline ml-1">{cv.candidate.birthDate}</dd>
                  </div>
                )}
                {cv.candidate.age && (
                  <div className="mt-1">
                    <dt className="inline font-medium">Edad:</dt>
                    <dd className="inline ml-1">{cv.candidate.age} años</dd>
                  </div>
                )}
                {cv.candidate.experience && (
                  <div className="mt-1">
                    <dt className="inline font-medium">Experiencia:</dt>
                    <dd className="inline ml-1">{cv.candidate.experience}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {cv.candidate.skills.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Habilidades</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {cv.candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {cv.candidate.summary && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Resumen</h4>
              <p className="mt-1 text-sm text-gray-600">{cv.candidate.summary}</p>
            </div>
          )}

          {cv.analysis && (
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center">
                <h4 className="text-sm font-medium text-gray-700">Puntuación</h4>
                <span className={`ml-2 text-sm font-semibold ${
                  cv.analysis.score >= 70 ? 'text-green-600' :
                  cv.analysis.score >= 50 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {cv.analysis.score}%
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{cv.analysis.feedback}</p>
            </div>
          )}

          <div className="mt-4 text-xs text-gray-500">
            Subido el {formatDate(cv.createdAt)}
          </div>
        </div>
      ))}
    </div>
  );
}
