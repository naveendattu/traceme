import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, AlertTriangle, Calendar, Plus, BarChart3, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import SubjectCard from '@/components/SubjectCard';
import AlertBanner from '@/components/AlertBanner';
import RecentActivity from '@/components/RecentActivity';
import OverviewCard from '@/components/OverviewCard';
import SubjectModal from '@/components/SubjectModal';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import CalendarView from '@/components/CalendarView';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSubjects, SubjectWithStats } from '@/hooks/useSubjects';
import { useAttendance } from '@/hooks/useAttendance';

type TabType = 'dashboard' | 'analytics' | 'calendar';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { subjects, isLoading, attendanceRecords, createSubject, updateSubject, deleteSubject } = useSubjects();
  const { markAttendance } = useAttendance();
  
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectWithStats | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const stats = useMemo(() => {
    const totalClasses = subjects.reduce((sum, s) => sum + s.totalClasses, 0);
    const totalAttended = subjects.reduce((sum, s) => sum + s.attendedClasses, 0);
    const overallPercentage = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;
    const subjectsAtRisk = subjects.filter(
      (s) => s.totalClasses > 0 && (s.attendedClasses / s.totalClasses) * 100 < 75
    ).length;
    
    return { totalClasses, totalAttended, overallPercentage, subjectsAtRisk };
  }, [subjects]);

  const handleMarkAttendance = (subjectId: string, status: 'present' | 'absent') => {
    markAttendance.mutate({ subjectId, status });
  };

  const handleCreateOrUpdateSubject = (data: { name: string; code: string; color: string }) => {
    if (editingSubject) {
      updateSubject.mutate({ id: editingSubject.id, ...data }, {
        onSuccess: () => {
          setModalOpen(false);
          setEditingSubject(null);
        },
      });
    } else {
      createSubject.mutate(data, {
        onSuccess: () => {
          setModalOpen(false);
        },
      });
    }
  };

  const handleEditSubject = (subject: SubjectWithStats) => {
    setEditingSubject(subject);
    setModalOpen(true);
  };

  const handleDeleteSubject = (id: string) => {
    if (confirm('Are you sure you want to delete this subject? All attendance records will be lost.')) {
      deleteSubject.mutate(id);
    }
  };

  const todayClasses = subjects.length;

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-background">
      <Header alertCount={stats.subjectsAtRisk} userName={userName} />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-foreground">
            Welcome back, <span className="bg-gradient-primary bg-clip-text text-transparent">{userName.split(' ')[0]}!</span>
          </h2>
          <p className="mt-1 text-muted-foreground">Here's your attendance summary.</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'outline'}
            onClick={() => setActiveTab('dashboard')}
            className={activeTab === 'dashboard' ? 'bg-gradient-primary' : ''}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'default' : 'outline'}
            onClick={() => setActiveTab('analytics')}
            className={activeTab === 'analytics' ? 'bg-gradient-primary' : ''}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button
            variant={activeTab === 'calendar' ? 'default' : 'outline'}
            onClick={() => setActiveTab('calendar')}
            className={activeTab === 'calendar' ? 'bg-gradient-primary' : ''}
          >
            <CalendarDays className="h-4 w-4 mr-2" />
            Calendar
          </Button>
        </div>

        {activeTab === 'dashboard' && (
          <>
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
                subtitle="Active subjects"
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
                title="Today's Subjects"
                value={todayClasses}
                subtitle="Mark attendance"
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
                  <h3 className="text-xl font-semibold text-foreground">Your Subjects</h3>
                  <Button
                    onClick={() => {
                      setEditingSubject(null);
                      setModalOpen(true);
                    }}
                    className="bg-gradient-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subject
                  </Button>
                </motion.div>
                
                {isLoading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading subjects...</div>
                ) : subjects.length === 0 ? (
                  <div className="text-center py-12 rounded-2xl border border-dashed border-border bg-card">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h4 className="font-semibold text-foreground mb-2">No subjects yet</h4>
                    <p className="text-muted-foreground mb-4">Add your first subject to start tracking attendance</p>
                    <Button onClick={() => setModalOpen(true)} className="bg-gradient-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Subject
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {subjects.map((subject, index) => (
                      <SubjectCard
                        key={subject.id}
                        subject={subject}
                        index={index}
                        onMarkAttendance={handleMarkAttendance}
                        onEdit={handleEditSubject}
                        onDelete={handleDeleteSubject}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <RecentActivity records={attendanceRecords} subjects={subjects} />
              </div>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsCharts subjects={subjects} attendanceRecords={attendanceRecords} />
        )}

        {activeTab === 'calendar' && (
          <CalendarView subjects={subjects} attendanceRecords={attendanceRecords} />
        )}
      </main>

      <SubjectModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingSubject(null);
        }}
        onSubmit={handleCreateOrUpdateSubject}
        subject={editingSubject}
        loading={createSubject.isPending || updateSubject.isPending}
      />
    </div>
  );
};

export default Index;
