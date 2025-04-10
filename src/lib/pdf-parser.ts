import { Buffer } from 'buffer';
const PDFParser = require('pdf2json');

export async function parsePDF(buffer: ArrayBuffer): Promise<string> {
  try {
    if (!buffer || buffer.byteLength === 0) {
      throw new Error('Buffer inválido o vacío');
    }

    return new Promise<string>((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1);

      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        try {
          console.log('PDF data recibida, procesando...');
          
          if (!pdfData || !pdfData.Pages || !Array.isArray(pdfData.Pages)) {
            console.error('Estructura de PDF inválida:', pdfData);
            throw new Error('Formato de PDF inválido o corrupto');
          }

          console.log(`Procesando ${pdfData.Pages.length} páginas...`);
          let text = '';
          
          pdfData.Pages.forEach((page: any, pageIndex: number) => {
            if (page.Texts && Array.isArray(page.Texts)) {
              console.log(`Página ${pageIndex + 1}: ${page.Texts.length} elementos de texto`);
              
              page.Texts.forEach((textItem: any) => {
                if (textItem.R && Array.isArray(textItem.R)) {
                  textItem.R.forEach((item: any) => {
                    if (item.T) {
                      try {
                        const decodedText = decodeURIComponent(item.T);
                        text += decodedText + ' ';
                      } catch (decodeError) {
                        console.warn('Error decodificando texto:', item.T);
                        text += item.T + ' ';
                      }
                    }
                  });
                }
              });
              text += '\n';
            } else {
              console.warn(`Página ${pageIndex + 1}: No se encontraron elementos de texto`);
            }
          });

          const normalizedText = normalizeText(text);
          
          if (!normalizedText.trim()) {
            console.error('No se encontró texto después de la normalización');
            throw new Error('No se pudo extraer texto del PDF. El archivo podría estar escaneado o ser una imagen');
          }

          console.log(`Texto extraído exitosamente. Longitud: ${normalizedText.length} caracteres`);
          resolve(normalizedText);
        } catch (error) {
          console.error('Error procesando contenido PDF:', error);
          reject(new Error('Error al procesar contenido del PDF: ' + (error instanceof Error ? error.message : 'Error desconocido')));
        }
      });

      pdfParser.on('pdfParser_dataError', (errData: any) => {
        console.error('Error parseando PDF:', errData);
        reject(new Error('Error al parsear PDF: ' + (errData.parserError || 'Error desconocido')));
      });

      try {
        console.log('Iniciando parseo de PDF...');
        const uint8Array = new Uint8Array(buffer);
        pdfParser.parseBuffer(Buffer.from(uint8Array));
      } catch (error) {
        console.error('Error leyendo buffer PDF:', error);
        reject(new Error('Error al leer buffer del PDF: ' + (error instanceof Error ? error.message : 'Error desconocido')));
      }
    });
  } catch (error) {
    console.error('Error general parseando PDF:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('escaneado') || error.message.includes('imagen')) {
        throw new Error('El PDF parece ser un documento escaneado. Por favor, asegúrate de que el PDF contenga texto seleccionable.');
      }
      if (error.message.includes('contraseña') || error.message.includes('password')) {
        throw new Error('El archivo PDF está protegido con contraseña');
      }
      if (error.message.includes('corrupto') || error.message.includes('inválido')) {
        throw new Error('El archivo PDF parece estar corrupto o es inválido');
      }
      throw new Error('Error al procesar archivo PDF: ' + error.message);
    }
    
    throw new Error('Error al procesar archivo PDF: Error desconocido');
  }
}

export function normalizeText(text: string): string {
  if (!text) return '';
  
  const normalized = text
    .replace(/[\r\n]+/g, '\n') // Reemplazar múltiples saltos de línea con uno solo
    .replace(/\s+/g, ' ') // Reemplazar múltiples espacios con uno solo
    .replace(/[^\x20-\x7E\náéíóúÁÉÍÓÚñÑüÜ]/g, '') // Mantener caracteres imprimibles y acentos
    .replace(/%20/g, ' ') // Reemplazar espacios codificados en URL
    .replace(/%2C/g, ',') // Reemplazar comas codificadas en URL
    .replace(/%[0-9A-F]{2}/g, ' ') // Reemplazar otros caracteres codificados en URL con espacios
    .trim(); // Remover espacios al inicio y final

  console.log('Texto normalizado:', {
    originalLength: text.length,
    normalizedLength: normalized.length,
    sample: normalized.substring(0, 100) + '...'
  });

  return normalized;
}
