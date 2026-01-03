import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useAttendance = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const markAttendance = useMutation({
    mutationFn: async (data: { subjectId: string; status: 'present' | 'absent'; date?: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      const date = data.date || new Date().toISOString().split('T')[0];
      
      // Check if record exists for this date
      const { data: existing } = await supabase
        .from('attendance_records')
        .select('id')
        .eq('subject_id', data.subjectId)
        .eq('date', date)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('attendance_records')
          .update({ status: data.status })
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('attendance_records')
          .insert({
            user_id: user.id,
            subject_id: data.subjectId,
            date: date,
            status: data.status,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success(`Marked ${variables.status} successfully!`);
    },
    onError: (error) => {
      toast.error('Failed to mark attendance: ' + error.message);
    },
  });

  return { markAttendance };
};
