import { initializeApp, getApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
  type Firestore
} from 'firebase/firestore';

// Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

console.log('Inicializando Firebase con configuración:', {
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  authDomain: firebaseConfig.authDomain
});

if (!firebaseConfig.storageBucket) {
  throw new Error('Firebase Storage Bucket no configurado. Por favor, verifica las variables de entorno.');
}

// Initialize Firebase
let app;
try {
  app = getApp();
  console.log('Firebase ya estaba inicializado.');
} catch (e) {
  app = initializeApp(firebaseConfig);
  console.log('Firebase inicializado correctamente.');
}

// Initialize services
export const storage = getStorage(app);
export const db = getFirestore(app);

// Export app
export { app };

// Interfaces
export interface Candidate {
  id?: string;
  name: string;
  title: string | null;
  birthDate: string | null;
  age: number | null;
  email: string;
  phone: string | null;
  experience: string | null;
  location: string | null;
  skills: string[];
  summary: string | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface CV {
  id?: string;
  fileName: string;
  fileUrl: string;
  content: string;
  candidateId: string;
  createdAt?: Timestamp;
}

export interface JobPosition {
  id?: string;
  title: string;
  description: string;
  requirements: {
    skills: string[];
    experience: string | null;
    education: string | null;
  };
  location: string | null;
  createdAt?: Timestamp;
}

function sanitize(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  );
}

// Storage
export async function uploadFileToStorage(file: File, folder: string): Promise<string> {
  try {
    const timestamp = Date.now();
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `${timestamp}-${safeFilename}`;
    const filePath = `${folder}/${uniqueFilename}`;
    const storageRef = ref(storage, filePath);

    console.log('Subiendo archivo:', filePath);

    const buffer = await file.arrayBuffer();
    const blob = new Blob([buffer], { type: file.type });
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log('Archivo subido exitosamente:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error al subir archivo:', error);
    throw error;
  }
}

// Reemplaza completamente la función deleteFileFromStorage
export async function deleteFileFromStorage(fileUrl: string): Promise<void> {
  // Si la URL no parece válida (no es una URL de Firebase Storage), ignorarla
  if (!fileUrl || typeof fileUrl !== 'string' || fileUrl.includes('example.com')) {
    console.log('URL inválida o de prueba detectada, ignorando:', fileUrl);
    return;
  }

  try {
    // Solo proceder si es una URL de Firebase Storage
    if (!fileUrl.includes('firebasestorage.googleapis.com')) {
      console.log('URL no es de Firebase Storage, ignorando:', fileUrl);
      return;
    }

    // Intentar extraer el path
    const segments = fileUrl.split('/o/');
    if (segments.length < 2) {
      console.log('Formato de URL no reconocido, ignorando:', fileUrl);
      return;
    }

    const pathWithQuery = segments[1];
    const path = pathWithQuery.split('?')[0];
    
    if (!path) {
      console.log('No se pudo extraer la ruta del archivo, ignorando:', fileUrl);
      return;
    }
    
    // Decodificar el path
    const decodedPath = decodeURIComponent(path);
    console.log('Intentando eliminar archivo con path:', decodedPath);
    
    // Eliminar el archivo
    const fileRef = ref(storage, decodedPath);
    await deleteObject(fileRef);
    console.log('Archivo eliminado de Storage:', decodedPath);
  } catch (error) {
    // Capturar cualquier error pero no propagarlo
    console.error('Error en deleteFileFromStorage (ignorado):', error);
    // No propagamos el error para que no falle la eliminación del documento
  }
}

// Candidates
export async function createOrUpdateCandidate(data: Candidate): Promise<string> {
  try {
    console.log('Procesando candidato:', data.email);
    const candidatesRef = collection(db, 'candidates');
    const q = query(candidatesRef, where('email', '==', data.email));
    const snapshot = await getDocs(q);

    const candidateData = {
      ...sanitize(data),
      updatedAt: Timestamp.now()
    };

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await setDoc(docRef, candidateData, { merge: true });
      console.log('Candidato actualizado:', docRef.id);
      return docRef.id;
    }

    const docRef = await addDoc(candidatesRef, {
      ...candidateData,
      createdAt: Timestamp.now()
    });

    console.log('Nuevo candidato creado:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error en createOrUpdateCandidate:', error);
    throw error;
  }
}

export async function deleteCandidate(candidateId: string): Promise<void> {
  return deleteDocument('candidates', candidateId);
}

// Generic document operations
export async function deleteDocument(collectionName: string, docId: string): Promise<void> {
  try {
    if (!collectionName || !docId) {
      throw new Error('Nombre de colección o ID inválido');
    }

    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log(`🗑️ Documento eliminado de ${collectionName} con ID: ${docId}`);
  } catch (error) {
    console.error(`❌ Error al eliminar documento de ${collectionName} con ID ${docId}:`, error);
    throw error;
  }
}

