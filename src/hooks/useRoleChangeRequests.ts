import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/untypedClient";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export interface RoleChangeRequest {
  id: string;
  user_id: string;
  requested_role: string;
  status: "pending" | "approved" | "rejected";
  request_message?: string;
  admin_response?: string;
  created_at: string;
  updated_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  user_profile?: {
    full_name: string;
    madrasa_name: string;
  };
}

export const useRoleChangeRequests = () => {
  const queryClient = useQueryClient();
  const { madrasaName } = useAuth();

  // Get all requests (for admins)
  const { data: allRequests, isLoading } = useQuery({
    queryKey: ["role_change_requests", madrasaName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("role_change_requests")
        .select(`
          *,
          user_profile:user_id (
            full_name,
            madrasa_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as RoleChangeRequest[];
    },
    enabled: !!madrasaName,
  });

  // Get current user's requests
  const { data: myRequests, isLoading: isLoadingMyRequests } = useQuery({
    queryKey: ["my_role_change_requests"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("role_change_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as RoleChangeRequest[];
    },
  });

  // Create new request
  const createRequest = useMutation({
    mutationFn: async (newRequest: { requested_role: string; request_message?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("role_change_requests")
        .insert([{ ...newRequest, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role_change_requests"] });
      queryClient.invalidateQueries({ queryKey: ["my_role_change_requests"] });
      toast.success("Role change request submitted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit request: ${error.message}`);
    },
  });

  // Approve request (admin only)
  const approveRequest = useMutation({
    mutationFn: async ({ id, admin_response, requested_role, user_id }: { id: string; admin_response?: string; requested_role: string; user_id: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update request status
      const { error: updateError } = await supabase
        .from("role_change_requests")
        .update({
          status: "approved",
          admin_response,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) throw updateError;

      // Delete existing role for this user
      const { error: deleteError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", user_id);

      if (deleteError) throw deleteError;

      // Assign new role
      const { error: assignError } = await supabase
        .from("user_roles")
        .insert([{ user_id, role: requested_role }]);

      if (assignError) throw assignError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role_change_requests"] });
      queryClient.invalidateQueries({ queryKey: ["user_roles"] });
      toast.success("Role change approved and applied");
    },
    onError: (error: Error) => {
      toast.error(`Failed to approve request: ${error.message}`);
    },
  });

  // Reject request (admin only)
  const rejectRequest = useMutation({
    mutationFn: async ({ id, admin_response }: { id: string; admin_response?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("role_change_requests")
        .update({
          status: "rejected",
          admin_response,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role_change_requests"] });
      toast.success("Role change request rejected");
    },
    onError: (error: Error) => {
      toast.error(`Failed to reject request: ${error.message}`);
    },
  });

  return {
    allRequests,
    myRequests,
    isLoading,
    isLoadingMyRequests,
    createRequest,
    approveRequest,
    rejectRequest,
  };
};