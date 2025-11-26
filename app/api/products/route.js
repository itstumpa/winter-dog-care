import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET - Fetch products
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db('winter-dog-care-01');
    
    // Get user ID from query params (optional)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let products;
    
    if (userId) {
      // Fetch products only for this user
      products = await db
        .collection('products')
        .find({ createdBy: userId })
        .sort({ createdAt: -1 })
        .toArray();
    } else {
      // Fetch all products (for homepage/public view)
      products = await db
        .collection('products')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
    }

    // Get section info (for homepage)
    const section = await db.collection('sections')
      .findOne({ name: 'popular-products' });

    return NextResponse.json({ 
      success: true,
      products,
      section: section || { title: 'Popular Products', subtitle: 'Best sellers this winter season' }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch products' 
    }, { status: 500 });
  }
}

// POST - Create new product
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.createdBy) {
      return NextResponse.json({ 
        success: false,
        error: 'User ID required' 
      }, { status: 401 });
    }

    if (!body.title || !body.price || !body.category) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('winter-dog-care-01'); // Change to your database name
    
    // Prepare product data
    const productData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('products').insertOne(productData);

    return NextResponse.json({ 
      success: true,
      message: 'Product created successfully',
      productId: result.insertedId 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to create product' 
    }, { status: 500 });
  }
}