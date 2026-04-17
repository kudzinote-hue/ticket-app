import { TicketForm } from "@/components/TicketForn";


export default function SubmitPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Submit a Support Ticket</h1>
      <TicketForm />
    </div>
  );
}