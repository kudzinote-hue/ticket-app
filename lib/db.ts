import fs from 'fs';
import path from 'path';
import { Ticket } from '@/types';

const dataDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load initial data
let tickets: Ticket[] = [];
if (fs.existsSync(dbPath)) {
  try {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    const parsed = JSON.parse(raw);
    tickets = parsed.tickets || [];
  } catch {
    tickets = [];
  }
}

// Helper to save to disk
const save = () => {
  fs.writeFileSync(dbPath, JSON.stringify({ tickets }, null, 2));
};

export const ticketStore = {
  getAll: (): Ticket[] => tickets,

  getById: (id: string): Ticket | undefined =>
    tickets.find(t => t.id === id),

  add: (ticket: Ticket): void => {
    tickets.push(ticket);
    save();
  },

  update: (id: string, updates: Partial<Ticket>): void => {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      Object.assign(ticket, updates);
      save();
    }
  },

  getRecent: (limit = 20): Ticket[] =>
    [...tickets]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit),
};