// This file is used to handle API routes in Vercel
import app from '../server/src/app';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Forward the request to the Express app
  return app(req, res);
}
