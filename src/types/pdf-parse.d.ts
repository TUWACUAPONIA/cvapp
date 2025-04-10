declare module 'pdf-parse' {
  interface PDFOptions {
    pagerender?: ((pageData: any) => string) | null;
    max?: number;
    version?: string;
    [key: string]: any;
  }

  interface PDFData {
    text: string;
    numpages: number;
    info: {
      [key: string]: any;
    };
    metadata: {
      [key: string]: any;
    };
    version: string;
  }

  function parse(dataBuffer: Buffer, options?: PDFOptions): Promise<PDFData>;
  export = parse;
}
