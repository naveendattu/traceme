import { motion } from 'framer-motion';
import CircularProgress from './CircularProgress';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface OverviewCardProps {
  percentage: number;
  totalClasses: number;
  attendedClasses: number;
}

const OverviewCard = ({ percentage, totalClasses, attendedClasses }: OverviewCardProps) => {
  const trend = percentage >= 75;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-card p-6 shadow-lg"
    >
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-primary opacity-10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-secondary/20 blur-2xl" />
      
      <div className="relative flex flex-col md:flex-row items-center gap-6">
        <CircularProgress percentage={percentage} />
        
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-foreground">Attendance Overview</h2>
          <p className="mt-1 text-muted-foreground">
            Keep it up! Maintain above 75% for eligibility.
          </p>
          
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
            <div className="rounded-xl bg-muted/50 px-4 py-2">
              <p className="text-sm text-muted-foreground">Total Classes</p>
              <p className="text-xl font-bold text-foreground">{totalClasses}</p>
            </div>
            <div className="rounded-xl bg-muted/50 px-4 py-2">
              <p className="text-sm text-muted-foreground">Attended</p>
              <p className="text-xl font-bold text-foreground">{attendedClasses}</p>
            </div>
            <div className="rounded-xl bg-muted/50 px-4 py-2">
              <p className="text-sm text-muted-foreground">Missed</p>
              <p className="text-xl font-bold text-foreground">{totalClasses - attendedClasses}</p>
            </div>
          </div>
          
          <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
            trend ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          }`}>
            {trend ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {trend ? 'On track for eligibility' : 'Need improvement'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OverviewCard;
