import { supabase } from './supabase';
import { Database } from './supabase';

type Tables = Database['public']['Tables'];
type Expense = Tables['expenses']['Row'];
type ExpenseInsert = Tables['expenses']['Insert'];
type ExpenseUpdate = Tables['expenses']['Update'];
type Category = Tables['categories']['Row'];
type Budget = Tables['budgets']['Row'];
type BudgetInsert = Tables['budgets']['Insert'];
type Profile = Tables['profiles']['Row'];

// Funções para Categorias
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

// Funções para Despesas
export async function getExpenses(userId: string): Promise<(Expense & { category: Category | null })[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addExpense(expense: ExpenseInsert): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .insert(expense)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateExpense(id: string, updates: ExpenseUpdate): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteExpense(id: string): Promise<void> {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Funções para Orçamentos
export async function getBudgets(userId: string, month: number, year: number): Promise<(Budget & { category: Category })[]> {
  const { data, error } = await supabase
    .from('budgets')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('user_id', userId)
    .eq('month', month)
    .eq('year', year);

  if (error) throw error;
  return data || [];
}

export async function setBudget(budget: BudgetInsert): Promise<Budget> {
  const { data, error } = await supabase
    .from('budgets')
    .upsert(budget, {
      onConflict: 'user_id,category_id,month,year'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBudget(id: string): Promise<void> {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Funções para Perfil
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Funções de Análise
export async function getExpensesByCategory(userId: string, startDate?: string, endDate?: string) {
  let query = supabase
    .from('expenses')
    .select(`
      amount,
      category:categories(name, color)
    `)
    .eq('user_id', userId);

  if (startDate) query = query.gte('date', startDate);
  if (endDate) query = query.lte('date', endDate);

  const { data, error } = await query;
  if (error) throw error;

  // Agrupar por categoria
  const grouped = (data || []).reduce((acc, expense) => {
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

  return Object.values(grouped);
}

export async function getMonthlyExpenses(userId: string, months: number = 6) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const { data, error } = await supabase
    .from('expenses')
    .select('amount, date')
    .eq('user_id', userId)
    .gte('date', startDate.toISOString().split('T')[0])
    .lte('date', endDate.toISOString().split('T')[0])
    .order('date');

  if (error) throw error;

  // Agrupar por mês
  const grouped = (data || []).reduce((acc, expense) => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        amount: 0,
        count: 0
      };
    }
    acc[monthKey].amount += expense.amount;
    acc[monthKey].count += 1;
    return acc;
  }, {} as Record<string, { month: string; amount: number; count: number }>);

  return Object.values(grouped).sort((a, b) => a.month.localeCompare(b.month));
}