
import { supabase } from './supabase';

export interface ClassCode {
  id?: number;
  sno: number;
  year: number;
  section: string;
  code: string;
}

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
