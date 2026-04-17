import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { ticketStore } from '@/lib/db';
import { classifyTicket } from '@/lib/triage';
import { Ticket, TicketCategory } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.title || !body.description || !body.user) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, user' },
        { status: 400 }
      );
    }

    const ticket: Ticket = {
      id: uuidv4(),
      title: body.title,
      description: body.description,
      user: body.user,
      timestamp: new Date().toISOString(),
    };

    // If category is provided manually, validate and use it
    if (body.category) {
      const validCategories: TicketCategory[] = ['IT', 'HR', 'Access', 'Payroll', 'Other'];
      if (validCategories.includes(body.category)) {
        ticket.category = body.category;
      }
    }

    // Run triage for priority and suggested response (and category if not set)
    const triageResult = classifyTicket(ticket);
    if (!ticket.category) {
      ticket.category = triageResult.category;
    }
    ticket.priority = triageResult.priority;
    ticket.suggestedResponse = triageResult.suggestedResponse;

    ticketStore.add(ticket);

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON or server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '50');
  const tickets = ticketStore.getRecent(limit);
  return NextResponse.json(tickets);
}