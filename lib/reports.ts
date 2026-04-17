import { Ticket, DailyReport, TicketCategory } from '@/types';
import { ticketStore } from './db';
import { subDays, format, differenceInHours, parseISO } from 'date-fns';

export function generateDailyReport(date?: Date): DailyReport {
  const targetDate = date || new Date();
  const dateStr = format(targetDate, 'yyyy-MM-dd');
  
  const allTickets = ticketStore.getAll();
  
  // Tickets from the last 7 days (for anomaly detection)
  const last7DaysTickets = allTickets.filter(t => {
    const ticketDate = parseISO(t.timestamp);
    return ticketDate >= subDays(targetDate, 7) && ticketDate <= targetDate;
  });

  // Today's tickets
  const todayTickets = allTickets.filter(t => {
    return format(parseISO(t.timestamp), 'yyyy-MM-dd') === dateStr;
  });

  const totalTickets = todayTickets.length;

  // Volume by category (department)
  const volumeByCategory: Record<TicketCategory, number> = {
    IT: 0,
    HR: 0,
    Access: 0,
    Payroll: 0,
    Other: 0,
  };
  todayTickets.forEach(t => {
    if (t.category) volumeByCategory[t.category]++;
  });

  // Average response time (simulated for resolved tickets)
  const resolvedToday = todayTickets.filter(t => t.resolvedAt);
  let averageResponseTimeHours = 0;
  if (resolvedToday.length > 0) {
    const totalHours = resolvedToday.reduce((sum, t) => {
      const created = parseISO(t.timestamp);
      const resolved = parseISO(t.resolvedAt!);
      return sum + differenceInHours(resolved, created);
    }, 0);
    averageResponseTimeHours = totalHours / resolvedToday.length;
  }

  // Find top department by ticket volume
  const departments = Object.entries(volumeByCategory) as [TicketCategory, number][];
  const sortedDepartments = departments.sort((a, b) => b[1] - a[1]);
  const topDepartment = sortedDepartments[0][0];
  const topDepartmentCount = sortedDepartments[0][1];

  // Department breakdown for display
  const departmentsByIssues = sortedDepartments.map(([dept, count]) => ({
    department: dept,
    count,
    percentage: totalTickets > 0 ? (count / totalTickets) * 100 : 0,
  }));

  // For backward compatibility, keep topIssues but populate with department data
  const topIssues = sortedDepartments
    .filter(([_, count]) => count > 0)
    .map(([dept, count]) => ({
      issue: `${dept} Tickets`,
      count,
    }));

  // Anomaly detection: compare today's count to previous 6 days avg
  const previous6DaysCounts: number[] = [];
  for (let i = 1; i <= 6; i++) {
    const day = subDays(targetDate, i);
    const dayStr = format(day, 'yyyy-MM-dd');
    previous6DaysCounts.push(
      allTickets.filter(t => format(parseISO(t.timestamp), 'yyyy-MM-dd') === dayStr).length
    );
  }
  const avgCount = previous6DaysCounts.reduce((a, b) => a + b, 0) / 6;
  const stdDev = Math.sqrt(
    previous6DaysCounts.reduce((sum, c) => sum + Math.pow(c - avgCount, 2), 0) / 6
  );
  const anomalyDetected = totalTickets > avgCount + 2 * stdDev;
  const anomalyMessage = anomalyDetected
    ? `Ticket volume (${totalTickets}) is significantly higher than the 7-day average (${avgCount.toFixed(1)}).`
    : undefined;

  return {
    date: dateStr,
    totalTickets,
    volumeByCategory,
    averageResponseTimeHours,
    topDepartment,
    topDepartmentCount,
    departmentsByIssues,
    topIssues, // Keep for backward compatibility
    anomaly: {
      detected: anomalyDetected,
      message: anomalyMessage,
      currentCount: totalTickets,
      averageCount: avgCount,
    },
  };
}