import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/untypedClient";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export type Budget = {
  id: string;
  madrasa_name: string;
  category: string;
  amount: number;
  month: number;
  year: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
};

export const useBudgets = () => {
  const queryClient = useQueryClient();
  const { madrasaName } = useAuth();

  const { data: budgets = [], isLoading } = useQuery({
    queryKey: ["budgets", madrasaName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .order("year", { ascending: false })
        .order("month", { ascending: false });
      if (error) throw error;
      return data as Budget[];
    },
    enabled: !!madrasaName,
  });

  const addBudget = useMutation({
    mutationFn: async (budget: Omit<Budget, "id" | "madrasa_name" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("budgets")
        .insert(budget)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Budget set successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to set budget: ${error.message}`);
    },
  });

  const updateBudget = useMutation({
    mutationFn: async ({ id, ...budget }: Partial<Budget> & { id: string }) => {
      const { data, error } = await supabase
        .from("budgets")
        .update(budget)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Budget updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update budget: ${error.message}`);
    },
  });

  const deleteBudget = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("budgets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      toast.success("Budget deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete budget: ${error.message}`);
    },
  });

  return {
    budgets,
    isLoading,
    addBudget: addBudget.mutate,
    updateBudget: updateBudget.mutate,
    deleteBudget: deleteBudget.mutate,
  };
};
