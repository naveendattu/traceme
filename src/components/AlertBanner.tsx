import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { SubjectWithStats } from '@/hooks/useSubjects';
import { useState } from 'react';

interface AlertBannerProps {
  subjects: SubjectWithStats[];
}

const AlertBanner = ({ subjects }: AlertBannerProps) => {
  const [dismissed, setDismissed] = useState(false);
  
  const atRiskSubjects = subjects.filter(
    (s) => s.totalClasses > 0 && (s.attendedClasses / s.totalClasses) * 100 < 75
  );
  
  if (atRiskSubjects.length === 0 || dismissed) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative overflow-hidden rounded-2xl border border-warning/30 bg-warning/5 p-4"
      >
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-warning/20 p-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">Low Attendance Alert!</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              You have {atRiskSubjects.length} subject{atRiskSubjects.length > 1 ? 's' : ''} with attendance below 75%:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {atRiskSubjects.map((subject) => (
                <span
                  key={subject.id}
                  className="inline-flex items-center rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning"
                >
                  {subject.name} ({Math.round((subject.attendedClasses / subject.totalClasses) * 100)}%)
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="rounded-lg p-1 hover:bg-warning/10 transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertBanner;
