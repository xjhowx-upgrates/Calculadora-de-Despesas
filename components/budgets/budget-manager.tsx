"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { getCategories, getBudgets, setBudget, getExpensesByCategory } from '@/lib/database';
import { useAuthContext } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { Loader2, AlertTriangle, PiggyBank } from 'lucide-react';

interface BudgetManagerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function BudgetManager({ isOpen, onOpenChange }: BudgetManagerProps) {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
    const [displayData, setDisplayData] = useState<any[]>([]);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (isOpen && user) {
      fetchData();
    }
  }, [isOpen, user]);

    const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString().split('T')[0];
    const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString().split('T')[0];

    try {
      const [categories, budgets, expenses] = await Promise.all([
        getCategories(),
        getBudgets(user.id, currentMonth.getMonth() + 1, currentMonth.getFullYear()),
        getExpensesByCategory(user.id, startDate, endDate),
      ]);

      const expenseMap = new Map(expenses.map(e => [e.category, e.amount]));
      const budgetMap = new Map(budgets.map(b => [b.category_id, b]));
      const initialInputs: Record<string, string> = {};

      const mergedData = categories.map(category => {
        const budget = budgetMap.get(category.id);
        const spent = expenseMap.get(category.name) || 0;
        initialInputs[category.id] = budget ? String(budget.amount) : '';
        return {
          ...category,
          budgetId: budget?.id,
          budgetAmount: budget ? Number(budget.amount) : 0,
          spentAmount: spent,
          progress: budget && budget.amount > 0 ? (spent / Number(budget.amount)) * 100 : 0,
        };
      });

      setDisplayData(mergedData);
      setInputValues(initialInputs);

    } catch (error: any) {
      toast.error('Erro ao buscar dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

    const handleBudgetChange = (categoryId: string, value: string) => {
    setInputValues(prev => ({ ...prev, [categoryId]: value }));
  };

    const handleSave = async (categoryId: string) => {
    const amountStr = inputValues[categoryId];
    if (!amountStr || isNaN(parseFloat(amountStr))) {
      toast.warning('Por favor, insira um valor numérico válido.');
      return;
    }
    const amount = parseFloat(amountStr);

    if (!user) return;

    const budgetData = {
      user_id: user.id,
      category_id: categoryId,
      amount: amount,
      month: currentMonth.getMonth() + 1,
      year: currentMonth.getFullYear(),
    };

    try {
            const savingToast = toast.loading('Salvando orçamento...');
      await setBudget(budgetData);
      toast.dismiss(savingToast);
      toast.success('Orçamento salvo com sucesso!');
      fetchData(); // Refresh data
    } catch (error: any) { 
      toast.error('Erro ao salvar orçamento: ' + error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PiggyBank className="h-6 w-6 text-primary"/>
            Orçamento Mensal
          </DialogTitle>
          <DialogDescription>
            Defina seus limites de gastos para cada categoria no mês de {currentMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}.
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                        {displayData.length === 0 && !loading && (
              <div className="text-center text-muted-foreground py-8">
                <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
                <p>Nenhuma categoria encontrada.</p>
                <p className="text-xs">Adicione categorias primeiro para definir orçamentos.</p>
              </div>
            )}
            {displayData.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg bg-background/50">
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor={`budget-${item.id}`} className="text-lg font-medium">{item.name}</Label>
                  <span className="text-sm text-muted-foreground">
                    Gasto: {item.spentAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <Input
                    id={`budget-${item.id}`}
                    type="number"
                    placeholder="Ex: 500,00"
                    value={inputValues[item.id] || ''}
                    onChange={(e) => handleBudgetChange(item.id, e.target.value)}
                    className="flex-grow"
                  />
                  <Button onClick={() => handleSave(item.id)}>Salvar</Button>
                </div>
                <Progress value={item.progress > 100 ? 100 : item.progress} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Progresso: {item.progress.toFixed(0)}%</span>
                  <span>Orçamento: {item.budgetAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
