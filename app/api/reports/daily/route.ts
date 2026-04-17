import { NextResponse } from 'next/server';
import { generateDailyReport } from '@/lib/reports';

export async function GET() {
  const report = generateDailyReport();
  return NextResponse.json(report);
}