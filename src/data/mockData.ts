import { Subject, AttendanceRecord } from '@/types/attendance';

export const subjects: Subject[] = [
  {
    id: '1',
    name: 'Data Structures',
    code: 'CS201',
    totalClasses: 45,
    attendedClasses: 42,
    color: 'hsl(199 89% 48%)',
  },
  {
    id: '2',
    name: 'Database Systems',
    code: 'CS301',
    totalClasses: 40,
    attendedClasses: 38,
    color: 'hsl(160 84% 39%)',
  },
  {
    id: '3',
    name: 'Operating Systems',
    code: 'CS302',
    totalClasses: 42,
    attendedClasses: 30,
    color: 'hsl(38 92% 50%)',
  },
  {
    id: '4',
    name: 'Computer Networks',
    code: 'CS401',
    totalClasses: 38,
    attendedClasses: 35,
    color: 'hsl(280 65% 55%)',
  },
  {
    id: '5',
    name: 'Software Engineering',
    code: 'CS402',
    totalClasses: 35,
    attendedClasses: 24,
    color: 'hsl(0 84% 60%)',
  },
  {
    id: '6',
    name: 'Machine Learning',
    code: 'CS501',
    totalClasses: 30,
    attendedClasses: 28,
    color: 'hsl(220 70% 55%)',
  },
];

export const recentAttendance: AttendanceRecord[] = [
  { id: '1', subjectId: '1', date: '2026-01-03', status: 'present' },
  { id: '2', subjectId: '2', date: '2026-01-03', status: 'present' },
  { id: '3', subjectId: '3', date: '2026-01-02', status: 'absent' },
  { id: '4', subjectId: '4', date: '2026-01-02', status: 'present' },
  { id: '5', subjectId: '5', date: '2026-01-01', status: 'absent' },
  { id: '6', subjectId: '6', date: '2026-01-01', status: 'present' },
];
