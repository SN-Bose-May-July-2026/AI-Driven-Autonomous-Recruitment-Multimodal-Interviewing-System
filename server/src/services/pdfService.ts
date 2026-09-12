import pdf from 'pdf-parse';

export const parsePDF = async (dataBuffer: Buffer): Promise<string> => {
  try {
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF document.');
  }
};
