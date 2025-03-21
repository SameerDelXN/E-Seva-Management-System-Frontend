import connectDB from '@/utils/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
    await connectDB();
    return NextResponse.json({ message: 'MongoDB connection successful!' });
}