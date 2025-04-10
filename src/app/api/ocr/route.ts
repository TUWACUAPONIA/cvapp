import { NextRequest, NextResponse } from 'next/server';
import { analyzeCVWithGPT } from '../../../lib/openai';
import { extractTextFromFile } from '../../../lib/document-parser';
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

// Tamaño máximo de archivo (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
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
      const extractedText = await extractTextFromFile(file);
      
      if (!extractedText) {
        throw new Error('No se pudo extraer texto del archivo');
      }

      console.log('Extracción de texto exitosa. Caracteres:', extractedText.length);

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

      // Analyze CV with GPT
      console.log('Iniciando análisis de CV con GPT...');
      const analysis = await analyzeCVWithGPT(extractedText, jobPosition);
      console.log('Análisis completado');

      // Create or update candidate using the analysis result
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

      // Create or update candidate in Firestore
      console.log('Creando/actualizando registro de candidato...');
      const candidateId = await createOrUpdateCandidate(candidateData);

      // Create CV record
      console.log('Creando registro de CV...');
      const cvData: CV = {
        fileName: file.name,
        fileUrl: fileUrl,
        content: extractedText,
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
    await deleteCV(cvId);
    console.log(`CV con ID ${cvId} eliminado correctamente`);

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
