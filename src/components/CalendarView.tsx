import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { SubjectWithStats } from '@/hooks/useSubjects';

interface CalendarViewProps {
  subjects: SubjectWithStats[];
  attendanceRecords: Array<{
    id: string;
    subject_id: string;
    date: string;
    status: string;
  }>;
}

const CalendarView = ({ subjects, attendanceRecords }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSubject, setSelectedSubject] = useState<string | 'all'>('all');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad the beginning to start from Sunday
  const startDay = monthStart.getDay();
  const paddedDays = Array(startDay).fill(null).concat(days);

  const getDayStatus = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayRecords = attendanceRecords.filter((r) => {
      if (selectedSubject !== 'all' && r.subject_id !== selectedSubject) return false;
      return r.date === dateStr;
    });

    if (dayRecords.length === 0) return null;

    const presentCount = dayRecords.filter((r) => r.status === 'present').length;
    const absentCount = dayRecords.filter((r) => r.status === 'absent').length;

    if (absentCount === 0) return 'present';
    if (presentCount === 0) return 'absent';
    return 'mixed';
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-md"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Attendance Calendar
        </h3>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
        >
          <option value="all">All Subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="rounded-lg p-2 hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <h4 className="text-lg font-semibold text-foreground">
          {format(currentDate, 'MMMM yyyy')}
        </h4>
        <button
          onClick={goToNextMonth}
          className="rounded-lg p-2 hover:bg-muted transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {paddedDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const status = getDayStatus(day);
          const isCurrentDay = isToday(day);

          return (
            <motion.div
              key={day.toISOString()}
              whileHover={{ scale: 1.1 }}
              className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer
                ${isCurrentDay ? 'ring-2 ring-primary' : ''}
                ${status === 'present' ? 'bg-success/20 text-success' : ''}
                ${status === 'absent' ? 'bg-destructive/20 text-destructive' : ''}
                ${status === 'mixed' ? 'bg-warning/20 text-warning' : ''}
                ${!status ? 'text-foreground hover:bg-muted' : ''}
              `}
            >
              {format(day, 'd')}
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-success/50" />
          <span className="text-muted-foreground">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-destructive/50" />
          <span className="text-muted-foreground">Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-warning/50" />
          <span className="text-muted-foreground">Mixed</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarView;
