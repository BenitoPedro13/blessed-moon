// Reused from Unimeet for TASK-social-preview-builder.md. Carousels are PDF documents of
// same-size pages. Each slide is already a JPEG, and PDF embeds JPEG bytes
// as they are (/DCTDecode), so a document is a catalog, a page tree, and one
// full-page image per page. Written by hand: ~60 lines of ISO 32000-1 §7
// (file structure) instead of a PDF library dependency. No Buffer, so the
// post builder can assemble one in the browser too (TASK-post-builder.md §6).

type Page = { jpeg: Uint8Array; width: number; height: number }

// Pixels to points at 96 dpi, so a 1080×1350 slide is an 810×1012.5pt page.
const PT = 0.75

// Every string written here is ASCII apart from the binary-marker comment, which PDF wants as raw bytes.
const latin1 = (text: string) => Uint8Array.from(text, (char) => char.charCodeAt(0) & 0xff)

export function jpegsToPdf(pages: Page[]): Uint8Array<ArrayBuffer> {
  const chunks: Uint8Array[] = []
  const offsets: number[] = []
  let length = 0
  const write = (part: string | Uint8Array) => {
    const bytes = typeof part === 'string' ? latin1(part) : part
    chunks.push(bytes)
    length += bytes.length
  }
  const object = (id: number, body: () => void) => {
    offsets[id] = length
    write(`${id} 0 obj\n`)
    body()
    write('\nendobj\n')
  }

  // 1 catalog, 2 page tree, then per page: page, content stream, image.
  const pageId = (i: number) => 3 + i * 3
  write('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')
  object(1, () => write('<< /Type /Catalog /Pages 2 0 R >>'))
  object(2, () => write(`<< /Type /Pages /Count ${pages.length} /Kids [${pages.map((_, i) => `${pageId(i)} 0 R`).join(' ')}] >>`))

  pages.forEach((page, i) => {
    const [id, contentId, imageId] = [pageId(i), pageId(i) + 1, pageId(i) + 2]
    const w = page.width * PT
    const h = page.height * PT
    object(id, () =>
      write(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`,
      ),
    )
    const content = `q ${w} 0 0 ${h} 0 0 cm /Im0 Do Q`
    object(contentId, () => write(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`))
    object(imageId, () => {
      write(
        `<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.jpeg.length} >>\nstream\n`,
      )
      write(page.jpeg)
      write('\nendstream')
    })
  })

  const count = pageId(pages.length)
  const xref = length
  write(`xref\n0 ${count}\n0000000000 65535 f \n`)
  for (let id = 1; id < count; id++) write(`${String(offsets[id]).padStart(10, '0')} 00000 n \n`)
  write(`trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`)

  const out = new Uint8Array(new ArrayBuffer(length))
  let at = 0
  for (const chunk of chunks) {
    out.set(chunk, at)
    at += chunk.length
  }
  return out
}
