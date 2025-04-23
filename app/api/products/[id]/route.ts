import { Product } from '@/lib/models/Product';
import { connectToDatabase } from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/products/[id]
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
      await authenticateRequest(req);
      await connectToDatabase();
  
      const id = await context.params;

      const product = await Product.findById(id);
  
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
  
      return NextResponse.json(product, { status: 200 });
    } catch (error: unknown) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'Failed to fetch products';
        return NextResponse.json({ error: message }, { status: 500 });
    }
  }

// PUT /api/products/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await authenticateRequest(req);
  if (!user) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  await connectToDatabase();

  const { id } = await params;

  const updated = await Product.findByIdAndUpdate(
    id,
    { ...body, updated_at: new Date() },
    { new: true, runValidators: true }
  );

  if (!updated) return new Response('Not Found', { status: 404 });

  return NextResponse.json(updated);
}

// DELETE /api/products/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await authenticateRequest(req);
  if (!user) return new Response('Unauthorized', { status: 401 });

  await connectToDatabase();

  const { id } = await params;

  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted) return new Response('Not Found', { status: 404 });

  return new Response('Deleted', { status: 204 });
}