// También reemplaza la función deleteCV
export async function deleteCV(id: string): Promise<void> {
  try {
    // Get CV data
    const cvDoc = await getDoc(doc(db, 'cvs', id));
    if (!cvDoc.exists()) {
      console.log(`CV con ID ${id} no encontrado, continuando con la operación`);
      return;
    }

    const cv = cvDoc.data() as CV;

    // Eliminar archivo si existe
    if (cv.fileUrl) {
      try {
        console.log(`Intentando eliminar archivo para CV ${id}:`, cv.fileUrl);
        await deleteFileFromStorage(cv.fileUrl);
      } catch (fileError) {
        console.error(`Error al eliminar archivo (ignorado) para CV ${id}:`, fileError);
        // Continuar con la eliminación del documento aunque falle la eliminación del archivo
      }
    }

    // Eliminar documento
    console.log(`Eliminando documento de CV con ID: ${id}`);
    await deleteDocument('cvs', id);
    console.log(`CV eliminado con éxito: ${id}`);
  } catch (error) {
    console.error('Error en deleteCV:', error);
    throw error;
  }
}

// Job Positions
export async function createJobPosition(data: JobPosition): Promise<string> {
  try {
    const cleanData = {
      ...sanitize(data),
      requirements: sanitize(data.requirements),
      createdAt: Timestamp.now()
    };

    console.log('Guardando puesto:', cleanData);
    const docRef = await addDoc(collection(db, 'jobPositions'), cleanData);
    console.log('Puesto creado con éxito:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al crear el puesto:', error);
    throw error;
  }
}

export async function getJobPositions(): Promise<JobPosition[]> {
  try {
    const jobsCollection = collection(db, 'jobPositions');
    const q = query(jobsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const positions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobPosition));
    console.log('Puestos encontrados:', positions.length);
    return positions;
  } catch (error) {
    console.error('Error al obtener los puestos:', error);
    throw error;
  }
}

export async function updateJobPosition(id: string, data: Partial<JobPosition>): Promise<void> {
  try {
    const docRef = doc(db, 'jobPositions', id);
    const updateData = {
      ...sanitize(data),
      updatedAt: Timestamp.now()
    };
    await setDoc(docRef, updateData, { merge: true });
    console.log('Puesto actualizado con éxito:', id);
  } catch (error) {
    console.error('Error al actualizar el puesto:', error);
    throw error;
  }
}

export async function deleteJobPosition(id: string): Promise<void> {
  return deleteDocument('jobPositions', id);
}

// CVs
export async function createCV(data: CV): Promise<string> {
  try {
    const cleanData = {
      ...sanitize(data),
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'cvs'), cleanData);
    console.log('CV creado:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al crear CV:', error);
    throw error;
  }
}

export async function getCVs(): Promise<CV[]> {
  try {
    const cvsCollection = collection(db, 'cvs');
    const q = query(cvsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const cvs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CV));
    console.log('CVs encontrados:', cvs.length);
    return cvs;
  } catch (error) {
    console.error('Error al obtener CVs:', error);
    throw error;
  }
}

export async function getCompleteCV(cvId: string) {
  try {
    const cvDoc = await getDoc(doc(db, 'cvs', cvId));
    if (!cvDoc.exists()) throw new Error('CV no encontrado');

    const cv = { id: cvDoc.id, ...cvDoc.data() } as CV;
    const candidateDoc = await getDoc(doc(db, 'candidates', cv.candidateId));

    console.log('CV completo cargado');
    return {
      ...cv,
      candidate: { id: candidateDoc.id, ...candidateDoc.data() }
    };
  } catch (error) {
    console.error('Error en getCompleteCV:', error);
    throw error;
  }
}

// Connection check
export async function checkFirestoreConnection() {
  try {
    console.log('Verificando conexión a Firestore...');
    
    // Intentar escribir un documento de prueba
    const testRef = doc(db, 'test_connection', 'test_doc');
    await setDoc(testRef, {
      timestamp: Timestamp.now(),
      message: 'Test de conexión exitoso'
    });
    console.log('✓ Escritura en Firestore exitosa');

    // Intentar leer el documento
    const docSnap = await getDoc(testRef);
    if (docSnap.exists()) {
      console.log('✓ Lectura en Firestore exitosa:', docSnap.data());
      
      // Limpiar el documento de prueba
      await deleteDoc(testRef);
      console.log('✓ Limpieza de documento de prueba completada');
      
      return true;
    } else {
      throw new Error('No se pudo leer el documento de prueba');
    }
  } catch (error) {
    console.error('❌ Error al verificar la conexión a Firestore:', error);
    throw error;
  }
}