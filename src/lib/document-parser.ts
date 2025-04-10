import mammoth from 'mammoth';

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export async function extractTextFromFile(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();

    if (file.type === 'application/pdf') {
      try {
        if (typeof window === 'undefined' || !window.pdfjsLib) {
          throw new Error('PDF.js no está cargado');
        }

        const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
        const maxPages = pdf.numPages;
        const textContent = [];
        let totalTextLength = 0;

        for (let pageNo = 1; pageNo <= maxPages; pageNo++) {
          const page = await pdf.getPage(pageNo);
          const content = await page.getTextContent();
          const pageText = content.items
            .map((item: { str: string }) => item.str)
            .join(' ');
          
          textContent.push(pageText);
          totalTextLength += pageText.length;
        }

        // Verificar si el PDF es probablemente un documento escaneado
        const averageTextPerPage = totalTextLength / maxPages;
        if (averageTextPerPage < 100) { // Umbral de caracteres por página
          throw new Error(
            'Este parece ser un PDF escaneado o una imagen. ' +
            'Por favor, asegúrese de subir un PDF con texto seleccionable. ' +
            'Si tiene un PDF escaneado, necesitará convertirlo primero usando un software de OCR.'
          );
        }

        const extractedText = normalizeText(textContent.join('\n'));
        if (!extractedText.trim()) {
          throw new Error(
            'No se pudo extraer texto del PDF. ' +
            'Por favor, asegúrese de que el archivo contenga texto seleccionable y no esté protegido.'
          );
        }
        
        return extractedText;

      } catch (pdfError) {
        console.error('Error al procesar PDF:', pdfError);
        if (pdfError instanceof Error) {
          // Propagar errores específicos sobre PDFs escaneados o sin texto
          if (pdfError.message.includes('PDF escaneado') || 
              pdfError.message.includes('texto seleccionable')) {
            throw pdfError;
          }
        }
        throw new Error(
          'Error al procesar el PDF. ' +
          'Por favor, verifique que el archivo no esté dañado o protegido.'
        );
      }
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const result = await mammoth.extractRawText({
          arrayBuffer: buffer
        });
        
        const extractedText = normalizeText(result.value);
        if (!extractedText.trim()) {
          throw new Error(
            'No se pudo extraer texto del documento DOCX. ' +
            'Por favor, asegúrese de que el archivo contenga texto y no esté protegido.'
          );
        }
        return extractedText;
      } catch (docxError) {
        console.error('Error al procesar DOCX:', docxError);
        throw new Error(
          'Error al procesar el documento DOCX. ' +
          'Por favor, verifique que el archivo no esté dañado o protegido.'
        );
      }
    }

    throw new Error(
      'Formato de archivo no soportado. ' +
      'Por favor, suba un archivo PDF o DOCX con texto seleccionable.'
    );
  } catch (error: unknown) {
    console.error('Error al extraer texto:', error);
    if (error instanceof Error) {
      throw error; // Propagar el error con el mensaje detallado
    }
    throw new Error('Error desconocido al procesar el archivo');
  }
}

// Añadir esta función si no existe
export function normalizeText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/[\r\n]+/g, '\n') // Replace multiple line breaks with single
    .replace(/\s+/g, ' ') // Replace multiple spaces with single
    .trim(); // Remove leading/trailing whitespace
}
