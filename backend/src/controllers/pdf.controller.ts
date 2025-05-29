import { Request, Response } from 'express';
// @ts-ignore
import pdfParse from 'pdf-parse';

export const uploadPdfHandler = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' }); // ✅ just send
    return;
  }

  try {
    const buffer = req.file.buffer;
    const data = await pdfParse(buffer);

    res.json({ message: 'PDF parsed successfully', length: data.text.length }); // ✅ just send
  } catch (error) {
    res.status(500).json({ error: 'Failed to parse PDF' }); // ✅ just send
  }
};
