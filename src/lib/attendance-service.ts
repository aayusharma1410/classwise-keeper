
import { supabase } from './supabase';

export interface AttendanceRecord {
  id?: number;
  student_id: string;
  class_id: string;
  subject_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  teacher_id: string;
}

export const saveAttendance = async (attendanceRecords: Omit<AttendanceRecord, 'id'>[]) => {
  try {
    // Make sure we're sending string IDs, not numbers
    const formattedRecords = attendanceRecords.map(record => ({
      ...record,
      student_id: String(record.student_id),
      class_id: String(record.class_id),
      subject_id: String(record.subject_id),
      teacher_id: String(record.teacher_id)
    }));
    
    console.log('Saving attendance records:', formattedRecords);
    
    const { data, error } = await supabase
      .from('attendance')
      .upsert(
        formattedRecords,
        { onConflict: 'student_id,date,subject_id', ignoreDuplicates: false }
      );
    
    if (error) {
      console.error('Supabase error saving attendance:', error);
      throw error;
    }
    
    console.log('Attendance saved successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error saving attendance:', error);
    return { success: false, error };
  }
};

export const getStudentAttendance = async (studentId: string) => {
  try {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    return { success: false, error };
  }
};

export const getMentorStudentsAttendance = async (mentorCode: string) => {
  try {
    // This query assumes there's a relationship between mentor and students in the database
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('id')
      .eq('mentor_code', mentorCode);
    
    if (studentsError) throw studentsError;
    
    if (!students || students.length === 0) {
      return { success: true, data: [] };
    }
    
    const studentIds = students.map(student => student.id);
    
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .in('student_id', studentIds)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching mentor students attendance:', error);
    return { success: false, error };
  }
};

export const calculateAttendancePercentage = (records: AttendanceRecord[]) => {
  if (!records || records.length === 0) return "0%";
  
  const totalClasses = records.length;
  const presentClasses = records.filter(record => record.status === 'present').length;
  
  return `${Math.round((presentClasses / totalClasses) * 100)}%`;
};

export const groupAttendanceByMonth = (records: AttendanceRecord[]) => {
  const grouped: Record<string, { present: number; absent: number; late: number; total: number }> = {};
  
  records.forEach(record => {
    const date = new Date(record.date);
    const month = date.toLocaleString('default', { month: 'long' });
    
    if (!grouped[month]) {
      grouped[month] = { present: 0, absent: 0, late: 0, total: 0 };
    }
    
    grouped[month][record.status]++;
    grouped[month].total++;
  });
  
  return Object.entries(grouped).map(([month, stats]) => ({
    month,
    present: stats.present,
    absent: stats.absent,
    late: stats.late,
    percentage: `${Math.round((stats.present / stats.total) * 100)}%`
  }));
};
