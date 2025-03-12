import { supabase } from './supabase';

export interface ClassCode {
  id?: number;
  sno: number;
  year: number;
  section: string;
  code: string;
}

// Function to ensure the class_codes table exists
export const ensureClassCodesTableExists = async () => {
  try {
    // Check if table exists by querying for its schema
    const { data, error } = await supabase
      .from('class_codes')
      .select('id')
      .limit(1);
    
    // If there's an error that indicates the table doesn't exist, we'll handle it
    if (error && error.code === '42P01') { // PostgreSQL error code for undefined_table
      console.error('Table does not exist:', error);
      return { success: false, error, tableExists: false };
    } else if (error) {
      // Other errors
      console.error('Error checking table:', error);
      return { success: false, error };
    }
    
    // Table exists
    return { success: true, tableExists: true };
  } catch (error) {
    console.error('Error ensuring table exists:', error);
    return { success: false, error };
  }
};

export const getClassCodes = async () => {
  try {
    const { data, error } = await supabase
      .from('class_codes')
      .select('*')
      .order('sno', { ascending: true });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching class codes:', error);
    return { success: false, error };
  }
};

export const saveClassCode = async (classCode: Omit<ClassCode, 'id'>) => {
  try {
    const { data, error } = await supabase
      .from('class_codes')
      .insert(classCode);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving class code:', error);
    return { success: false, error };
  }
};

export const saveClassCodes = async (classCodes: Omit<ClassCode, 'id'>[]) => {
  try {
    // First, ensure table exists
    const tableCheck = await ensureClassCodesTableExists();
    
    if (!tableCheck.success) {
      console.error('Table check failed:', tableCheck.error);
      return { success: false, error: tableCheck.error };
    }
    
    // If table exists, insert the data
    const { data, error } = await supabase
      .from('class_codes')
      .insert(classCodes);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving class codes:', error);
    return { success: false, error };
  }
};

export const deleteClassCode = async (id: number) => {
  try {
    const { error } = await supabase
      .from('class_codes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting class code:', error);
    return { success: false, error };
  }
};

// Clear all existing class codes and add new ones
export const replaceAllClassCodes = async (classCodes: Omit<ClassCode, 'id'>[]) => {
  try {
    // First, delete all existing records
    const { error: deleteError } = await supabase
      .from('class_codes')
      .delete()
      .neq('id', 0); // This will delete all records
    
    if (deleteError) throw deleteError;
    
    // Then insert the new data
    const { data, error: insertError } = await supabase
      .from('class_codes')
      .insert(classCodes);
    
    if (insertError) throw insertError;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error replacing class codes:', error);
    return { success: false, error };
  }
};
