import { Request, Response, RequestHandler } from 'express';

export const queryHandler: RequestHandler = async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query) {
    res.status(400).json({ error: 'Query is required' });
    return;
  }

  // For now, send back a mock response.
  const answer = `You asked: "${query}". Here's a dummy answer about the POSH Act.`;

  res.json({ answer });
};
