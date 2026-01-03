import { motion } from 'framer-motion';
import { Subject } from '@/types/attendance';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SubjectCardProps {
  subject: Subject;
  index: number;
  onMarkAttendance: (subjectId: string, status: 'present' | 'absent') => void;
}

const SubjectCard = ({ subject, index, onMarkAttendance }: SubjectCardProps) => {
  const percentage = Math.round((subject.attendedClasses / subject.totalClasses) * 100);
  const isAtRisk = percentage < 75;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-2xl border bg-card p-5 shadow-md transition-all hover:shadow-lg ${
        isAtRisk ? 'border-destructive/30' : 'border-border'
      }`}
    >
      {isAtRisk && (
        <div className="absolute right-3 top-3">
          <div className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
            <AlertTriangle className="h-3 w-3" />
            Low
          </div>
        </div>
      )}
      
      <div 
        className="mb-4 h-1 w-12 rounded-full" 
        style={{ backgroundColor: subject.color }}
      />
      
      <h3 className="font-semibold text-foreground">{subject.name}</h3>
      <p className="text-sm text-muted-foreground">{subject.code}</p>
      
      <div className="mt-4">
        <div className="flex items-end justify-between mb-2">
          <span className="text-2xl font-bold text-foreground">{percentage}%</span>
          <span className="text-sm text-muted-foreground">
            {subject.attendedClasses}/{subject.totalClasses} classes
          </span>
        </div>
        <Progress 
          value={percentage} 
          className="h-2"
          style={{ 
            ['--progress-background' as string]: isAtRisk ? 'hsl(var(--destructive))' : subject.color 
          }}
        />
      </div>
      
      <div className="mt-4 flex gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onMarkAttendance(subject.id, 'present')}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-success/10 py-2.5 text-sm font-medium text-success hover:bg-success/20 transition-colors"
        >
          <CheckCircle2 className="h-4 w-4" />
          Present
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onMarkAttendance(subject.id, 'absent')}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-destructive/10 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/20 transition-colors"
        >
          <AlertTriangle className="h-4 w-4" />
          Absent
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SubjectCard;
