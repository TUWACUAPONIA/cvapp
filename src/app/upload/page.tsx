import CVUpload from '../../components/CVUpload';
import ManualCVForm from '../../components/ManualCVForm';

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cargar CV</h1>
          <p className="mt-2 text-gray-600">
            Sube el CV de un candidato o ingrésalo manualmente
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Carga Automática</h2>
            <CVUpload />
          </div>

          <ManualCVForm />
        </div>
      </div>
    </main>
  );
}
