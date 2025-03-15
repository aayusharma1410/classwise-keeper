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
    // Check if table exists first
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .limit(1);
    
    if (error && error.code === '42P01') {
      // Table doesn't exist, create it using SQL
      const { error: createError } = await supabase.rpc('create_subjects_table');
      
      if (createError) {
        console.error('Error creating subjects table:', createError);
        
        // Alternative approach: create table using insert
        const { error: insertError } = await supabase
          .from('subjects')
          .insert([{ 
            id: 1, 
            subject_name: 'DMS', 
            code: '8253A-67K',
            section: 'A'
          }]);
        
        if (insertError && insertError.code !== '23505') {
          console.error('Error creating subjects table with insert:', insertError);
        }
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
    // Check if table exists first
    const { data, error } = await supabase
      .from('students_section_a')
      .select('*')
      .limit(1);
    
    if (error && error.code === '42P01') {
      // Table doesn't exist, create it using SQL
      const { error: createError } = await supabase.rpc('create_students_table');
      
      if (createError) {
        console.error('Error creating students table:', createError);
        
        // Alternative approach: create table using insert
        const { error: insertError } = await supabase
          .from('students_section_a')
          .insert([{ 
            id: 1, 
            sno: 1,
            student_name: 'Aarav Agarwal',
            student_code: 'X7A2P9Q5L8',
            parent_code: 'PA9X5L7T3M1',
            section: 'A',
            photo_url: null
          }]);
        
        if (insertError && insertError.code !== '23505') {
          console.error('Error creating students table with insert:', insertError);
        }
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating students table:', error);
    return { success: false, error };
  }
};

// Create storage bucket for student photos
const createStorageBucket = async () => {
  try {
    // Check if bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return { success: false, error: bucketsError };
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'student-photos');
    
    if (!bucketExists) {
      // Create the bucket
      const { data, error } = await supabase.storage.createBucket('student-photos', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
      });
      
      if (error) {
        console.error('Error creating storage bucket:', error);
        return { success: false, error };
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in createStorageBucket:', error);
    return { success: false, error };
  }
};

// Function to upload all data
export const uploadAllData = async () => {
  try {
    // Upload subjects data for all sections
    const subjectsData = [
      // Section A
      { id: 1, subject_name: 'DMS', code: '8253A-67K', section: 'A' },
      { id: 2, subject_name: 'TOC', code: '3135B-23X', section: 'A' },
      { id: 3, subject_name: 'DCCN', code: '9402C-11M', section: 'A' },
      { id: 4, subject_name: 'DBMS', code: '2856D-96T', section: 'A' },
      { id: 5, subject_name: 'JAVA', code: '7361E-39J', section: 'A' },
      { id: 6, subject_name: 'MPI', code: '5247F-72L', section: 'A' },
      
      // Section B
      { id: 7, subject_name: 'DMS', code: '6138A-59N', section: 'B' },
      { id: 8, subject_name: 'TOC', code: '8472B-64Y', section: 'B' },
      { id: 9, subject_name: 'DCCN', code: '4593C-32H', section: 'B' },
      { id: 10, subject_name: 'DBMS', code: '1678D-90V', section: 'B' },
      { id: 11, subject_name: 'JAVA', code: '3814E-21U', section: 'B' },
      { id: 12, subject_name: 'MPI', code: '9925F-47P', section: 'B' },
      
      // Section C
      { id: 13, subject_name: 'DMS', code: '4762A-88D', section: 'C' },
      { id: 14, subject_name: 'TOC', code: '2507B-53O', section: 'C' },
      { id: 15, subject_name: 'DCCN', code: '8134C-76Z', section: 'C' },
      { id: 16, subject_name: 'DBMS', code: '6259D-42B', section: 'C' },
      { id: 17, subject_name: 'JAVA', code: '7983E-19E', section: 'C' },
      { id: 18, subject_name: 'MPI', code: '1546F-81C', section: 'C' },
      
      // Section D
      { id: 19, subject_name: 'DMS', code: '3682A-33M', section: 'D' },
      { id: 20, subject_name: 'TOC', code: '7425B-25N', section: 'D' },
      { id: 21, subject_name: 'DCCN', code: '9023C-50Y', section: 'D' },
      { id: 22, subject_name: 'DBMS', code: '4361D-71W', section: 'D' },
      { id: 23, subject_name: 'JAVA', code: '2584E-97H', section: 'D' },
      { id: 24, subject_name: 'MPI', code: '6709F-66X', section: 'D' },
      
      // Section E
      { id: 25, subject_name: 'DMS', code: '5273A-17J', section: 'E' },
      { id: 26, subject_name: 'TOC', code: '3852B-60R', section: 'E' },
      { id: 27, subject_name: 'DCCN', code: '1496C-55Q', section: 'E' },
      { id: 28, subject_name: 'DBMS', code: '2187D-80S', section: 'E' },
      { id: 29, subject_name: 'JAVA', code: '6349E-14T', section: 'E' },
      { id: 30, subject_name: 'MPI', code: '7751F-48L', section: 'E' },
    ];

    const { error: subjectsError } = await supabase
      .from('subjects')
      .upsert(subjectsData, { onConflict: 'id' });

    // Create storage bucket for student photos if it doesn't exist
    await createStorageBucket();

    // Upload the new comprehensive list of students for Section A with photo_url field
    const studentsData = [
      { id: 1, sno: 1, student_name: 'Aarav Agarwal', student_code: 'X7A2P9Q5L8', parent_code: 'PA9X5L7T3M1', section: 'A', photo_url: null },
      { id: 2, sno: 2, student_name: 'Aakash Anand', student_code: 'M3T8Z1Y4W6', parent_code: 'PA7A3Q9P5G1', section: 'A', photo_url: null },
      { id: 3, sno: 3, student_name: 'Aaryan Ahuja', student_code: 'K9V4B7X2C1', parent_code: 'PA5N1B7M9X3', section: 'A', photo_url: null },
      { id: 4, sno: 4, student_name: 'Aniket Arya', student_code: 'D6Q1N8J5T3', parent_code: 'PA1Y3G9K7T5', section: 'A', photo_url: null },
      { id: 5, sno: 5, student_name: 'Arjun Acharya', student_code: 'P5A9Y2L7Z8', parent_code: 'PA3P9A7X1B5', section: 'A', photo_url: null },
      { id: 6, sno: 6, student_name: 'Aditya Ajmera', student_code: 'C1M6X4T3V9', parent_code: 'PA5X7L3T9M1', section: 'A', photo_url: null },
      { id: 7, sno: 7, student_name: 'Abhinav Arora', student_code: 'W8K7Q2N5B1', parent_code: 'PA1A9Q7P3G6', section: 'A', photo_url: null },
      { id: 8, sno: 8, student_name: 'Aman Awasthi', student_code: 'Y4D3P9L8M2', parent_code: 'PA7N5B9M1X3', section: 'A', photo_url: null },
      { id: 9, sno: 9, student_name: 'Ashish Ameta', student_code: 'A9T5X1Z7Q6', parent_code: 'PA3Y1G7K9T5', section: 'A', photo_url: null },
      { id: 10, sno: 10, student_name: 'Anshul Akhtar', student_code: 'N2V8B4Y3D1', parent_code: 'PA9P1A3X7M6', section: 'A', photo_url: null },
      { id: 11, sno: 11, student_name: 'Avinash Alok', student_code: 'L7M5X9C2Q8', parent_code: 'PA2X9L7T5B3', section: 'A', photo_url: null },
      { id: 12, sno: 12, student_name: 'Arnav Atre', student_code: 'Z4T1K3Y6P9', parent_code: 'PA7A1Q5P9G3', section: 'A', photo_url: null },
      { id: 13, sno: 13, student_name: 'Anirudh Ashraf', student_code: 'X8D2N7M5B4', parent_code: 'PA1N7B5M3X9', section: 'A', photo_url: null },
      { id: 14, sno: 14, student_name: 'Akshay Advani', student_code: 'Q9V1A3T6Y8', parent_code: 'PA6Y9G3K7T1', section: 'A', photo_url: null },
      { id: 15, sno: 15, student_name: 'Amit Aulakh', student_code: 'P7B4L2Z1M6', parent_code: 'PA2P7A9X3M5', section: 'A', photo_url: null },
      { id: 16, sno: 16, student_name: 'Aryan Anwar', student_code: 'C5X9Q3D8N1', parent_code: 'PA9X5L7T3B1', section: 'A', photo_url: null },
      { id: 17, sno: 17, student_name: 'Anshul Aiyer', student_code: 'Y1M7T5A4V9', parent_code: 'PA3A9Q7P5G1', section: 'A', photo_url: null },
      { id: 18, sno: 18, student_name: 'Adarsh Adhikari', student_code: 'L9Z2B3X6D7', parent_code: 'PA5N1B3M7X9', section: 'A', photo_url: null },
      { id: 19, sno: 19, student_name: 'Abhishek Asthana', student_code: 'K4Q1Y5T8M9', parent_code: 'PA7Y3G9K1T5', section: 'A', photo_url: null },
      { id: 20, sno: 20, student_name: 'Ayaan Agarwal', student_code: 'N3P7V6X2B8', parent_code: 'PA9P3A7X1M5', section: 'A', photo_url: null },
      { id: 21, sno: 21, student_name: 'Akash Awasthi', student_code: 'M1D5A9L4T7', parent_code: 'PA1X3L9T7B5', section: 'A', photo_url: null },
      { id: 22, sno: 22, student_name: 'Abhinandan Ahlawat', student_code: 'X6Q8Z3Y9P2', parent_code: 'PA9A5Q7P3G1', section: 'A', photo_url: null },
      { id: 23, sno: 23, student_name: 'Anmol Athreya', student_code: 'T7B9N1M4V5', parent_code: 'PA5N7B1M9X3', section: 'A', photo_url: null },
      { id: 24, sno: 24, student_name: 'Anubhav Ashok', student_code: 'D2A5X8K3Q9', parent_code: 'PA7Y9G3K1T5', section: 'A', photo_url: null },
      { id: 25, sno: 25, student_name: 'Arjit Acharjee', student_code: 'Y4L1P7T6M9', parent_code: 'PA3P5A9X7B1', section: 'A', photo_url: null },
      { id: 26, sno: 26, student_name: 'Ayush Anand', student_code: 'V8Z3B2N5A1', parent_code: 'PA9X7L3T1M5', section: 'A', photo_url: null },
      { id: 27, sno: 27, student_name: 'Aman Anirudh', student_code: 'Q9X7T4K1Y6', parent_code: 'PA7A1Q9P3G5', section: 'A', photo_url: null },
      { id: 28, sno: 28, student_name: 'Ashutosh Anupam', student_code: 'M2P5D3V9L8', parent_code: 'PA3N5B1M9X7', section: 'A', photo_url: null },
      { id: 29, sno: 29, student_name: 'Atul Aaryan', student_code: 'B4N1Z7Q6X5', parent_code: 'PA1Y3G9K7T5', section: 'A', photo_url: null },
      { id: 30, sno: 30, student_name: 'Avik Adil', student_code: 'T9A3M8Y2D7', parent_code: 'PA5P9A7X1B3', section: 'A', photo_url: null },
      { id: 31, sno: 31, student_name: 'Aseem Akash', student_code: 'X1L5V4K9P3', parent_code: 'PA9X7L3T1M5', section: 'A', photo_url: null },
      { id: 32, sno: 32, student_name: 'Amandeep Arya', student_code: 'Q6T7Z2N8B9', parent_code: 'PA7A3Q5P9G1', section: 'A', photo_url: null },
      { id: 33, sno: 33, student_name: 'Ankur Ahlawat', student_code: 'D5M1Y3A9X4', parent_code: 'PA5N1B7M9X3', section: 'A', photo_url: null },
      { id: 34, sno: 34, student_name: 'Ansh Atri', student_code: 'L8V7Q2K9B5', parent_code: 'PA1Y5G3K9T7', section: 'A', photo_url: null },
      { id: 35, sno: 35, student_name: 'Arvind Apte', student_code: 'N4T9X1Z3A7', parent_code: 'PA3P1A9X7M5', section: 'A', photo_url: null },
      { id: 36, sno: 36, student_name: 'Arman Alag', student_code: 'P6Y5M8D2Q9', parent_code: 'PA1X9L5T3B7', section: 'A', photo_url: null },
      { id: 37, sno: 37, student_name: 'Abhay Adiga', student_code: 'X3L7B4N1Z9', parent_code: 'PA7A9Q3P5G1', section: 'A', photo_url: null },
      { id: 38, sno: 38, student_name: 'Ajay Azad', student_code: 'Q2T5A9M6Y8', parent_code: 'PA5N1B7M9X3', section: 'A', photo_url: null },
      { id: 39, sno: 39, student_name: 'Anup Ayodhya', student_code: 'D9V1X4L7K3', parent_code: 'PA9Y5G3K1T7', section: 'A', photo_url: null },
      { id: 40, sno: 40, student_name: 'Aniket Atwal', student_code: 'P8Z5B2T9N1', parent_code: 'PA3P1A9X7M5', section: 'A', photo_url: null },
      { id: 41, sno: 41, student_name: 'Akhilesh Amrit', student_code: 'Y6M7A3X9L2', parent_code: 'PA1X9L5T3B7', section: 'A', photo_url: null },
      { id: 42, sno: 42, student_name: 'Abhinav Aiyar', student_code: 'Q5T1Z4N8B7', parent_code: 'PA7A9Q3P5G1', section: 'A', photo_url: null },
      { id: 43, sno: 43, student_name: 'Armaan Agashe', student_code: 'X9L3V2K7D1', parent_code: 'PA5N1B7M9X3', section: 'A', photo_url: null },
      { id: 44, sno: 44, student_name: 'Amitava Achar', student_code: 'P4T8A5M9Y6', parent_code: 'PA9Y3G5K1T7', section: 'A', photo_url: null },
      { id: 45, sno: 45, student_name: 'Aniket Ashwin', student_code: 'B1Z7Q9N3X5', parent_code: 'PA3P1A9X7M5', section: 'A', photo_url: null },
      { id: 46, sno: 46, student_name: 'Arnav Atul', student_code: 'M2L9T4D8V7', parent_code: 'PA1X9L5T3B7', section: 'A', photo_url: null },
      { id: 47, sno: 47, student_name: 'Aakash Amar', student_code: 'Y3A7X5K1P9', parent_code: 'PA7A9Q3P5G1', section: 'A', photo_url: null },
      { id: 48, sno: 48, student_name: 'Anshuman Amlan', student_code: 'Q8T2Z9N4B7', parent_code: 'PA5N1B7M9X3', section: 'A', photo_url: null },
      { id: 49, sno: 49, student_name: 'Arya Aazad', student_code: 'L5M1D3V9A7', parent_code: 'PA9Y5G3K1T7', section: 'A', photo_url: null },
      { id: 50, sno: 50, student_name: 'Akash Anup', student_code: 'P9X4T6K2Y8', parent_code: 'PA3P1A9X7M5', section: 'A', photo_url: null },
      { id: 51, sno: 51, student_name: 'Ayaan Aryaman', student_code: 'B7N1Q5Z3T9', parent_code: 'PA1X9L5T3B7', section: 'A', photo_url: null },
      { id: 52, sno: 52, student_name: 'Ashwin Amarendra', student_code: 'M6L8A2X9V4', parent_code: 'PA7A9Q3P5G1', section: 'A', photo_url: null },
      { id: 53, sno: 53, student_name: 'Arvind Abhishek', student_code: 'Y1P7T5N3Q9', parent_code: 'PA5N1B7M9X3', section: 'A', photo_url: null },
      { id: 54, sno: 54, student_name: 'Anurag Atulya', student_code: 'D4X9L2B7M8', parent_code: 'PA9Y3G5K1T7', section: 'A', photo_url: null },
      { id: 55, sno: 55, student_name: 'Ayushmaan Agarkar', student_code: 'T5A9Q3N7X1', parent_code: 'PA3P1A9X7M5', section: 'A', photo_url: null },
      { id: 56, sno: 56, student_name: 'Aditiya Amol', student_code: 'L6P8Z4T9M2', parent_code: 'PA1X9L5T3B7', section: 'A', photo_url: null },
      { id: 57, sno: 57, student_name: 'Anupama Ankur', student_code: 'X3B1N5V7A9', parent_code: 'PA7A9Q3P5G1', section: 'A', photo_url: null },
      { id: 58, sno: 58, student_name: 'Aayush Aftab', student_code: 'Q2T9L4M8X7', parent_code: 'PA5N1B7M9X3', section: 'A', photo_url: null },
      { id: 59, sno: 59, student_name: 'Akhilesh Anmol', student_code: 'N7A3P5T9Y2', parent_code: 'PA9Y3G5K1T7', section: 'A', photo_url: null },
      { id: 60, sno: 60, student_name: 'Anant Amarjeet', student_code: 'B4L9X1M7Q8', parent_code: 'PA3P1A9X7M5', section: 'A', photo_url: null },
      { id: 61, sno: 61, student_name: 'Arjit Abhijeet', student_code: 'T8P6Z2N5A9', parent_code: 'PA1X9L5T3B7', section: 'A', photo_url: null },
      { id: 62, sno: 62, student_name: 'Amlan Akashdeep', student_code: 'X1Y4M9T7B3', parent_code: 'PA7A9Q3P5G1', section: 'A', photo_url: null },
      { id: 63, sno: 63, student_name: 'Anvay Ashwini', student_code: 'Q5N3L8A9X2', parent_code: 'PA5N1B7M9X3', section: 'A', photo_url: null },
      { id: 64, sno: 64, student_name: 'Atish Aniket', student_code: 'T9P7Z1B4M6', parent_code: 'PA9Y3G5K1T7', section: 'A', photo_url: null },
      { id: 65, sno: 65, student_name: 'Aadesh Akhil', student_code: 'M2X5Y8N3Q7', parent_code: 'PA3P1A9X7M5', section: 'A', photo_url: null },
      { id: 66, sno: 66, student_name: 'Anuj Arindam', student_code: 'A4T1P9L6X3', parent_code: 'PA1X9L5T3B7', section: 'A', photo_url: null },
      { id: 67, sno: 67, student_name: 'Aarush Anandhan', student_code: 'B7Z8Q5N9M2', parent_code: 'PA7A9Q3P5G1', section: 'A', photo_url: null },
      { id: 68, sno: 68, student_name: 'Ahaan Abhishek', student_code: 'L9T4X3P1A7', parent_code: 'PA5N1B7M9X3', section: 'A', photo_url: null },
      { id: 69, sno: 69, student_name: 'Abeer Abhay', student_code: 'N5M8Q7B4Z9', parent_code: 'PA9Y3G5K1T7', section: 'A', photo_url: null },
      { id: 70, sno: 70, student_name: 'Atharv Ajit', student_code: 'T1X2P9A5L7', parent_code: 'PA3P1A9X7M5', section: 'A', photo_url: null },
      { id: 71, sno: 71, student_name: 'Animesh Avyakt', student_code: 'Q8N4M6B9T3', parent_code: 'PA1X9L5T3B7', section: 'A', photo_url: null },
      { id: 72, sno: 72, student_name: 'Akshay Aviroop', student_code: 'X5L9T7A3P2', parent_code: 'PA7A9Q3P5G1', section: 'A', photo_url: null },
      { id: 73, sno: 73, student_name: 'Aniket Akashan', student_code: 'B7N1M8Q4Z9', parent_code: 'PA8X4L6T2M9', section: 'A', photo_url: null },
      { id: 74, sno: 74, student_name: 'Aryaman Abhiroop', student_code: 'X7Q9T5L2M8', parent_code: 'PA2A7Q5P8G3', section: 'A', photo_url: null },
      { id: 75, sno: 75, student_name: 'Aman Arjit', student_code: 'B4N3A1P6Z9', parent_code: 'PA6N9B3M1X7', section: 'A', photo_url: null },
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
    console.log(`Verifying teacher code: ${code} for section: ${section}`);
    
    // For demo purposes, accept aayush123 for any section
    if (code === "aayush123") {
      return { valid: true, subject: "History" };
    }
    
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('code', code)
      .eq('section', section);
    
    if (error) {
      console.error('Error verifying teacher code:', error);
      return { valid: false, error };
    }
    
    console.log("Teacher verification data:", data);
    
    return { valid: data && data.length > 0, subject: data && data.length > 0 ? data[0].subject_name : null };
  } catch (error) {
    console.error('Error in verifyTeacherCode:', error);
    return { valid: false, error };
  }
};

// Function to check if a student code is valid
export const verifyStudentCode = async (code: string) => {
  try {
    console.log(`Verifying student code: ${code}`);
    
    const { data, error } = await supabase
      .from('students_section_a')
      .select('*')
      .eq('student_code', code);
    
    if (error) {
      console.error('Error verifying student code:', error);
      return { valid: false, error };
    }
    
    console.log("Student verification data:", data);
    
    return { valid: data && data.length > 0, student: data && data.length > 0 ? data[0] : null };
  } catch (error) {
    console.error('Error in verifyStudentCode:', error);
    return { valid: false, error };
  }
};

// Function to check if a parent code is valid
export const verifyParentCode = async (code: string) => {
  try {
    console.log(`Verifying parent code: ${code}`);
    
    const { data, error } = await supabase
      .from('students_section_a')
      .select('*')
      .eq('parent_code', code);
    
    if (error) {
      console.error('Error verifying parent code:', error);
      return { valid: false, error };
    }
    
    console.log("Parent verification data:", data);
    
    return { valid: data && data.length > 0, student: data && data.length > 0 ? data[0] : null };
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
      .eq('code', code);
    
    if (error) {
      console.error('Error getting subject by code:', error);
      return { success: false, error };
    }
    
    return { success: true, data: data && data.length > 0 ? data[0] : null };
  } catch (error) {
    console.error('Error in getSubjectByCode:', error);
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
