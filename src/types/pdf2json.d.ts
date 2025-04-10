declare module 'pdf2json' {
  interface PDFPage {
    Texts: Array<{
      R: Array<{
        T: string;
      }>;
    }>;
  }

  interface PDFData {
    Pages: PDFPage[];
  }

  class PDFParser {
    constructor();
    on(event: 'pdfParser_dataReady', callback: (data: PDFData) => void): void;
    on(event: 'pdfParser_dataError', callback: (error: { parserError: string }) => void): void;
    parseBuffer(buffer: Buffer): void;
  }

  export = PDFParser;
}
