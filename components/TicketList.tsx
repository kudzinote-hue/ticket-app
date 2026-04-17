'use client';

import { useEffect, useState } from 'react';
import { Ticket } from '@/types';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';

export function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    fetch('/api/tickets?limit=10')
      .then(res => res.json())
      .then(setTickets);
  }, []);

  const priorityColor = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map(ticket => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">{ticket.title}</TableCell>
              <TableCell>{ticket.user}</TableCell>
              <TableCell>{ticket.category || '—'}</TableCell>
              <TableCell>
                {ticket.priority && (
                  <Badge className={priorityColor[ticket.priority]}>
                    {ticket.priority}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(ticket.timestamp), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}