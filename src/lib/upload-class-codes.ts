
import { supabase } from './supabase';
import { ClassCode, saveClassCodes, replaceAllClassCodes } from './class-code-service';

// Define types for our data structures
interface Subject {
  subject: string;
  code: string;
}

interface Student {
  name: string;
  student_code: string;
  parent_code: string;
  section: string;
  subjects: Subject[];
}

interface StudentData {
  subjects: Subject[];
  students: Student[];
}

// Parse the student data CSV into structured objects
export const parseStudentData = (csvData: string): StudentData => {
  const lines = csvData.trim().split('\n');
  
  // Find where the actual data starts (after headers)
  const dataStartIndex = lines.findIndex(line => line.startsWith('1,'));
  
  if (dataStartIndex === -1) return { subjects: [], students: [] };
  
  // Get subject mappings from the first few rows
  const subjects: Subject[] = [];
  for (let i = dataStartIndex; i < dataStartIndex + 6; i++) {
    if (i < lines.length) {
      const [, subject, code] = lines[i].split(',').map(item => item?.trim()).filter(Boolean);
      if (subject && code) {
        subjects.push({ subject, code });
      }
    }
  }
  
  // Parse student records
  const students: Student[] = [];
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
    try {
      const { error: tableError } = await supabase.from('students_section_a').select().limit(1);
      
      if (tableError) {
        // Create the table if it doesn't exist
        await supabase.rpc('create_students_table');
      }
    } catch (error) {
      // If the table doesn't exist, create it
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

// Upload function for the class codes data provided by the user
export const uploadUserClassCodes = async (replace: boolean = true) => {
  const userData = `S.NO,YEAR,SECTION ,CODE
1,2,A,2025A-45S
2,2,B,5946B-84G
3,2,C,7944C-98R
4,2,D,3596D-74W
5,2,E,1464E-78Q`;

  return await uploadClassCodes(userData, replace);
};

// Upload function for the Section A student data provided by the user
export const uploadSectionAData = async () => {
  const sectionAData = `Unnamed: 0,Unnamed: 1,Unnamed: 2,Unnamed: 3,Unnamed: 4,Unnamed: 5,Unnamed: 6,Unnamed: 7,Unnamed: 8,Unnamed: 9,SECTION A
,,,,,,,,,,
,,,,,,,,,,
S.NO,SUBJECT,CODE,STUDENT NAME,CODE,PARENT CODE,,,,,
1,DMS,8253A-67K,Aarav Agarwal,X7A2P9Q5L8,PA9X5L7T3M1,,,,,
2,TOC,3135B-23X,Aakash Anand,M3T8Z1Y4W6,PA7A3Q9P5G1,,,,,
3,DCCN,9402C-11M,Aaryan Ahuja,K9V4B7X2C1,PA5N1B7M9X3,,,,,
4,DBMS,2856D-96T,Aniket Arya,D6Q1N8J5T3,PA1Y3G9K7T5,,,,,
5,JAVA,7361E-39J,Arjun Acharya,P5A9Y2L7Z8,PA3P9A7X1B5,,,,,
6,MPI,5247F-72L,Aditya Ajmera,C1M6X4T3V9,PA5X7L3T9M1,,,,,
7,,,Abhinav Arora,W8K7Q2N5B1,PA1A9Q7P3G6,,,,,
8,,,Aman Awasthi,Y4D3P9L8M2,PA7N5B9M1X3,,,,,
9,,,Ashish Ameta,A9T5X1Z7Q6,PA3Y1G7K9T5,,,,,
10,,,Anshul Akhtar,N2V8B4Y3D1,PA9P1A3X7M6,,,,,
11,,,Avinash Alok,L7M5X9C2Q8,PA2X9L7T5B3,,,,,
12,,,Arnav Atre,Z4T1K3Y6P9,PA7A1Q5P9G3,,,,,
13,,,Anirudh Ashraf,X8D2N7M5B4,PA1N7B5M3X9,,,,,
14,,,Akshay Advani,Q9V1A3T6Y8,PA6Y9G3K7T1,,,,,
15,,,Amit Aulakh,P7B4L2Z1M6,PA2P7A9X3M5,,,,,
16,,,Aryan Anwar,C5X9Q3D8N1,PA9X5L7T3B1,,,,,
17,,,Anshul Aiyer,Y1M7T5A4V9,PA3A9Q7P5G1,,,,,
18,,,Adarsh Adhikari,L9Z2B3X6D7,PA5N1B3M7X9,,,,,
19,,,Abhishek Asthana,K4Q1Y5T8M9,PA7Y3G9K1T5,,,,,
20,,,Ayaan Agarwal,N3P7V6X2B8,PA9P3A7X1M5,,,,,
21,,,Akash Awasthi,M1D5A9L4T7,PA1X3L9T7B5,,,,,
22,,,Abhinandan Ahlawat,X6Q8Z3Y9P2,PA9A5Q7P3G1,,,,,
23,,,Anmol Athreya,T7B9N1M4V5,PA5N7B1M9X3,,,,,
24,,,Anubhav Ashok,D2A5X8K3Q9,PA7Y9G3K1T5,,,,,
25,,,Arjit Acharjee,Y4L1P7T6M9,PA3P5A9X7B1,,,,,
26,,,Ayush Anand,V8Z3B2N5A1,PA9X7L3T1M5,,,,,
27,,,Aman Anirudh,Q9X7T4K1Y6,PA7A1Q9P3G5,,,,,
28,,,Ashutosh Anupam,M2P5D3V9L8,PA3N5B1M9X7,,,,,
29,,,Atul Aaryan,B4N1Z7Q6X5,PA1Y3G9K7T5,,,,,
30,,,Avik Adil,T9A3M8Y2D7,PA5P9A7X1B3,,,,,
31,,,Aseem Akash,X1L5V4K9P3,PA9X7L3T1M5,,,,,
32,,,Amandeep Arya,Q6T7Z2N8B9,PA7A3Q5P9G1,,,,,
33,,,Ankur Ahlawat,D5M1Y3A9X4,PA5N1B7M9X3,,,,,
34,,,Ansh Atri,L8V7Q2K9B5,PA1Y5G3K9T7,,,,,
35,,,Arvind Apte,N4T9X1Z3A7,PA3P1A9X7M5,,,,,
36,,,Arman Alag,P6Y5M8D2Q9,PA1X9L5T3B7,,,,,
37,,,Abhay Adiga,X3L7B4N1Z9,PA7A9Q3P5G1,,,,,
38,,,Ajay Azad,Q2T5A9M6Y8,PA5N1B7M9X3,,,,,
39,,,Anup Ayodhya,D9V1X4L7K3,PA9Y5G3K1T7,,,,,
40,,,Aniket Atwal,P8Z5B2T9N1,PA3P1A9X7M5,,,,,
41,,,Akhilesh Amrit,Y6M7A3X9L2,PA1X9L5T3B7,,,,,
42,,,Abhinav Aiyar,Q5T1Z4N8B7,PA7A9Q3P5G1,,,,,
43,,,Armaan Agashe,X9L3V2K7D1,PA5N1B7M9X3,,,,,
44,,,Amitava Achar,P4T8A5M9Y6,PA9Y3G5K1T7,,,,,
45,,,Aniket Ashwin,B1Z7Q9N3X5,PA3P1A9X7M5,,,,,
46,,,Arnav Atul,M2L9T4D8V7,PA1X9L5T3B7,,,,,
47,,,Aakash Amar,Y3A7X5K1P9,PA7A9Q3P5G1,,,,,
48,,,Anshuman Amlan,Q8T2Z9N4B7,PA5N1B7M9X3,,,,,
49,,,Arya Aazad,L5M1D3V9A7,PA9Y5G3K1T7,,,,,
50,,,Akash Anup,P9X4T6K2Y8,PA3P1A9X7M5,,,,,
51,,,Ayaan Aryaman,B7N1Q5Z3T9,PA1X9L5T3B7,,,,,
52,,,Ashwin Amarendra,M6L8A2X9V4,PA7A9Q3P5G1,,,,,
53,,,Arvind Abhishek,Y1P7T5N3Q9,PA5N1B7M9X3,,,,,
54,,,Anurag Atulya,D4X9L2B7M8,PA9Y3G5K1T7,,,,,
55,,,Ayushmaan Agarkar,T5A9Q3N7X1,PA3P1A9X7M5,,,,,
56,,,Aditiya Amol,L6P8Z4T9M2,PA1X9L5T3B7,,,,,
57,,,Anupama Ankur,X3B1N5V7A9,PA7A9Q3P5G1,,,,,
58,,,Aayush Aftab,Q2T9L4M8X7,PA5N1B7M9X3,,,,,
59,,,Akhilesh Anmol,N7A3P5T9Y2,PA9Y3G5K1T7,,,,,
60,,,Anant Amarjeet,B4L9X1M7Q8,PA3P1A9X7M5,,,,,
61,,,Arjit Abhijeet,T8P6Z2N5A9,PA1X9L5T3B7,,,,,
62,,,Amlan Akashdeep,X1Y4M9T7B3,PA7A9Q3P5G1,,,,,
63,,,Anvay Ashwini,Q5N3L8A9X2,PA5N1B7M9X3,,,,,
64,,,Atish Aniket,T9P7Z1B4M6,PA9Y3G5K1T7,,,,,
65,,,Aadesh Akhil,M2X5Y8N3Q7,PA3P1A9X7M5,,,,,
66,,,Anuj Arindam,A4T1P9L6X3,PA1X9L5T3B7,,,,,
67,,,Aarush Anandhan,B7Z8Q5N9M2,PA7A9Q3P5G1,,,,,
68,,,Ahaan Abhishek,L9T4X3P1A7,PA5N1B7M9X3,,,,,
69,,,Abeer Abhay,N5M8Q7B4Z9,PA9Y3G5K1T7,,,,,
70,,,Atharv Ajit,T1X2P9A5L7,PA3P1A9X7M5,,,,,
71,,,Animesh Avyakt,Q8N4M6B9T3,PA1X9L5T3B7,,,,,
72,,,Akshay Aviroop,X5L9T7A3P2,PA7A9Q3P5G1,,,,,
73,,,Aniket Akashan,B7N1M8Q4Z9,PA8X4L6T2M9,,,,,
74,,,Aryaman Abhiroop,X7Q9T5L2M8,PA2A7Q5P8G3,,,,,
75,,,Aman Arjit,B4N3A1P6Z9,PA6N9B3M1X7,,,,,`;

  return await uploadStudentData(sectionAData);
};

// Direct upload function for both datasets
export const uploadAllData = async () => {
  console.log('Starting data upload process...');
  
  // First upload class codes
  const classCodesResult = await uploadUserClassCodes();
  console.log('Class codes upload result:', classCodesResult);
  
  // Then upload section A student data
  const sectionAResult = await uploadSectionAData();
  console.log('Section A data upload result:', sectionAResult);
  
  return {
    classCodesSuccess: classCodesResult.success,
    sectionASuccess: sectionAResult.success,
    message: `Class codes: ${classCodesResult.message}. Section A: ${sectionAResult.message}`
  };
};

// Upload sample class codes (legacy function, kept for backward compatibility)
export const uploadSampleClassCodes = async () => {
  const sampleData = `S.NO,YEAR,SECTION ,CODE
1,2,A,2025A-45S
2,2,B,5946B-84G
3,2,C,7944C-98R
4,2,D,3596D-74W
5,2,E,1464E-78Q`;

  return await uploadClassCodes(sampleData);
};
