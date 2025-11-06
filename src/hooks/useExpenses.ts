import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/untypedClient";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export type Expense = {
  id: string;
  madrasa_name: string;
  title: string;
  description?: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  payment_method?: string;
  receipt_url?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
};

export const useExpenses = () => {
  const queryClient = useQueryClient();
  const { madrasaName } = useAuth();

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ["expenses", madrasaName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      return data as Expense[];
    },
    enabled: !!madrasaName,
  });

  const addExpense = useMutation({
    mutationFn: async (expense: Omit<Expense, "id" | "madrasa_name" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("expenses")
        .insert(expense)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Transaction added successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to add transaction: ${error.message}`);
    },
  });

  const updateExpense = useMutation({
    mutationFn: async ({ id, ...expense }: Partial<Expense> & { id: string }) => {
      const { data, error } = await supabase
        .from("expenses")
        .update(expense)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Transaction updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update transaction: ${error.message}`);
    },
  });

  const deleteExpense = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Transaction deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete transaction: ${error.message}`);
    },
  });

  // Calculate totals
  const totalIncome = expenses
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalExpense = expenses
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const balance = totalIncome - totalExpense;

  return {
    expenses,
    isLoading,
    addExpense: addExpense.mutate,
    updateExpense: updateExpense.mutate,
    deleteExpense: deleteExpense.mutate,
    totalIncome,
    totalExpense,
    balance,
  };
};
