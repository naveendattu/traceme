import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { AttendanceRecord, Subject } from '@/types/attendance';
import { format } from 'date-fns';

interface RecentActivityProps {
  records: AttendanceRecord[];
  subjects: Subject[];
}

const RecentActivity = ({ records, subjects }: RecentActivityProps) => {
  const getSubject = (id: string) => subjects.find((s) => s.id === id);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-md"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Recent Activity
        </h3>
      </div>
      
      <div className="space-y-3">
        {records.slice(0, 5).map((record, index) => {
          const subject = getSubject(record.subjectId);
          if (!subject) return null;
          
          return (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-3 rounded-xl bg-muted/50 p-3"
            >
              {record.status === 'present' ? (
                <div className="rounded-lg bg-success/10 p-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
              ) : (
                <div className="rounded-lg bg-destructive/10 p-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{subject.name}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(record.date), 'MMM dd, yyyy')}</p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  record.status === 'present'
                    ? 'bg-success/10 text-success'
                    : 'bg-destructive/10 text-destructive'
                }`}
              >
                {record.status}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RecentActivity;
