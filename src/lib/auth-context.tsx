
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createDatabaseTables } from './upload-class-codes';
import { verifyTeacherCode, verifyStudentCode, verifyParentCode, getSubjectByCode } from './upload-class-codes';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, uniqueCode: string, role: string, section?: string, subject?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const setupSession = async () => {
      // Ensure database tables exist
      await createDatabaseTables();
      
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    };

    setupSession();
  }, []);

  const signIn = async (email: string, uniqueCode: string, role: string, section?: string, subject?: string) => {
    setIsLoading(true);
    console.log(`Attempting login with: role=${role}, code=${uniqueCode}, section=${section}`);
    
    try {
      // Special case for teacher with code aayush123
      if (role === "Teacher" && uniqueCode === "aayush123") {
        // Store mock data for demo purposes
        const teacherData = {
          name: "Aayush",
          role: role,
          subject: subject || "History",
          section: section || "E",
          class: section ? `12 ${section}` : "12 E",
          uniqueCode: uniqueCode,
        };
        
        // Store in session storage
        sessionStorage.setItem("user", JSON.stringify(teacherData));
        
        // Navigate to teacher dashboard
        navigate("/teacher-dashboard");
        toast.success(`Logged in successfully as ${teacherData.name}`);
        setIsLoading(false);
        return;
      }

      // Verify codes based on role
      let isValid = false;
      let userData: any = { role };

      switch (role) {
        case "Teacher":
          if (!section) {
            toast.error("Section is required for teacher login");
            setIsLoading(false);
            return;
          }
          
          console.log("Verifying teacher code:", uniqueCode, "for section:", section);
          const teacherVerification = await verifyTeacherCode(uniqueCode, section);
          console.log("Teacher verification result:", teacherVerification);
          isValid = teacherVerification.valid;
          
          if (isValid) {
            const subjectInfo = await getSubjectByCode(uniqueCode);
            let subjectName = teacherVerification.subject || subject;
            
            // Directly fetch the subject name from the subjects table
            const { data: subjectData, error: subjectError } = await supabase
              .from('subjects')
              .select('subject_name')
              .eq('code', uniqueCode)
              .single();
              
            if (!subjectError && subjectData) {
              subjectName = subjectData.subject_name;
            }
            
            userData = {
              ...userData,
              name: uniqueCode.substring(0, 4) + "-Teacher",
              subject: subjectName,
              section: section,
              class: `12 ${section}`,
              uniqueCode,
            };
          } else {
            toast.error(`Invalid teacher code for section ${section}`);
            setIsLoading(false);
            return;
          }
          break;
          
        case "Student":
          console.log("Verifying student code:", uniqueCode);
          const studentVerification = await verifyStudentCode(uniqueCode);
          console.log("Student verification result:", studentVerification);
          isValid = studentVerification.valid;
          
          if (isValid && studentVerification.student) {
            userData = {
              ...userData,
              name: studentVerification.student.student_name,
              section: studentVerification.student.section || "A",
              studentCode: uniqueCode,
              rollNumber: studentVerification.student.sno,
              id: studentVerification.student.id,
              photo_url: studentVerification.student.photo_url,
            };
          } else {
            toast.error("Invalid student code");
            setIsLoading(false);
            return;
          }
          break;
          
        case "Parent/Mentor":
          const parentVerification = await verifyParentCode(uniqueCode);
          isValid = parentVerification.valid;
          
          if (isValid && parentVerification.student) {
            userData = {
              ...userData,
              name: "Parent of " + parentVerification.student.student_name,
              student: parentVerification.student.student_name,
              section: parentVerification.student.section || "A",
              parentCode: uniqueCode,
            };
          } else {
            toast.error("Invalid parent code");
            setIsLoading(false);
            return;
          }
          break;
          
        case "Admin":
          // For demo, accept any admin code
          isValid = true;
          userData = {
            ...userData,
            name: "Admin",
          };
          break;
      }

      if (!isValid) {
        toast.error(`Invalid ${role.toLowerCase()} code provided`);
        setIsLoading(false);
        return;
      }

      // Store user data in session storage
      sessionStorage.setItem("user", JSON.stringify(userData));
      
      // Navigate to the correct dashboard
      switch (role) {
        case "Teacher":
          navigate("/teacher-dashboard");
          break;
        case "Student":
          navigate("/student-dashboard");
          break;
        case "Admin":
          navigate("/admin-dashboard");
          break;
        case "Parent/Mentor":
          navigate("/mentor-dashboard");
          break;
      }
      
      toast.success(`Logged in successfully as ${userData.name}`);
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("An unexpected error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      sessionStorage.removeItem("user");
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("An error occurred during logout");
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
