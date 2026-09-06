import { pdf } from "@react-pdf/renderer";

export type PdfDocument = NonNullable<Parameters<typeof pdf>[0]>;

export async function downloadPdf(doc: PdfDocument, filename: string) {
  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}