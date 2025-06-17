'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit2, Search, Filter, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { deleteExpense } from '@/lib/database';
import { Database } from '@/lib/supabase';
import { toast } from 'sonner';

type Expense = Database['public']['Tables']['expenses']['Row'] & {
  category: Database['public']['Tables']['categories']['Row'] | null;
};

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseDeleted: () => void;
}

export function ExpenseList({ expenses, onExpenseDeleted }: ExpenseListProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState<string | null>(null);

  // Obter categorias únicas das despesas - corrigindo o erro de tipo
  const categories = Array.from(
    new Set(
      expenses
        .map(expense => expense.category?.name)
        .filter((name): name is string => Boolean(name))
    )
  );

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || expense.category?.name === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    setLoading(id);
    try {
      await deleteExpense(id);
      toast.success('Despesa excluída com sucesso!');
      onExpenseDeleted();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir despesa');
    } finally {
      setLoading(null);
    }
  };

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Receipt className="h-4 w-4 text-white" />
          </div>
          Suas Despesas
        </CardTitle>
        <CardDescription>
          Gerencie e visualize todas as suas despesas registradas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4 border border-emerald-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Total ({filteredExpenses.length} despesa{filteredExpenses.length !== 1 ? 's' : ''})
            </span>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              R$ {totalAmount.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>

        {/* Expense List */}
        <div className="space-y-3">
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhuma despesa encontrada</p>
              <p className="text-gray-400 text-sm">
                {search || categoryFilter ? 'Tente ajustar os filtros' : 'Adicione sua primeira despesa acima'}
              </p>
            </div>
          ) : (
            filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{expense.description}</h3>
                    {expense.category && (
                      <Badge 
                        className="text-white border-0"
                        style={{ backgroundColor: expense.category.color }}
                      >
                        {expense.category.name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {format(new Date(expense.date), 'PPP', { locale: ptBR })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-gray-900">
                    R$ {expense.amount.toFixed(2).replace('.', ',')}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
                      disabled={loading === expense.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}