// lib/docxWriter.ts
// Writes a minimal single-column .docx with no libraries: plain paragraphs only, no tables, text boxes or images,
// which is exactly the layout an ATS reads best. The zip uses "stored" entries (no compression), so it needs only a CRC.

export interface DocBlock {
  text: string;
  kind: "name" | "contact" | "heading" | "line" | "bullet";
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export function escapeXml(s: string): string {
  return s
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function para(b: DocBlock): string {
  const font = '<w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>';
  const t = escapeXml(b.kind === "bullet" ? `• ${b.text}` : b.text);
  const run = (rpr: string) => `<w:r><w:rPr>${font}${rpr}</w:rPr><w:t xml:space="preserve">${t}</w:t></w:r>`;
  switch (b.kind) {
    case "name":
      return `<w:p><w:pPr><w:spacing w:after="40"/></w:pPr>${run('<w:b/><w:sz w:val="36"/>')}</w:p>`;
    case "contact":
      return `<w:p><w:pPr><w:spacing w:after="160"/></w:pPr>${run('<w:sz w:val="21"/>')}</w:p>`;
    case "heading":
      return `<w:p><w:pPr><w:keepNext/><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="808080"/></w:pBdr><w:spacing w:before="200" w:after="80"/></w:pPr>${run('<w:b/><w:caps/><w:sz w:val="23"/>')}</w:p>`;
    case "bullet":
      return `<w:p><w:pPr><w:spacing w:after="40"/><w:ind w:left="360" w:hanging="220"/></w:pPr>${run('<w:sz w:val="21"/>')}</w:p>`;
    default:
      return `<w:p><w:pPr><w:spacing w:after="40"/></w:pPr>${run('<w:sz w:val="21"/>')}</w:p>`;
  }
}

export function documentXml(blocks: DocBlock[]): string {
  return (
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' +
    blocks.map(para).join("") +
    '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1000" w:right="1000" w:bottom="1000" w:left="1000" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>' +
    "</w:body></w:document>"
  );
}

function u16(n: number): number[] {
  return [n & 0xff, (n >>> 8) & 0xff];
}
function u32(n: number): number[] {
  return [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff];
}

/** Builds a zip with stored (uncompressed) entries. */
export function zipStore(files: { name: string; data: Uint8Array }[]): Uint8Array {
  const enc = new TextEncoder();
  const parts: number[][] = [];
  const central: number[][] = [];
  let offset = 0;
  for (const f of files) {
    const name = enc.encode(f.name);
    const crc = crc32(f.data);
    const local = [...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(crc), ...u32(f.data.length), ...u32(f.data.length), ...u16(name.length), ...u16(0), ...name];
    parts.push(local, Array.from(f.data));
    central.push([...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21), ...u32(crc), ...u32(f.data.length), ...u32(f.data.length), ...u16(name.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(offset), ...name]);
    offset += local.length + f.data.length;
  }
  const cdSize = central.reduce((n, c) => n + c.length, 0);
  const end = [...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(files.length), ...u16(files.length), ...u32(cdSize), ...u32(offset), ...u16(0)];
  const all = [...parts, ...central, end];
  const out = new Uint8Array(all.reduce((n, p) => n + p.length, 0));
  let pos = 0;
  for (const p of all) {
    out.set(p, pos);
    pos += p.length;
  }
  return out;
}

export function makeDocx(blocks: DocBlock[]): Uint8Array {
  const enc = new TextEncoder();
  const head = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  return zipStore([
    { name: "[Content_Types].xml", data: enc.encode(`${head}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`) },
    { name: "_rels/.rels", data: enc.encode(`${head}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`) },
    { name: "word/document.xml", data: enc.encode(documentXml(blocks)) },
  ]);
}
