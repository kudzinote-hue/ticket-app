import { TicketList } from '@/components/TicketList';
import { ReportSummary } from '@/components/ReportSummary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ops Assistant Dashboard</h1>
        <Link href="/submit">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </Link>
      </div>
      
      <ReportSummary />
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Tickets</h2>
        <TicketList />
      </div>
    </div>
  );
}