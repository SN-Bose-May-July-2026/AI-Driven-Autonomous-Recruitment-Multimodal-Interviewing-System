import { Request, Response } from 'express';
import { parsePDF } from '../services/pdfService';
import { extractEntities } from '../services/aiService';

export const handleUpload = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const jdText = req.body.jdText;

    if (!files || files.length === 0) {
      res.status(400).json({ error: 'No resumes uploaded.' });
      return;
    }

    if (!jdText) {
      res.status(400).json({ error: 'Job Description text is required.' });
      return;
    }

    const processedCandidates = [];

    for (const file of files) {
      // 1. Parse PDF
      const rawText = await parsePDF(file.buffer);
      
      // 2. Extract Entities using LLM
      const structuredData = await extractEntities(rawText);
      
      // 3. Store in Vector DB (To be implemented)
      // await storeInVectorDB(structuredData);

      processedCandidates.push({
        filename: file.originalname,
        structuredData
      });
    }

    // 4. Calculate similarities and rank (To be implemented)
    // const rankedCandidates = await rankCandidates(jdText, processedCandidates);

    res.status(200).json({
      message: 'Resumes processed successfully',
      candidates: processedCandidates
    });
  } catch (error) {
    console.error('Error in handleUpload:', error);
    res.status(500).json({ error: 'Internal server error during upload.' });
  }
};
