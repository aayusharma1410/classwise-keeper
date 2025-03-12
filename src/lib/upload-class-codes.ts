import { supabase } from './supabase';
import { ClassCode, saveClassCodes, replaceAllClassCodes } from './class-code-service';

// Parse the student data CSV into structured objects
export const parseStudentData = (csvData: string) => {
  const lines = csvData.trim().split('\n');
  
  // Find where the actual data starts (after headers)
  const dataStartIndex = lines.findIndex(line => line.startsWith('1,'));
  
  if (dataStartIndex === -1) return [];
  
  // Get subject mappings from the first few rows
  const subjects = [];
  for (let i = dataStartIndex; i < dataStartIndex + 6; i++) {
    const [, subject, code] = lines[i].split(',').map(item => item?.trim()).filter(Boolean);
    if (subject && code) {
      subjects.push({ subject, code });
    }
  }
  
  // Parse student records
  const students = [];
  for (let i = dataStartIndex; i < lines.length; i++) {
    const columns = lines[i].split(',').map(item => item?.trim()).filter(Boolean);
    if (columns.length >= 3) {
      const studentCode = columns[3] || '';
      const parentCode = columns[4] || '';
      const studentName = columns[2] || '';
      
      if (studentName && studentCode && parentCode) {
        students.push({
          name: studentName,
          student_code: studentCode,
          parent_code: parentCode,
          section: 'A', // Hardcoded for Section A
          subjects: subjects.map(s => ({ ...s }))
        });
      }
    }
  }
  
  return { subjects, students };
};

// Upload student data to Supabase
export const uploadStudentData = async (csvData: string) => {
  try {
    console.log('Parsing student data...');
    const { subjects, students } = parseStudentData(csvData);
    console.log('Parsed students:', students.length);
    console.log('Parsed subjects:', subjects);
    
    // First, ensure the tables exist and are properly structured
    const { error: tableError } = await supabase.from('students_section_a').select().limit(1).catch(() => ({ error: true }));
    
    if (tableError) {
      // Create the table if it doesn't exist
      await supabase.rpc('create_students_table');
    }
    
    // Insert or update the student records
    const { error: insertError } = await supabase
      .from('students_section_a')
      .upsert(students, {
        onConflict: 'student_code',
        ignoreDuplicates: false
      });
    
    if (insertError) {
      console.error('Error uploading student data:', insertError);
      return { success: false, message: 'Failed to upload student data', error: insertError };
    }
    
    return { success: true, message: 'Student data uploaded successfully' };
  } catch (error) {
    console.error('Error processing student data:', error);
    return { success: false, message: 'Error processing student data', error };
  }
};

// Parse the CSV data into ClassCode objects
export const parseClassCodeData = (csvData: string): Omit<ClassCode, 'id'>[] => {
  // Split the CSV data into lines
  const lines = csvData.trim().split('\n');
  
  // Skip the header line (first line)
  const dataLines = lines.slice(1);
  
  // Parse each line into a ClassCode object
  return dataLines.map(line => {
    const [sno, year, section, code] = line.split(',').map(item => item.trim());
    return {
      sno: parseInt(sno),
      year: parseInt(year),
      section,
      code
    };
  });
};

// Upload class codes to the Supabase database
export const uploadClassCodes = async (csvData: string, replace: boolean = false) => {
  try {
    console.log('Parsing class code data...');
    const classCodes = parseClassCodeData(csvData);
    console.log('Parsed class codes:', classCodes);
    
    // Save the class codes to the database
    let result;
    if (replace) {
      result = await replaceAllClassCodes(classCodes);
    } else {
      result = await saveClassCodes(classCodes);
    }
    
    if (result.success) {
      console.log('Class codes uploaded successfully');
      return { success: true, message: 'Class codes uploaded successfully' };
    } else {
      console.error('Failed to upload class codes:', result.error);
      return { success: false, message: 'Failed to upload class codes', error: result.error };
    }
  } catch (error) {
    console.error('Error uploading class codes:', error);
    return { success: false, message: 'Error uploading class codes', error };
  }
};

// Upload function for the data provided by the user
export const uploadUserClassCodes = async (replace: boolean = true) => {
  const userData = `S.NO,YEAR,SECTION ,CODE
1,2,A,2025A-45S
2,2,B,5946B-84G
3,2,C,7944C-98R
4,2,D,3596D-74W
5,2,E,1464E-78Q`;

  return await uploadClassCodes(userData, replace);
};

// Direct upload function for the provided data
export const uploadSampleClassCodes = async () => {
  const sampleData = `S.NO,YEAR,SECTION ,CODE
1,2,A,2025A-45S
2,2,B,5946B-84G
3,2,C,7944C-98R
4,2,D,3596D-74W
5,2,E,1464E-78Q`;

  return await uploadClassCodes(sampleData);
};
