import { NextRequest, NextResponse } from 'next/server';
import { jobPositionsService } from '../../../lib/firebase';

export async function GET() {
  try {
    const positions = await jobPositionsService.getAll();
    return NextResponse.json({
      success: true,
      data: positions,
    });
  } catch (error) {
    console.error('Error al obtener puestos:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener puestos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const jobId = await jobPositionsService.create(data);
    return NextResponse.json({
      success: true,
      message: 'Puesto creado exitosamente',
      data: { id: jobId }
    });
  } catch (error) {
    console.error('Error al crear puesto:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear puesto' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'ID de puesto no proporcionado' },
      { status: 400 }
    );
  }

  try {
    const data = await request.json();
    await jobPositionsService.update(id, data);
    return NextResponse.json({
      success: true,
      message: 'Puesto actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar puesto:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar puesto' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'ID de puesto no proporcionado' },
      { status: 400 }
    );
  }

  try {
    await jobPositionsService.delete(id);
    return NextResponse.json({
      success: true,
      message: 'Puesto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar puesto:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar puesto' },
      { status: 500 }
    );
  }
}
