'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useTheme } from 'next-themes';
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { Database } from '@/lib/supabase';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Expense = Database['public']['Tables']['expenses']['Row'] & {
  category: Database['public']['Tables']['categories']['Row'] | null;
};

interface ExpenseAnalyticsProps {
  expenses: Expense[];
}

export function ExpenseAnalytics({ expenses }: ExpenseAnalyticsProps) {
  // Category analysis
  const categoryData = expenses.reduce((acc, expense) => {
    const categoryName = expense.category?.name || 'Sem Categoria';
    const categoryColor = expense.category?.color || '#64748B';
    
    if (!acc[categoryName]) {
      acc[categoryName] = {
        category: categoryName,
        amount: 0,
        color: categoryColor
      };
    }
    acc[categoryName].amount += expense.amount;
    return acc;
  }, {} as Record<string, { category: string; amount: number; color: string }>);

  const categoryChartData = Object.values(categoryData);

  // Monthly analysis
  const monthlyData = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date);
    const monthKey = format(date, 'MMM yyyy', { locale: ptBR });
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        amount: 0,
        count: 0,
        date: date
      };
    }
    acc[monthKey].amount += expense.amount;
    acc[monthKey].count += 1;
    return acc;
  }, {} as Record<string, { month: string; amount: number; count: number; date: Date }>);

  const sortedMonthlyData = Object.values(monthlyData)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(-6); // Últimos 6 meses

  // Statistics
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currentMonth = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
  });
  const currentMonthTotal = currentMonth.reduce((sum, expense) => sum + expense.amount, 0);
  
  const lastMonth = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const lastMonthDate = subMonths(new Date(), 1);
    return expenseDate.getMonth() === lastMonthDate.getMonth() && expenseDate.getFullYear() === lastMonthDate.getFullYear();
  });
  const lastMonthTotal = lastMonth.reduce((sum, expense) => sum + expense.amount, 0);
  
  const monthlyChange = lastMonthTotal > 0 ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;
    const averageExpense = expenses.length > 0 ? totalAmount / expenses.length : 0;

  const { resolvedTheme } = useTheme();
  const tickColor = resolvedTheme === 'dark' ? '#94a3b8' : '#64748b';
  const strokeColor = resolvedTheme === 'dark' ? '#1e293b' : '#e2e8f0';
  const lineColor = resolvedTheme === 'dark' ? '#38bdf8' : '#2563eb';

  interface CustomLabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: CustomLabelProps) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Gasto</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {totalAmount.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Este Mês</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {currentMonthTotal.toFixed(2).replace('.', ',')}
                </p>
                <div className="flex items-center mt-1">
                  {monthlyChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  )}
                  <span className={`text-sm ${monthlyChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {Math.abs(monthlyChange).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gasto Médio</p>
                <p className="text-2xl font-bold text-foreground">
                  R$ {averageExpense.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Despesas</p>
                <p className="text-2xl font-bold text-foreground">{expenses.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
            <CardDescription>Distribuição dos seus gastos por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: resolvedTheme === 'dark' ? '#0f172a' : '#ffffff',
                      borderColor: strokeColor,
                    }}
                    formatter={(value: unknown, name: string, props: { payload?: { category: string } }) => {
                      const categoryName = props.payload?.category || name;
                      if (typeof value === 'number') {
                        return [`R$ ${value.toFixed(2).replace('.', ',')}`, categoryName];
                      }
                      return [`${value}`, categoryName];
                    }}
                    itemStyle={{ color: tickColor }}
                    labelStyle={{ display: 'none' }}
                    cursor={{ fill: resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência Mensal</CardTitle>
            <CardDescription>Evolução dos seus gastos nos últimos meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sortedMonthlyData}>
                  <CartesianGrid stroke={strokeColor} strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fill: tickColor }} stroke={tickColor} fontSize={12} />
                  <YAxis tick={{ fill: tickColor }} stroke={tickColor} fontSize={12} tickFormatter={(value) => `R$${value}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: resolvedTheme === 'dark' ? '#0f172a' : '#ffffff',
                      borderColor: strokeColor,
                    }}
                    labelStyle={{ color: tickColor }}
                    itemStyle={{ color: lineColor }}
                    formatter={(value: number) => [`R$ ${value.toFixed(2).replace('.', ',')}`, 'Valor']}
                  />
                  <Line type="monotone" dataKey="amount" stroke={lineColor} strokeWidth={2} activeDot={{ r: 8 }} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking de Categorias</CardTitle>
          <CardDescription>Suas categorias com maiores gastos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData.sort((a, b) => b.amount - a.amount)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`R$ ${value.toFixed(2).replace('.', ',')}`, 'Valor']}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}