declare namespace PDFKit {
  interface PDFDocument {
    fontSize(size: number): this;
    text(text: string, options?: Record<string, unknown>): this;
    moveDown(lines?: number): this;
    on(event: string, listener: (...args: unknown[]) => void): this;
    end(): void;
  }
}

declare class PDFDocument implements PDFKit.PDFDocument {
  constructor(options?: Record<string, unknown>);
  fontSize(size: number): this;
  text(text: string, options?: Record<string, unknown>): this;
  moveDown(lines?: number): this;
  on(event: string, listener: (...args: unknown[]) => void): this;
  end(): void;
}

declare module "pdfkit" {
  export default PDFDocument;
}
