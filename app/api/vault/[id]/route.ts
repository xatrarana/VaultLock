import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// DELETE - Delete vault entry
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const entryId = params.id;

    // Check if entry exists and belongs to user
    const existingEntry = await prisma.vaultEntry.findFirst({
      where: {
        id: entryId,
        userId,
      },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    await prisma.vaultEntry.delete({
      where: { id: entryId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vault entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update vault entry
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const entryId = params.id;
    const body = await req.json();

    // Check if entry exists and belongs to user
    const existingEntry = await prisma.vaultEntry.findFirst({
      where: {
        id: entryId,
        userId,
      },
    });

    if (!existingEntry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    const updatedEntry = await prisma.vaultEntry.update({
      where: { id: entryId },
      data: {
        title: body.title,
        username: body.username,
        encryptedPassword: body.encryptedPassword,
        notes: body.notes,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error('Error updating the vault Entry');
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    )
  }}