// lib/resumePdf.ts
// PDF text extraction with pdf.js. Imported only in the browser, only when a PDF is chosen.

const MAX_PAGES = 30;

export interface PdfText {
  text: string;
  pages: number;
}

export interface PdfItem {
  str?: string;
  hasEOL?: boolean;
  transform?: number[];
}

/** Joins pdf.js text items into lines, starting a new line when the vertical position changes or the item ends a line. */
export function itemsToLines(items: PdfItem[]): string {
  const lines: string[] = [];
  let cur = "";
  let lastY: number | null = null;
  for (const it of items) {
    if (typeof it.str !== "string") continue;
    const y = it.transform ? it.transform[5] : null;
    if (lastY !== null && y !== null && Math.abs(y - lastY) > 3 && cur.trim()) {
      lines.push(cur.trim());
      cur = "";
    }
    cur += (cur && it.str && !cur.endsWith(" ") ? " " : "") + it.str;
    if (y !== null) lastY = y;
    if (it.hasEOL && cur.trim()) {
      lines.push(cur.trim());
      cur = "";
    }
  }
  if (cur.trim()) lines.push(cur.trim());
  return lines.join("\n");
}

export async function extractPdfText(data: ArrayBuffer): Promise<PdfText> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url).toString();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
  const pages = doc.numPages;
  const parts: string[] = [];
  for (let i = 1; i <= Math.min(pages, MAX_PAGES); i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    parts.push(itemsToLines(content.items as PdfItem[]));
  }
  await doc.destroy();
  return { text: parts.join("\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim(), pages };
}
