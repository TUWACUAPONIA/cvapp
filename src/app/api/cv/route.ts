import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { analyzeCVWithGPT } from '../../../lib/openai';
import { parsePDF, normalizeText } from '../../../lib/pdf-parser';
import {
  uploadFileToStorage,
  createOrUpdateCandidate,
  getJobPositions,
  createCV,
  getCVs,
  deleteCV,
  getCompleteCV,
  type Candidate,
  type CV,
  type JobPosition
} from '../../../lib/firebase';

// Importaciones adicionales para la función DELETE modificada
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';

// Tamaño máximo de archivo (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

async function extractTextFromDOCX(buffer: ArrayBuffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({
      arrayBuffer: buffer
    });
    return normalizeText(result.value);
  } catch (error) {
    console.error('Error al procesar DOCX:', error);
    throw new Error('Error al procesar archivo DOCX');
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    
    // Handle manual form submission
    if (contentType === 'application/json') {
      const data = await request.json();
      
      // Create candidate data from manual form
      const candidateData: Candidate = {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        experience: data.experience,
        skills: data.skills.split(',').map((skill: string) => skill.trim()),
        title: '', // Can be derived from experience
        location: '', // Not collected in form
        birthDate: '', // Not collected in form
        age: 0, // Not collected in form
        summary: `Education: ${data.education}\nLanguages: ${data.languages}\nCertifications: ${data.certifications}`
      };

      // Create or update candidate
      const candidateId = await createOrUpdateCandidate(candidateData);

      // Create CV record
      const cvData: CV = {
        fileName: 'manual-entry.txt',
        fileUrl: '', // No file for manual entry
        content: JSON.stringify(data, null, 2), // Store form data as content
        candidateId: candidateId
      };

      const cvId = await createCV(cvData);
      const completeCV = await getCompleteCV(cvId);

      return NextResponse.json({
        success: true,
        message: 'CV data saved successfully',
        data: completeCV
      });
    }
    
    // Handle file upload
    const formData = await request.formData();
    const file = formData.get('cv') as File;
    const jobPositionId = formData.get('jobPositionId') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se ha subido ningún archivo' },
        { status: 400 }
      );
    }

    // Log file information for debugging
    const fileInfo = {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: new Date(file.lastModified).toISOString()
    };
    console.log('Procesando CV:', fileInfo);

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'El archivo es demasiado grande. El tamaño máximo permitido es 5MB.'
        },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    console.log('Tipo de archivo detectado:', file.type);
    
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tipo de archivo inválido. Por favor, sube un archivo PDF o DOCX',
          detectedType: file.type
        },
        { status: 400 }
      );
    }

    try {
      // Extract text from file
      console.log('Iniciando extracción de texto...');
      const buffer = await file.arrayBuffer();
      let cvText = '';

      if (file.type === 'application/pdf') {
        console.log('Procesando archivo PDF...');
        cvText = await parsePDF(buffer);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        console.log('Procesando archivo DOCX...');
        cvText = await extractTextFromDOCX(buffer);
      }

      if (!cvText) {
        throw new Error('No se pudo extraer texto del archivo');
      }

      console.log('Extracción de texto exitosa. Caracteres:', cvText.length);

      // Upload file to Firebase Storage
      console.log('Subiendo archivo a almacenamiento...');
      const fileUrl = await uploadFileToStorage(file, 'cvs');
      console.log('Archivo subido exitosamente:', fileUrl);

      // Get job positions
      console.log('Obteniendo puestos de trabajo...');
      const jobPositions = await getJobPositions();

      if (jobPositions.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No se encontraron puestos de trabajo' },
          { status: 400 }
        );
      }

      console.log(`Se encontraron ${jobPositions.length} puestos de trabajo`);

      // Select job position for analysis
      let jobPosition: JobPosition;
      if (jobPositionId) {
        // Use specified job position
        const selectedPosition = jobPositions.find(p => p.id === jobPositionId);
        if (selectedPosition) {
          jobPosition = selectedPosition;
          console.log(`Usando puesto seleccionado: ${jobPosition.title}`);
        } else {
          // Fallback to first position if specified ID not found
          jobPosition = jobPositions[0];
          console.log(`Puesto con ID ${jobPositionId} no encontrado, usando primer puesto: ${jobPosition.title}`);
        }
      } else {
        // Default to first position
        jobPosition = jobPositions[0];
        console.log(`Usando primer puesto para análisis: ${jobPosition.title}`);
      }

      // Analyze CV against job position
      console.log('Iniciando análisis de CV...');
      const analysis = await analyzeCVWithGPT(cvText, jobPosition);
      console.log('Análisis completado');

      // Create or update candidate
      console.log('Creando/actualizando registro de candidato...');
      const candidateData: Candidate = {
        name: analysis.name,
        title: analysis.title,
        email: analysis.email,
        phone: analysis.phone,
        location: analysis.location,
        birthDate: analysis.birthDate,
        age: analysis.age,
        experience: analysis.experience,
        skills: analysis.skills,
        summary: analysis.summary
      };

      const candidateId = await createOrUpdateCandidate(candidateData);

      // Create CV record
      console.log('Creando registro de CV...');
      const cvData: CV = {
        fileName: file.name,
        fileUrl: fileUrl,
        content: cvText,
        candidateId: candidateId
      };

      const cvId = await createCV(cvData);

      // Get complete CV data with all related information
      const completeCV = await getCompleteCV(cvId);

      return NextResponse.json({
        success: true,
        message: 'CV procesado exitosamente',
        data: {
          ...completeCV,
          analysis: {
            score: analysis.score,
            feedback: analysis.feedback,
            jobPosition: {
              id: jobPosition.id,
              title: jobPosition.title
            }
          }
        }
      });

    } catch (error) {
      console.error('Error al procesar archivo:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error al procesar archivo',
          details: error instanceof Error ? error.message : 'Error desconocido',
          fileInfo
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error al manejar la solicitud:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Paginación básica
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Validación básica
    const validPage = isNaN(page) || page < 1 ? 1 : page;
    const validLimit = isNaN(limit) || limit < 1 || limit > 100 ? 20 : limit;
    
    const cvs = await getCVs();
    const totalItems = cvs.length;
    
    // Aplicar paginación en memoria
    const startIndex = (validPage - 1) * validLimit;
    const endIndex = startIndex + validLimit;
    const paginatedCVs = cvs.slice(startIndex, endIndex);
    
    // Get complete data for each CV including candidate information
    const completeCVs = await Promise.all(
      paginatedCVs.map(async (cv) => {
        if (!cv.id) return cv;
        try {
          const completeCV = await getCompleteCV(cv.id);
          return completeCV;
        } catch (error) {
          console.error(`Error al obtener datos completos para CV ${cv.id}:`, error);
          return cv; // Devolver el CV original si hay un error
        }
      })
    );
    
    return NextResponse.json({
      success: true,
      data: completeCVs,
      pagination: {
        totalItems,
        currentPage: validPage,
        totalPages: Math.ceil(totalItems / validLimit),
        itemsPerPage: validLimit
      }
    });
  } catch (error) {
    console.error('Error al obtener CVs:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener CVs' },
      { status: 500 }
    );
  }
}

