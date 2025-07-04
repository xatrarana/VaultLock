import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod'

// DELETE - Delete vault entry
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {id: entryId} = await params;

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

const UpdateVaultSchema = z.object({
  title: z.string(),
  username: z.string(),
  encryptedPassword: z.string(),
  notes: z.string().optional(),
});

export async function PUT(req:Request,  { params }: { params: Promise<{ id: string }> } ) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {id: entryId} = await params;
    const json = await req.json();
    const body = UpdateVaultSchema.safeParse(json);

    if (!body.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: body.error.flatten() },
        { status: 400 }
      );
    }

    const existingEntry = await prisma.vaultEntry.findFirst({
      where: { id: entryId, userId },
    });

    if (!existingEntry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    const updatedEntry = await prisma.vaultEntry.update({
      where: { id: entryId },
      data: {
        title: body.data.title,
        username: body.data.username,
        encryptedPassword: body.data.encryptedPassword,
        notes: body.data.notes || '',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error('Error updating vault entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}