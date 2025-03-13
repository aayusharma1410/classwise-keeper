
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, uniqueCode: string, role: string, subject?: string, section?: string) => Promise<void>;
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

  const signIn = async (email: string, uniqueCode: string, role: string, subject?: string, section?: string) => {
    setIsLoading(true);
    
    try {
      // Special case for teacher with code aayush123
      if (role === "Teacher" && uniqueCode === "aayush123") {
        // Store mock data for demo purposes
        const teacherData = {
          name: "Aayush",
          email: email,
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

      // Regular login flow for other users
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: uniqueCode, // Using uniqueCode as password for simplicity
      });

      if (error) {
        toast.error("Login failed: " + error.message);
        return;
      }

      // Store user role and other details in session storage
      const userData = {
        role, 
        email,
        subject,
        section: section || "A"
      };
      
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
      
      toast.success(`Logged in successfully as ${role}`);
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
