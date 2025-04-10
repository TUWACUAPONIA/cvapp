'use client';

import { useEffect, useState } from 'react';
import { type JobPosition } from '../lib/firebase';

interface JobFormData {
  title: string;
  description: string;
  requirements: {
    skills: string;
    experience: string;
    education: string;
  };
  location: string;
}

const emptyForm: JobFormData = {
  title: '',
  description: '',
  requirements: {
    skills: '',
    experience: '',
    education: ''
  },
  location: ''
};

export default function JobPositions() {
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<JobFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchPositions = async () => {
    try {
      const response = await fetch('/api/job-positions');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al obtener los puestos');
      }

      setPositions(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los puestos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        requirements: {
          skills: formData.requirements.skills.split(',').map(s => s.trim()),
          experience: formData.requirements.experience || null,
          education: formData.requirements.education || null
        },
        location: formData.location || null
      };

      const url = editingId 
        ? `/api/job-positions?id=${editingId}`
        : '/api/job-positions';
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar el puesto');
      }

      // Refresh positions list
      await fetchPositions();
      
      // Reset form
      setFormData(emptyForm);
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el puesto');
    }
  };

  const handleEdit = (position: JobPosition) => {
    if (!position.id) return;
    
    setFormData({
      title: position.title,
      description: position.description,
      requirements: {
        skills: position.requirements.skills.join(', '),
        experience: position.requirements.experience || '',
        education: position.requirements.education || ''
      },
      location: position.location || ''
    });
    setEditingId(position.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este puesto?')) {
      return;
    }

    try {
      const response = await fetch(`/api/job-positions?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar el puesto');
      }

      await fetchPositions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el puesto');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando puestos publicados...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          {positions.length} {positions.length === 1 ? 'puesto publicado' : 'puestos publicados'}
        </h3>
        <button
          onClick={() => {
            setFormData(emptyForm);
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancelar' : 'Nuevo Puesto'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Título</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Habilidades (separadas por comas)</label>
              <input
                type="text"
                value={formData.requirements.skills}
                onChange={(e) => setFormData({
                  ...formData,
                  requirements: {...formData.requirements, skills: e.target.value}
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Experiencia</label>
              <input
                type="text"
                value={formData.requirements.experience}
                onChange={(e) => setFormData({
                  ...formData,
                  requirements: {...formData.requirements, experience: e.target.value}
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Educación</label>
              <input
                type="text"
                value={formData.requirements.education}
                onChange={(e) => setFormData({
                  ...formData,
                  requirements: {...formData.requirements, education: e.target.value}
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ubicación</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setFormData(emptyForm);
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingId ? 'Actualizar' : 'Crear'} Puesto
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {positions.map((position) => (
          <div
            key={position.id}
            className="bg-white shadow rounded-lg p-6 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-gray-900">{position.title}</h3>
              <div className="space-x-2">
                <button
                  onClick={() => position.id && handleEdit(position)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => position.id && handleDelete(position.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
            
            <p className="mt-2 text-gray-600">{position.description}</p>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">Requisitos:</h4>
              <ul className="mt-2 space-y-2">
                <li className="text-sm text-gray-600">
                  <span className="font-medium">Habilidades:</span>{' '}
                  {position.requirements.skills.join(', ')}
                </li>
                {position.requirements.experience && (
                  <li className="text-sm text-gray-600">
                    <span className="font-medium">Experiencia:</span>{' '}
                    {position.requirements.experience}
                  </li>
                )}
                {position.requirements.education && (
                  <li className="text-sm text-gray-600">
                    <span className="font-medium">Educación:</span>{' '}
                    {position.requirements.education}
                  </li>
                )}
              </ul>
            </div>

            {position.location && (
              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {position.location}
                </span>
              </div>
            )}
          </div>
        ))}

        {positions.length === 0 && !showForm && (
          <div className="text-center text-gray-500 py-4">
            No hay puestos publicados. Haz clic en "Nuevo Puesto" para crear uno.
          </div>
        )}
      </div>
    </div>
  );
}
