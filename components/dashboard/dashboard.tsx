'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpenseForm } from '@/components/expenses/expense-form';
import { ExpenseList } from '@/components/expenses/expense-list';
import { ExpenseAnalytics } from '@/components/analytics/expense-analytics';
import { Header } from '@/components/layout/header';
import { getExpenses, addExpense, getCategories } from '@/lib/database';
import { useAuthContext } from '@/contexts/auth-context';
import { Database } from '@/lib/supabase';
import { Loader2, Plus, Receipt, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Expense = Database['public']['Tables']['expenses']['Row'] & {
  category: Database['public']['Tables']['categories']['Row'] | null;
};

export function Dashboard() {
  const { user } = useAuthContext();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  // Adiciona despesas de exemplo se o usuário não tiver nenhuma
  const addExampleExpenses = async () => {
    if (!user) return;
    const categories = await getCategories();
    const exampleExpenses = [
      {
        description: 'Almoço no restaurante',
        amount: 35.50,
        category_id: categories.find(c => c.name === 'Alimentação')?.id || null,
        date: new Date().toISOString().split('T')[0],
      },
      {
        description: 'Uber para o trabalho',
        amount: 18.90,
        category_id: categories.find(c => c.name === 'Transporte')?.id || null,
        date: new Date().toISOString().split('T')[0],
      },
      {
        description: 'Internet mensal',
        amount: 99.99,
        category_id: categories.find(c => c.name === 'Tecnologia')?.id || null,
        date: new Date().toISOString().split('T')[0],
      },
    ];
    for (const expense of exampleExpenses) {
      await addExpense({
        user_id: user.id,
        ...expense,
      });
    }
  };

  const loadExpenses = async () => {
    if (!user) return;
    try {
      const data = await getExpenses(user.id);
      // Se não houver despesas, adiciona exemplos e recarrega
      if (data.length === 0) {
        await addExampleExpenses();
        const newData = await getExpenses(user.id);
        setExpenses(newData);
      } else {
        setExpenses(data);
      }
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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard Financeiro</h2>
            <p className="text-muted-foreground">Gerencie suas despesas e analise seus gastos de forma inteligente</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.info('Funcionalidade em breve!')}>Exportar CSV</Button>
            <Button variant="outline" onClick={() => toast.info('Funcionalidade em breve!')}>Orçamento Mensal</Button>
          </div>
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