// Función DELETE modificada
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cvId = searchParams.get('id');

    if (!cvId) {
      return NextResponse.json(
        { success: false, error: 'ID de CV no proporcionado' },
        { status: 400 }
      );
    }

    console.log(`Iniciando eliminación de CV con ID: ${cvId}`);
    
    // Inicializar Firebase directamente para esta operación
    const app = initializeApp(
      {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      }, 
      'deleteApp'
    );
    
    const db = getFirestore(app);
    
    // Obtener datos del CV
    const cvRef = doc(db, 'cvs', cvId);
    const cvSnap = await getDoc(cvRef);
    
    if (cvSnap.exists()) {
      const cvData = cvSnap.data();
      console.log(`CV encontrado con ID: ${cvId}`);
      
      // Si hay una URL de archivo, intentar eliminarla con manejo seguro
      if (cvData.fileUrl) {
        console.log(`CV tiene fileUrl: ${cvData.fileUrl}`);
        
        // Ignorar explícitamente URLs de ejemplo
        if (cvData.fileUrl.includes('example.com')) {
          console.log('URL de ejemplo detectada, ignorando eliminación de archivo');
        } else {
          try {
            // Intentar eliminar el archivo pero no bloquear el proceso si falla
            await safeDeleteStorageFile(cvData.fileUrl, app);
          } catch (error) {
            const fileError = error as Error;
            console.log(`Error al eliminar archivo (continuando): ${fileError.message}`);
          }
        }
      }
      
      // Eliminar el documento de CV directamente
      await deleteDoc(cvRef);
      console.log(`Documento de CV eliminado: ${cvId}`);
    } else {
      console.log(`CV con ID ${cvId} no encontrado, nada que eliminar`);
    }
    
    return NextResponse.json({
      success: true,
      message: 'CV eliminado exitosamente',
      id: cvId
    });
  } catch (error) {
    console.error('Error al eliminar CV:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al eliminar CV',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Función auxiliar para eliminación segura de archivos
async function safeDeleteStorageFile(fileUrl: string, app: any): Promise<void> {
  try {
    // Validaciones estrictas
    if (!fileUrl || typeof fileUrl !== 'string') {
      console.log('URL no válida (undefined o no string)');
      return;
    }
    
    if (!fileUrl.includes('firebasestorage.googleapis.com')) {
      console.log('No es una URL de Firebase Storage:', fileUrl);
      return;
    }
    
    // Intentar extraer el path de la URL
    const segments = fileUrl.split('/o/');
    if (segments.length < 2) {
      console.log('Formato de URL no reconocido:', fileUrl);
      return;
    }
    
    const pathWithQuery = segments[1];
    const path = pathWithQuery.split('?')[0];
    
    if (!path) {
      console.log('No se pudo extraer la ruta del archivo:', fileUrl);
      return;
    }
    
    // Decodificar el path y eliminar
    const decodedPath = decodeURIComponent(path);
    console.log('Eliminando archivo con path:', decodedPath);
    
    const storage = getStorage(app);
    const fileRef = ref(storage, decodedPath);
    
    await deleteObject(fileRef);
    console.log('Archivo eliminado correctamente');
  } catch (error) {
    console.log('Error al eliminar archivo (ignorado):', error);
    // No propagar el error
  }
}
