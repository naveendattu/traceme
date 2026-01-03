import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, PieChartIcon, BarChart3 } from 'lucide-react';
import { SubjectWithStats } from '@/hooks/useSubjects';

interface AnalyticsChartsProps {
  subjects: SubjectWithStats[];
  attendanceRecords: Array<{
    id: string;
    subject_id: string;
    date: string;
    status: string;
  }>;
}

const AnalyticsCharts = ({ subjects, attendanceRecords }: AnalyticsChartsProps) => {
  const subjectData = useMemo(() => {
    return subjects.map((s) => ({
      name: s.code,
      percentage: s.totalClasses > 0 ? Math.round((s.attendedClasses / s.totalClasses) * 100) : 0,
      attended: s.attendedClasses,
      total: s.totalClasses,
      color: s.color,
    }));
  }, [subjects]);

  const weeklyData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map((date) => {
      const dayRecords = attendanceRecords.filter((r) => r.date === date);
      const present = dayRecords.filter((r) => r.status === 'present').length;
      const absent = dayRecords.filter((r) => r.status === 'absent').length;
      const total = present + absent;
      
      return {
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        present,
        absent,
        percentage: total > 0 ? Math.round((present / total) * 100) : 0,
      };
    });
  }, [attendanceRecords]);

  const overallStats = useMemo(() => {
    const totalPresent = attendanceRecords.filter((r) => r.status === 'present').length;
    const totalAbsent = attendanceRecords.filter((r) => r.status === 'absent').length;
    
    return [
      { name: 'Present', value: totalPresent, color: 'hsl(160 84% 39%)' },
      { name: 'Absent', value: totalAbsent, color: 'hsl(0 84% 60%)' },
    ];
  }, [attendanceRecords]);

  if (subjects.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Add subjects and mark attendance to see analytics
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Subject-wise Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-md"
      >
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          Subject-wise Attendance
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={subjectData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar dataKey="percentage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Weekly Trend Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-md"
      >
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-success" />
          Weekly Attendance Trend
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Line
              type="monotone"
              dataKey="percentage"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Overall Distribution Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border bg-card p-6 shadow-md lg:col-span-2"
      >
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <PieChartIcon className="h-5 w-5 text-warning" />
          Overall Attendance Distribution
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={overallStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {overallStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-4">
            {overallStats.map((stat) => (
              <div key={stat.name} className="flex items-center gap-3">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: stat.color }}
                />
                <span className="text-foreground font-medium">{stat.name}</span>
                <span className="text-muted-foreground">({stat.value} classes)</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsCharts;
