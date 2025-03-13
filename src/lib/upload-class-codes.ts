
import { supabase } from './supabase';
import { ClassCode } from './class-code-service';

// Function to create database tables for the application
export const createDatabaseTables = async () => {
  try {
    // Create subjects table
    await createSubjectsTable();
    
    // Create students table
    await createStudentsTable();
    
    return { success: true };
  } catch (error) {
    console.error('Error creating database tables:', error);
    return { success: false, error };
  }
};

// Function to create the subjects table
const createSubjectsTable = async () => {
  try {
    // Check if table exists
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .limit(1);
    
    if (error && error.code === '42P01') {
      // Create table if it doesn't exist using raw SQL
      const { error: createError } = await supabase
        .rpc('create_subjects_table', {});
      
      if (createError) {
        console.error('Error creating subjects table:', createError);
        // Table might already exist, continue anyway
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating subjects table:', error);
    return { success: false, error };
  }
};

// Function to create the students table
const createStudentsTable = async () => {
  try {
    // Check if table exists
    const { data, error } = await supabase
      .from('students_section_a')
      .select('*')
      .limit(1);
    
    if (error && error.code === '42P01') {
      // Create table if it doesn't exist using raw SQL
      const { error: createError } = await supabase
        .rpc('create_students_table', {});
      
      if (createError) {
        console.error('Error creating students table:', createError);
        // Table might already exist, continue anyway
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating students table:', error);
    return { success: false, error };
  }
};

// Function to upload class codes to database
export const uploadClassCodes = async (createTable = false) => {
  try {
    // First, ensure class_codes table exists
    const { error: tableError } = await supabase
      .from('class_codes')
      .select('id')
      .limit(1);

    if (tableError && tableError.code === '42P01' && createTable) {
      // Create the table
      await supabase
        .from('class_codes')
        .insert([{ id: 1, temp: 'temp' }])
        .select();

      // Remove the temporary row
      await supabase
        .from('class_codes')
        .delete()
        .eq('id', 1);
    }

    // Sample class codes
    const classCodes: Omit<ClassCode, 'id'>[] = [
      { sno: 1, year: 12, section: 'A', code: 'CA12A001' },
      { sno: 2, year: 12, section: 'B', code: 'CA12B002' },
      { sno: 3, year: 12, section: 'C', code: 'CA12C003' },
      { sno: 4, year: 12, section: 'D', code: 'CA12D004' },
      { sno: 5, year: 12, section: 'E', code: 'CA12E005' },
    ];

    // Upload class codes
    const { error: insertError } = await supabase
      .from('class_codes')
      .upsert(classCodes, { onConflict: 'sno' });

    if (insertError) {
      console.error('Error uploading class codes:', insertError);
      return { success: false, message: insertError.message, error: insertError };
    }

    return { success: true, message: 'Class codes uploaded successfully' };
  } catch (error) {
    console.error('Error in uploadClassCodes:', error);
    return { success: false, message: 'An unexpected error occurred', error };
  }
};

// Function to upload user class codes to database
export const uploadUserClassCodes = async (createTable = false) => {
  return await uploadClassCodes(createTable);
};

// Function to upload all data
export const uploadAllData = async () => {
  try {
    // Upload subjects data for Section A
    const subjectsData = [
      { id: 1, subject_name: 'DMS', code: '8253A-67K', section: 'A' },
      { id: 2, subject_name: 'TOC', code: '3135B-23X', section: 'A' },
      { id: 3, subject_name: 'DCCN', code: '9402C-11M', section: 'A' },
      { id: 4, subject_name: 'DBMS', code: '2856D-96T', section: 'A' },
      { id: 5, subject_name: 'JAVA', code: '7361E-39J', section: 'A' },
      { id: 6, subject_name: 'MPI', code: '5247F-72L', section: 'A' },
    ];

    const { error: subjectsError } = await supabase
      .from('subjects')
      .upsert(subjectsData, { onConflict: 'id' });

    // Upload students data for Section A
    const studentsData = [
      { id: 1, sno: 1, student_name: 'Aarav Agarwal', student_code: 'X7A2P9Q5L8', parent_code: 'PA9X5L7T3M1', section: 'A' },
      { id: 2, sno: 2, student_name: 'Aakash Anand', student_code: 'M3T8Z1Y4W6', parent_code: 'PA7A3Q9P5G1', section: 'A' },
      { id: 3, sno: 3, student_name: 'Aaryan Ahuja', student_code: 'K9V4B7X2C1', parent_code: 'PA5N1B7M9X3', section: 'A' },
      { id: 4, sno: 4, student_name: 'Aniket Arya', student_code: 'D6Q1N8J5T3', parent_code: 'PA1Y3G9K7T5', section: 'A' },
      { id: 5, sno: 5, student_name: 'Arjun Acharya', student_code: 'P5A9Y2L7Z8', parent_code: 'PA3P9A7X1B5', section: 'A' },
      { id: 6, sno: 6, student_name: 'Aditya Ajmera', student_code: 'C1M6X4T3V9', parent_code: 'PA5X7L3T9M1', section: 'A' },
      { id: 7, sno: 7, student_name: 'Abhinav Arora', student_code: 'W8K7Q2N5B1', parent_code: 'PA1A9Q7P3G6', section: 'A' },
      { id: 8, sno: 8, student_name: 'Aman Awasthi', student_code: 'Y4D3P9L8M2', parent_code: 'PA7N5B9M1X3', section: 'A' },
      { id: 9, sno: 9, student_name: 'Ashish Ameta', student_code: 'A9T5X1Z7Q6', parent_code: 'PA3Y1G7K9T5', section: 'A' },
      { id: 10, sno: 10, student_name: 'Anshul Akhtar', student_code: 'N2V8B4Y3D1', parent_code: 'PA9P1A3X7M6', section: 'A' },
      { id: 11, sno: 11, student_name: 'Avinash Alok', student_code: 'L7M5X9C2Q8', parent_code: 'PA2X9L7T5B3', section: 'A' },
      { id: 12, sno: 12, student_name: 'Arnav Atre', student_code: 'Z4T1K3Y6P9', parent_code: 'PA7A1Q5P9G3', section: 'A' },
      { id: 13, sno: 13, student_name: 'Anirudh Ashraf', student_code: 'X8D2N7M5B4', parent_code: 'PA1N7B5M3X9', section: 'A' },
      { id: 14, sno: 14, student_name: 'Akshay Advani', student_code: 'Q9V1A3T6Y8', parent_code: 'PA6Y9G3K7T1', section: 'A' },
      { id: 15, sno: 15, student_name: 'Amit Aulakh', student_code: 'P7B4L2Z1M6', parent_code: 'PA2P7A9X3M5', section: 'A' },
    ];

    const { error: studentsError } = await supabase
      .from('students_section_a')
      .upsert(studentsData, { onConflict: 'id' });

    return {
      classCodesSuccess: true,
      sectionASuccess: !studentsError && !subjectsError,
      message: studentsError || subjectsError
        ? `Error uploading some data: ${studentsError?.message || ''} ${subjectsError?.message || ''}`
        : 'All data uploaded successfully',
    };
  } catch (error) {
    console.error('Error in uploadAllData:', error);
    return {
      classCodesSuccess: false,
      sectionASuccess: false,
      message: 'An unexpected error occurred',
      error,
    };
  }
};

// Function to check if a teacher code is valid
export const verifyTeacherCode = async (code: string, section: string) => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('code', code)
      .eq('section', section)
      .single();
    
    if (error) {
      console.error('Error verifying teacher code:', error);
      return { valid: false, error };
    }
    
    return { valid: !!data, subject: data?.subject_name };
  } catch (error) {
    console.error('Error in verifyTeacherCode:', error);
    return { valid: false, error };
  }
};

// Function to check if a student code is valid
export const verifyStudentCode = async (code: string) => {
  try {
    const { data, error } = await supabase
      .from('students_section_a')
      .select('*')
      .eq('student_code', code)
      .single();
    
    if (error) {
      console.error('Error verifying student code:', error);
      return { valid: false, error };
    }
    
    return { valid: !!data, student: data };
  } catch (error) {
    console.error('Error in verifyStudentCode:', error);
    return { valid: false, error };
  }
};

// Function to check if a parent code is valid
export const verifyParentCode = async (code: string) => {
  try {
    const { data, error } = await supabase
      .from('students_section_a')
      .select('*')
      .eq('parent_code', code)
      .single();
    
    if (error) {
      console.error('Error verifying parent code:', error);
      return { valid: false, error };
    }
    
    return { valid: !!data, student: data };
  } catch (error) {
    console.error('Error in verifyParentCode:', error);
    return { valid: false, error };
  }
};

// Function to get subject by code
export const getSubjectByCode = async (code: string) => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('code', code)
      .single();
    
    if (error) {
      console.error('Error getting subject by code:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in getSubjectByCode:', error);
    return { success: false, error };
  }
};
