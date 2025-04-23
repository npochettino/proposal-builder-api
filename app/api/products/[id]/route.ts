import { Product } from '@/lib/models/Product';
import { connectToDatabase } from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/products/[id]
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      await authenticateRequest(req);
      await connectToDatabase();
  
      const product = await Product.findById(params.id);
  
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
  
      return NextResponse.json(product, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }

// PUT /api/products/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await authenticateRequest(req);
  if (!user) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  await connectToDatabase();

  const updated = await Product.findByIdAndUpdate(
    params.id,
    { ...body, updated_at: new Date() },
    { new: true, runValidators: true }
  );

  if (!updated) return new Response('Not Found', { status: 404 });

  return Response.json(updated);
}

// DELETE /api/products/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await authenticateRequest(req);
  if (!user) return new Response('Unauthorized', { status: 401 });

  await connectToDatabase();

  const deleted = await Product.findByIdAndDelete(params.id);
  if (!deleted) return new Response('Not Found', { status: 404 });

  return new Response('Deleted', { status: 204 });
}
