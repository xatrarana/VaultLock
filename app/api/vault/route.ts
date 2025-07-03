import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma as db } from '@/lib/prisma';
import { CreateVaultEntryRequest } from '@/types/vault';

// GET - Fetch user's vault entries
export async function GET() {
  try {
    const { userId } = await auth();

    console.log(`From the api/vault/get the user id is: ${userId}`)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const entries = await db.vaultEntry.findMany({
      where: { userId },
    });

    return NextResponse.json(entries || []);
  } catch (error) {
    console.error('Error fetching vault entries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new vault entry
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateVaultEntryRequest = await req.json();
    
    // Validate required fields
    if (!body.title || !body.username || !body.encryptedPassword) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newEntry = await db.vaultEntry.create({
      data: {
        userId,
        title: body.title,
        username: body.username,
        encryptedPassword: body.encryptedPassword,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating vault entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
