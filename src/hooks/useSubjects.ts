import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Subject {
  id: string;
  user_id: string;
  name: string;
  code: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface SubjectWithStats extends Subject {
  totalClasses: number;
  attendedClasses: number;
}

export const useSubjects = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ['subjects', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Subject[];
    },
    enabled: !!user,
  });

  const { data: attendanceRecords = [] } = useQuery({
    queryKey: ['attendance', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const subjectsWithStats: SubjectWithStats[] = subjects.map((subject) => {
    const subjectRecords = attendanceRecords.filter((r) => r.subject_id === subject.id);
    return {
      ...subject,
      totalClasses: subjectRecords.length,
      attendedClasses: subjectRecords.filter((r) => r.status === 'present').length,
    };
  });

  const createSubject = useMutation({
    mutationFn: async (data: { name: string; code: string; color: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('subjects')
        .insert({
          user_id: user.id,
          name: data.name,
          code: data.code,
          color: data.color,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create subject: ' + error.message);
    },
  });

  const updateSubject = useMutation({
    mutationFn: async (data: { id: string; name: string; code: string; color: string }) => {
      const { error } = await supabase
        .from('subjects')
        .update({
          name: data.name,
          code: data.code,
          color: data.color,
        })
        .eq('id', data.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update subject: ' + error.message);
    },
  });

  const deleteSubject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Subject deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete subject: ' + error.message);
    },
  });

  return {
    subjects: subjectsWithStats,
    isLoading,
    attendanceRecords,
    createSubject,
    updateSubject,
    deleteSubject,
  };
};
