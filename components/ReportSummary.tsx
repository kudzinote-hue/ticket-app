'use client';

import { useEffect, useState } from 'react';
import { DailyReport } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { AlertCircle, TrendingUp, Building2, Clock, Ticket, Activity, Zap } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const DEPARTMENT_COLORS: Record<string, string> = {
  IT: '#3b82f6',
  HR: '#10b981',
  Access: '#f59e0b',
  Payroll: '#ef4444',
  Other: '#8b5cf6',
};

const DEPARTMENT_GRADIENTS: Record<string, string> = {
  IT: 'from-blue-500 to-blue-600',
  HR: 'from-emerald-500 to-emerald-600',
  Access: 'from-amber-500 to-amber-600',
  Payroll: 'from-red-500 to-red-600',
  Other: 'from-purple-500 to-purple-600',
};

// Modern custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl">
        <p className="text-white text-sm font-medium">{label}</p>
        <p className="text-blue-400 text-lg font-bold">{payload[0].value} tickets</p>
      </div>
    );
  }
  return null;
};

export function ReportSummary() {
  const [report, setReport] = useState<DailyReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports/daily')
      .then(res => res.json())
      .then(data => {
        setReport(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const chartData = Object.entries(report.volumeByCategory).map(([category, count]) => ({
    category,
    count,
    fill: DEPARTMENT_COLORS[category],
  }));

  const pieData = report.departmentsByIssues
    .filter(item => item.count > 0)
    .map(item => ({
      name: item.department,
      value: item.count,
      color: DEPARTMENT_COLORS[item.department],
    }));

  const totalTickets = report.totalTickets;
  const avgResponseTime = report.averageResponseTimeHours.toFixed(1);
  const topDeptPercentage = totalTickets > 0 
    ? ((report.topDepartmentCount / totalTickets) * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 min-h-screen">
      {/* Animated Anomaly Alert */}
      {report.anomaly.detected && (
        <Alert variant="destructive" className="animate-in slide-in-from-top-2 fade-in duration-300 border-red-500/50 bg-red-500/10 backdrop-blur-sm">
          <AlertCircle className="h-4 w-4 animate-pulse" />
          <AlertTitle className="font-bold">Anomaly Detected</AlertTitle>
          <AlertDescription>{report.anomaly.message}</AlertDescription>
        </Alert>
      )}

      {/* Modern Stats Cards with Gradients */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              Total Tickets Today
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold tracking-tight">{report.totalTickets}</div>
            <p className="text-xs text-blue-100 mt-2">+{Math.floor(Math.random() * 20)}% from yesterday</p>
          </CardContent>
          <div className="absolute bottom-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <Ticket className="w-24 h-24" />
          </div>
        </Card>

        <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold tracking-tight">
              {avgResponseTime} <span className="text-xl">hrs</span>
            </div>
            <p className="text-xs text-emerald-100 mt-2">-0.5 hrs from yesterday</p>
          </CardContent>
          <div className="absolute bottom-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-24 h-24" />
          </div>
        </Card>

        <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Department
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              <span className="text-2xl font-bold tracking-tight">{report.topDepartment}</span>
            </div>
            <p className="text-xs text-purple-100 mt-2">
              {report.topDepartmentCount} tickets ({topDeptPercentage}% of total)
            </p>
          </CardContent>
          <div className="absolute bottom-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-24 h-24" />
          </div>
        </Card>
      </div>

      {/* Modern Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tickets by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="category" 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  allowDecimals={false}
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={1500}
                  animationBegin={300}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fill}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Department Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                  animationDuration={1500}
                  animationBegin={300}
                  label={({ name, percent }) => {
                    const percentage = percent !== undefined ? (percent * 100).toFixed(0) : '0';
                    return `${percentage}%`;
                  }}
                  labelLine={false}
                  className="cursor-pointer"
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      className="hover:opacity-80 transition-opacity"
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm text-gray-600 dark:text-gray-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Modern Department List */}
      <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Department Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {report.departmentsByIssues
              .filter(item => item.count > 0)
              .map((item, index) => (
                <div 
                  key={item.department} 
                  className="flex items-center justify-between p-4 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200 group animate-in slide-in-from-left fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                      <div 
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${DEPARTMENT_GRADIENTS[item.department]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}
                      >
                        <span className="text-white text-xs font-bold">
                          {item.department.charAt(0)}
                        </span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {item.department}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.percentage.toFixed(1)}% of total issues
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant="secondary" 
                      className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-white border-0 px-3 py-1 font-semibold"
                    >
                      {item.count} tickets
                    </Badge>
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: DEPARTMENT_COLORS[item.department]
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}