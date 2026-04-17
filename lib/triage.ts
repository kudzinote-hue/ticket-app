import { Ticket, TicketCategory, Priority, KnowledgeBaseEntry } from '@/types';

const knowledgeBase: KnowledgeBaseEntry[] = [
  {
    patterns: [/password|reset|login|access denied|2fa|mfa/i],
    category: 'Access',
    priority: 'High',
    responseTemplate: 'We have received your access issue. Please verify your identity using the link sent to your email. If the issue persists, contact IT support.'
  },
  {
    patterns: [/payroll|salary|payment|wage|compensation/i],
    category: 'Payroll',
    priority: 'High',
    responseTemplate: 'Your payroll inquiry has been forwarded to the finance team. Please allow 1-2 business days for a response.'
  },
  {
    patterns: [/hardware|laptop|monitor|keyboard|mouse|printer|vpn|wifi|network/i],
    category: 'IT',
    priority: 'Medium',
    responseTemplate: 'IT support will review your hardware/software issue. If urgent, please call the helpdesk at ext. 1234.'
  },
  {
    patterns: [/vacation|leave|pto|benefits|policy|remote/i],
    category: 'HR',
    priority: 'Low',
    responseTemplate: 'HR has received your inquiry. Please refer to the employee handbook for immediate answers, or expect a reply within 48 hours.'
  },
  {
    patterns: [/urgent|asap|immediately|critical|down|outage/i],
    category: 'Other',
    priority: 'High',
    responseTemplate: 'This issue has been flagged as urgent. A specialist will contact you shortly.'
  }
];

export function classifyTicket(ticket: Ticket): { category: TicketCategory; priority: Priority; suggestedResponse: string } {
  const text = `${ticket.title} ${ticket.description}`.toLowerCase();
  
  let bestMatch: KnowledgeBaseEntry | undefined;
  let highestScore = 0;

  for (const entry of knowledgeBase) {
    const matches = entry.patterns.filter(p => p.test(text)).length;
    const score = matches / entry.patterns.length;
    if (score > highestScore) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch) {
    return {
      category: bestMatch.category,
      priority: bestMatch.priority,
      suggestedResponse: bestMatch.responseTemplate
    };
  }

  // Default fallback
  return {
    category: 'Other',
    priority: 'Medium',
    suggestedResponse: 'Thank you for your ticket. Our team will review it and respond within 24 hours.'
  };
}