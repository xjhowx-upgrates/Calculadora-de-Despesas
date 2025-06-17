'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpenseForm } from '@/components/expenses/expense-form';
import { ExpenseList } from '@/components/expenses/expense-list';
import { ExpenseAnalytics } from '@/components/analytics/expense-analytics';
import { Header } from '@/components/layout/header';
import { getExpenses } from '@/lib/database';
import { useAuthContext } from '@/contexts/auth-context';
import { Database } from '@/lib/supabase';
import { Loader2, Plus, Receipt, BarChart3 } from 'lucide-react';

type Expense = Database['public']['Tables']['expenses']['Row'] & {
  category: Database['public']['Tables']['categories']['Row'] | null;
};

export function Dashboard() {
  const { user } = useAuthContext();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const loadExpenses = async () => {
    if (!user) return;
    
    try {
      const data = await getExpenses(user.id);
      setExpenses(data);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Financeiro</h2>
          <p className="text-gray-600">Gerencie suas despesas e analise seus gastos de forma inteligente</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Minhas Despesas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ExpenseAnalytics expenses={expenses} />
          </TabsContent>

          <TabsContent value="add">
            <div className="max-w-2xl mx-auto">
              <ExpenseForm onExpenseAdded={loadExpenses} />
            </div>
          </TabsContent>

          <TabsContent value="list">
            <ExpenseList expenses={expenses} onExpenseDeleted={loadExpenses} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}