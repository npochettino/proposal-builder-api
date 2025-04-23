import { Product } from '@/lib/models/Product';
import { connectToDatabase } from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const user = await authenticateRequest(req);
  if (!user) return new Response('Unauthorized', { status: 401 });

  await connectToDatabase();
  const products = await Product.find();
  return Response.json(products);
}

export async function POST(req: NextRequest) {
  const user = await authenticateRequest(req);
  if (!user) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  await connectToDatabase();
  const created = await Product.create(body);
  return Response.json(created);
}
