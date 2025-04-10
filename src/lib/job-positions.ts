import { collection, doc, addDoc, setDoc, deleteDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db, type JobPosition } from './firebase';

// Collection name constant
const COLLECTION = 'jobPositions';

function sanitize(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  );
}

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
  try {
    const docRef = doc(db, 'jobPositions', id);
    await deleteDoc(docRef);
    console.log('Puesto eliminado con éxito:', id);
  } catch (error) {
    console.error('Error al eliminar el puesto:', error);
    throw error;
  }
}
