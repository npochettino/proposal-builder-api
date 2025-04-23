import { Product } from '@/lib/models/Product';
import { connectToDatabase } from '@/lib/mongodb';
import { authenticateRequest } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const user = await authenticateRequest(req);
  if (!user) return new Response('Unauthorized', { status: 401 });

  await connectToDatabase();
  try {
    const products = await Product.find({ is_archived: false }).sort({ created_at: -1 });
    return NextResponse.json(products);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await authenticateRequest(req);
  if (!user) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  await connectToDatabase();
  try {
    const product = await Product.create({
      ...body,
      created_by: user.uid,
      is_archived: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
