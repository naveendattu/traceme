export interface Subject {
  id: string;
  name: string;
  code: string;
  totalClasses: number;
  attendedClasses: number;
  color: string;
}

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  date: string;
  status: 'present' | 'absent';
}

export interface AttendanceStats {
  overallPercentage: number;
  totalClasses: number;
  totalAttended: number;
  subjectsAtRisk: number;
}
