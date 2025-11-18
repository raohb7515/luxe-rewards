import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch only active prizes
    const prizes = await prisma.prize.findMany({
      where: { isActive: true },
      orderBy: { points: 'asc' },
    });

    // Map prizes to ensure no null/undefined fields break the API
    const safePrizes = prizes.map((prize) => ({
      id: prize.id,
      name: prize.name,
      description: prize.description,
      image: prize.image || '', // fallback if null
      points: prize.points ?? 0, // fallback if null
      stock: prize.stock ?? 0,   // fallback if null
      isActive: prize.isActive,
      createdAt: prize.createdAt,
      updatedAt: prize.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      prizes: safePrizes,
    });
  } catch (error) {
    console.error('Error fetching prizes:', error); // Log the real error for debugging
    return NextResponse.json(
      { success: false, error: 'Failed to fetch prizes' },
      { status: 500 }
    );
  }
}
