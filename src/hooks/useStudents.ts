import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/untypedClient";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { 
  saveToOfflineStorage, 
  getAllFromOfflineStorage, 
  addToSyncQueue,
  clearOfflineStorage
} from "@/lib/offlineStorage";

export type Student = {
  id: string;
  name: string;
  father_name: string;
  class_id?: string;
  admission_date: string;
  contact?: string;
  photo_url?: string;
  age?: number;
  grade?: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export const useStudents = () => {
  const queryClient = useQueryClient();
  const { madrasaName } = useAuth();

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students", madrasaName],
    queryFn: async () => {
      // Try to fetch from server first
      if (navigator.onLine) {
        try {
          const { data, error } = await supabase
            .from("students")
            .select("*")
            .order("created_at", { ascending: false });
          
          if (error) throw error;
          
          // Cache data for offline use
          await clearOfflineStorage('students');
          for (const student of data) {
            await saveToOfflineStorage('students', student.id, student);
          }
          
          return data as Student[];
        } catch (error) {
          console.error('Fetch error, using offline data:', error);
        }
      }
      
      // If offline or error, use cached data
      const offlineData = await getAllFromOfflineStorage('students');
      return offlineData as Student[];
    },
    enabled: !!madrasaName,
  });

  const addStudent = useMutation({
    mutationFn: async (student: Omit<Student, "id" | "created_at" | "updated_at">) => {
      if (navigator.onLine) {
        const { data, error } = await supabase.from("students").insert(student).select().single();
        if (error) throw error;
        
        // Save to offline storage
        if (data) {
          await saveToOfflineStorage('students', data.id, data);
        }
        return data;
      } else {
        // Create temporary ID for offline
        const tempId = `temp-${Date.now()}`;
        const tempStudent = { 
          ...student, 
          id: tempId, 
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        await saveToOfflineStorage('students', tempId, tempStudent);
        await addToSyncQueue('students', 'insert', student);
        
        toast.warning('آف لائن: تبدیلیاں بعد میں sync ہوں گی');
        return tempStudent;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      if (navigator.onLine) {
        toast.success("طالب علم شامل ہو گیا");
      }
    },
    onError: (error: any) => {
      toast.error(`Failed to add student: ${error.message}`);
    },
  });

  const updateStudent = useMutation({
    mutationFn: async ({ id, ...student }: Partial<Student> & { id: string }) => {
      if (navigator.onLine) {
        const { data, error } = await supabase.from("students").update(student).eq("id", id).select().single();
        if (error) throw error;
        
        if (data) {
          await saveToOfflineStorage('students', data.id, data);
        }
        return data;
      } else {
        const updatedStudent = { ...student, id };
        await saveToOfflineStorage('students', id, updatedStudent);
        await addToSyncQueue('students', 'update', updatedStudent);
        
        toast.warning('آف لائن: تبدیلیاں بعد میں sync ہوں گی');
        return updatedStudent;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      if (navigator.onLine) {
        toast.success("طالب علم اپ ڈیٹ ہو گیا");
      }
    },
    onError: (error: any) => {
      toast.error(`Failed to update student: ${error.message}`);
    },
  });

  const deleteStudent = useMutation({
    mutationFn: async (id: string) => {
      if (navigator.onLine) {
        const { error } = await supabase.from("students").delete().eq("id", id);
        if (error) throw error;
      } else {
        await addToSyncQueue('students', 'delete', { id });
        toast.warning('آف لائن: تبدیلیاں بعد میں sync ہوں گی');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      if (navigator.onLine) {
        toast.success("طالب علم حذف ہو گیا");
      }
    },
    onError: (error: any) => {
      toast.error(`Failed to delete student: ${error.message}`);
    },
  });

  return {
    students,
    isLoading,
    addStudent: addStudent.mutate,
    updateStudent: updateStudent.mutate,
    deleteStudent: deleteStudent.mutate,
  };
};
