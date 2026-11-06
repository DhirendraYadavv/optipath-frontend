// lib/resumeText.ts
// Turns an uploaded PDF or DOCX into plain text in the browser, so the resume is read on the student's own device.
// DOCX: a .docx is a zip file; we read word/document.xml with the browser's built-in DecompressionStream.
// PDF: handled by lib/resumePdf.ts (pdf.js), loaded only when a PDF is chosen.
// Scanned PDFs (pictures of text) have no text layer, so they return an empty string and the UI asks for typed skills.

const MAX_XML_BYTES = 20 * 1024 * 1024;

function u16(b: Uint8Array, o: number): number {
  return b[o] | (b[o + 1] << 8);
}
function u32(b: Uint8Array, o: number): number {
  return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;
}

async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([data as BlobPart]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > MAX_XML_BYTES) {
      await reader.cancel();
      throw new Error("The document is too large to read.");
    }
    chunks.push(value);
  }
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out;
}

/** Reads one file out of a zip archive. Returns null if it is not in the archive. */
export async function readZipEntry(zip: Uint8Array, wanted: string): Promise<Uint8Array | null> {
  let eocd = -1;
  for (let i = zip.length - 22; i >= Math.max(0, zip.length - 22 - 65535); i--) {
    if (u32(zip, i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("This does not look like a DOCX file.");
  const count = u16(zip, eocd + 10);
  let p = u32(zip, eocd + 16);
  for (let n = 0; n < count; n++) {
    if (p + 46 > zip.length || u32(zip, p) !== 0x02014b50) break;
    const method = u16(zip, p + 10);
    const compSize = u32(zip, p + 20);
    const nameLen = u16(zip, p + 28);
    const extraLen = u16(zip, p + 30);
    const commentLen = u16(zip, p + 32);
    const localOff = u32(zip, p + 42);
    const name = new TextDecoder().decode(zip.subarray(p + 46, p + 46 + nameLen));
    if (name === wanted) {
      if (u32(zip, localOff) !== 0x04034b50) throw new Error("The DOCX file is damaged.");
      const start = localOff + 30 + u16(zip, localOff + 26) + u16(zip, localOff + 28);
      const body = zip.subarray(start, start + compSize);
      if (method === 0) return body;
      if (method === 8) return inflateRaw(body);
      throw new Error("Unsupported DOCX compression.");
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  return null;
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

/** Pulls the visible text out of WordprocessingML. */
export function wordXmlToText(xml: string): string {
  return xml
    .replace(/<w:tab\b[^>]*\/>/g, "\t")
    .replace(/<w:(?:br|cr)\b[^>]*\/>/g, "\n")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<(?!\/?w:t[ >/])[^>]*>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&(#x?[0-9a-fA-F]+|[a-z]+);/g, (m, e: string) => {
      if (e[0] === "#") {
        const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : "";
      }
      return ENTITIES[e] ?? m;
    })
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export interface DocxContent {
  text: string;
  hasTables: boolean;
  hasImages: boolean;
  hasTextBoxes: boolean;
}

export async function extractDocxContent(data: ArrayBuffer): Promise<DocxContent> {
  const entry = await readZipEntry(new Uint8Array(data), "word/document.xml");
  if (!entry) throw new Error("This does not look like a Word document.");
  const xml = new TextDecoder().decode(entry);
  return {
    text: wordXmlToText(xml),
    hasTables: /<w:tbl[ >/]/.test(xml),
    hasImages: /<w:drawing[ >/]|<w:pict[ >/]/.test(xml),
    hasTextBoxes: /<w:txbxContent[ >/]/.test(xml),
  };
}

export async function extractDocxText(data: ArrayBuffer): Promise<string> {
  return (await extractDocxContent(data)).text;
}

export type ResumeKind = "pdf" | "docx" | "unsupported";

export function resumeKind(fileName: string): ResumeKind {
  const n = fileName.toLowerCase();
  if (n.endsWith(".pdf")) return "pdf";
  if (n.endsWith(".docx")) return "docx";
  return "unsupported";
}

/** What we learned from reading a resume file. Used for the ATS-readiness checks. */
export interface ResumeSignals {
  kind: "pdf" | "docx";
  text: string;
  /** PDF only. */
  pages?: number;
  /** DOCX only: layout features that ATS software often reads badly. */
  hasTables?: boolean;
  hasImages?: boolean;
  hasTextBoxes?: boolean;
}

/** Reads a PDF or DOCX. Throws a readable Error if the file cannot be read. */
export async function extractResumeSignals(file: File): Promise<ResumeSignals> {
  const kind = resumeKind(file.name);
  const data = await file.arrayBuffer();
  if (kind === "docx") {
    const d = await extractDocxContent(data);
    return { kind: "docx", ...d };
  }
  if (kind === "pdf") {
    const { extractPdfText } = await import("@/lib/resumePdf");
    const r = await extractPdfText(data);
    return { kind: "pdf", text: r.text, pages: r.pages };
  }
  throw new Error("Only PDF or DOCX files are supported.");
}

export async function extractResumeText(file: File): Promise<string> {
  return (await extractResumeSignals(file)).text;
}
