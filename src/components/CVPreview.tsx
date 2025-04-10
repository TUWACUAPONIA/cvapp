'use client';

import { useState } from 'react';

interface Candidate {
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
}

interface CVPreviewProps {
  candidate: Candidate;
  onEdit: (field: keyof Candidate, value: any) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function CVPreview({ candidate, onEdit, onCancel, onConfirm }: CVPreviewProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'skills' | 'experience'>('info');

  const handleSkillsChange = (skillsText: string) => {
    const skills = skillsText.split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    onEdit('skills', skills);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Previsualización de CV</h2>
            <div className="flex space-x-2">
              <button
                onClick={onCancel}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="px-3 py-1 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                Confirmar
              </button>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">Revisa y edita la información extraída del CV</p>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('info')}
              className={`${
                activeTab === 'info'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Información Personal
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`${
                activeTab === 'skills'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Habilidades
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`${
                activeTab === 'experience'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Experiencia
            </button>
          </nav>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre completo
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="name"
                    value={candidate.name}
                    onChange={(e) => onEdit('name', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Cargo o Título
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="title"
                    value={candidate.title || ''}
                    onChange={(e) => onEdit('title', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    value={candidate.email}
                    onChange={(e) => onEdit('email', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="phone"
                    value={candidate.phone || ''}
                    onChange={(e) => onEdit('phone', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Ubicación
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="location"
                    value={candidate.location || ''}
                    onChange={(e) => onEdit('location', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                  Fecha de nacimiento
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="birthDate"
                    placeholder="DD/MM/AAAA"
                    value={candidate.birthDate || ''}
                    onChange={(e) => onEdit('birthDate', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                Habilidades (separadas por comas)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="skills"
                  value={candidate.skills.join(', ')}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">Vista previa de habilidades</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              {candidate.skills.length === 0 && (
                <p className="mt-2 text-sm text-gray-500 italic">No se han detectado habilidades</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                Experiencia
              </label>
              <div className="mt-1">
                <textarea
                  id="experience"
                  rows={4}
                  value={candidate.experience || ''}
                  onChange={(e) => onEdit('experience', e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                Resumen profesional
              </label>
              <div className="mt-1">
                <textarea
                  id="summary"
                  rows={4}
                  value={candidate.summary || ''}
                  onChange={(e) => onEdit('summary', e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}