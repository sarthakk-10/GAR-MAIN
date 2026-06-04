import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

const MAX_PAGES_TO_EXTRACT = 40;

const normalizeText = (value) => (
  value
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
);

const reconstructPageText = (items, viewport) => {
  const positionedItems = items
    .filter(item => item.str && item.str.trim())
    .map(item => {
      const [, , , , x, y] = pdfjs.Util.transform(
        viewport.transform,
        item.transform
      );

      return {
        text: item.str.trim(),
        x,
        y,
        width: item.width || 0,
        height: item.height || 0,
      };
    })
    .sort((a, b) => {
      const yDiff = a.y - b.y;
      if (Math.abs(yDiff) > 3) return yDiff;
      return a.x - b.x;
    });

  const lines = [];

  positionedItems.forEach(item => {
    const tolerance = Math.max(2.5, item.height * 0.45);
    let line = lines.find(existing => Math.abs(existing.y - item.y) <= tolerance);

    if (!line) {
      line = { y: item.y, items: [] };
      lines.push(line);
    }

    line.items.push(item);
  });

  return lines
    .sort((a, b) => a.y - b.y)
    .map(line => {
      const sortedLine = line.items.sort((a, b) => a.x - b.x);

      return sortedLine.reduce((lineText, item, index) => {
        if (index === 0) return item.text;

        const previous = sortedLine[index - 1];
        const gap = item.x - (previous.x + previous.width);
        const separator = gap > 18 ? '    ' : ' ';

        return `${lineText}${separator}${item.text}`;
      }, '');
    })
    .map(normalizeText)
    .filter(Boolean)
    .join('\n');
};

/**
 * Extracts text from a PDF file.
 * @param {File} file - The PDF file object.
 * @param {function} onProgress - Callback for page-by-page parsing progress (0 to 100).
 * @returns {Promise<string>} The extracted text content.
 */
export const extractTextFromPdf = async (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const typedarray = new Uint8Array(event.target.result);
        
        const loadingTask = pdfjs.getDocument({
          data: typedarray,
          disableFontFace: true,
          useSystemFonts: true,
        });
        const pdf = await loadingTask.promise;
        
        let text = '';
        const numPages = pdf.numPages;
        
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1 });
          const content = await page.getTextContent({
            includeMarkedContent: false,
            disableNormalization: false,
          });
          const pageText = reconstructPageText(content.items, viewport);

          if (pageText) {
            text += `[Page ${i}]\n${pageText}\n\n`;
          }
          
          if (onProgress) {
            onProgress(Math.round((i / numPages) * 100));
          }
        }
        
        const extractedText = normalizeText(text);

        console.log(`[PDF EXTRACTION COMPLETE] Pages parsed: ${numPages}, Character count: ${extractedText.length}`);

        if (extractedText.length < 80) {
          reject(new Error('This PDF has very little selectable text. If it is scanned, use OCR first or paste the notes text directly.'));
          return;
        }

        resolve(extractedText);
      } catch (error) {
        console.error('PDF parsing error:', error);
        reject(new Error('Failed to parse PDF document. Ensure it is not password-protected.'));
      }
    };
    
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(new Error('Failed to read the file.'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};
