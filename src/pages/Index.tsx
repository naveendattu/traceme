import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, AlertTriangle, Calendar } from 'lucide-react';
import { toast } from 'sonner';

import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import SubjectCard from '@/components/SubjectCard';
import AlertBanner from '@/components/AlertBanner';
import RecentActivity from '@/components/RecentActivity';
import OverviewCard from '@/components/OverviewCard';
import { subjects as initialSubjects, recentAttendance as initialRecords } from '@/data/mockData';
import { Subject, AttendanceRecord } from '@/types/attendance';

const Index = () => {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords);
  
  const stats = useMemo(() => {
    const totalClasses = subjects.reduce((sum, s) => sum + s.totalClasses, 0);
    const totalAttended = subjects.reduce((sum, s) => sum + s.attendedClasses, 0);
    const overallPercentage = Math.round((totalAttended / totalClasses) * 100);
    const subjectsAtRisk = subjects.filter(
      (s) => (s.attendedClasses / s.totalClasses) * 100 < 75
    ).length;
    
    return { totalClasses, totalAttended, overallPercentage, subjectsAtRisk };
  }, [subjects]);
  
  const handleMarkAttendance = (subjectId: string, status: 'present' | 'absent') => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              totalClasses: s.totalClasses + 1,
              attendedClasses: status === 'present' ? s.attendedClasses + 1 : s.attendedClasses,
            }
          : s
      )
    );
    
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      subjectId,
      date: new Date().toISOString().split('T')[0],
      status,
    };
    
    setRecords((prev) => [newRecord, ...prev]);
    
    const subject = subjects.find((s) => s.id === subjectId);
    toast.success(`Marked ${status} for ${subject?.name}`, {
      description: `Attendance updated successfully!`,
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header alertCount={stats.subjectsAtRisk} />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-foreground">
            Welcome back, <span className="bg-gradient-primary bg-clip-text text-transparent">John!</span>
          </h2>
          <p className="mt-1 text-muted-foreground">Here's your attendance summary for this semester.</p>
        </motion.div>
        
        <div className="mb-8">
          <AlertBanner subjects={subjects} />
        </div>
        
        <div className="mb-8">
          <OverviewCard
            percentage={stats.overallPercentage}
            totalClasses={stats.totalClasses}
            attendedClasses={stats.totalAttended}
          />
        </div>
        
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Subjects"
            value={subjects.length}
            subtitle="This semester"
            icon={BookOpen}
            variant="default"
            delay={0}
          />
          <StatsCard
            title="Classes Attended"
            value={stats.totalAttended}
            subtitle={`of ${stats.totalClasses} total`}
            icon={Users}
            variant="success"
            delay={0.1}
          />
          <StatsCard
            title="At Risk Subjects"
            value={stats.subjectsAtRisk}
            subtitle="Below 75%"
            icon={AlertTriangle}
            variant={stats.subjectsAtRisk > 0 ? 'danger' : 'success'}
            delay={0.2}
          />
          <StatsCard
            title="Today's Classes"
            value={3}
            subtitle="2 remaining"
            icon={Calendar}
            variant="warning"
            delay={0.3}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 flex items-center justify-between"
            >
              <h3 className="text-xl font-semibold text-foreground">Subject-wise Attendance</h3>
            </motion.div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {subjects.map((subject, index) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  index={index}
                  onMarkAttendance={handleMarkAttendance}
                />
              ))}
            </div>
          </div>
          
          <div>
            <RecentActivity records={records} subjects={subjects} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
