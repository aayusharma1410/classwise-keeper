
import { supabase } from './supabase';
import { ClassCode, saveClassCodes } from './class-code-service';

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
export const uploadClassCodes = async (csvData: string) => {
  try {
    console.log('Parsing class code data...');
    const classCodes = parseClassCodeData(csvData);
    console.log('Parsed class codes:', classCodes);
    
    // Save the class codes to the database
    const result = await saveClassCodes(classCodes);
    
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
