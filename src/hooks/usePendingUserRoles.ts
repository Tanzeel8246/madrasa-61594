import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/untypedClient";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export interface PendingUserRole {
  id: string;
  email: string;
  role: string;
  created_by: string | null;
  created_at: string;
}

export const usePendingUserRoles = () => {
  const queryClient = useQueryClient();
  const { madrasaName } = useAuth();

  const { data: pendingRoles, isLoading } = useQuery({
    queryKey: ["pending_user_roles", madrasaName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pending_user_roles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PendingUserRole[];
    },
    enabled: !!madrasaName,
  });

  const createPendingRole = useMutation({
    mutationFn: async (newRole: { email: string; role: string }) => {
      const { data, error } = await supabase
        .from("pending_user_roles")
        .insert([newRole])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending_user_roles"] });
      toast.success("Role assigned to email successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to assign role: ${error.message}`);
    },
  });

  const deletePendingRole = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pending_user_roles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending_user_roles"] });
      toast.success("Pending role removed successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove pending role: ${error.message}`);
    },
  });

  return {
    pendingRoles,
    isLoading,
    createPendingRole,
    deletePendingRole,
  };
};
