import CVList from '../../components/CVList';
import JobPositions from '../../components/JobPositions';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Panel de Control
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona los CVs, candidatos y puestos desde aquí
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sección de Puestos Publicados */}
          <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900">
                Puestos Publicados
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Lista de puestos de trabajo disponibles
              </p>
            </div>

            <div className="px-6 py-4">
              <JobPositions />
            </div>
          </div>

          {/* Sección de CVs */}
          <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900">
                CVs Cargados
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Lista de todos los CVs procesados con sus evaluaciones
              </p>
            </div>

            <div className="px-6 py-4">
              <CVList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
