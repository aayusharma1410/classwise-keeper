
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { uploadAllData } from "@/lib/upload-class-codes";

interface LoginFormProps {
  role: "Teacher" | "Student" | "Admin" | "Parent/Mentor";
  onBack: () => void;
  color: string;
}

const LoginForm = ({ role, onBack, color }: LoginFormProps) => {
  const { signIn, isLoading } = useAuth();
  const [formData, setFormData] = useState<Record<string, string>>({
    email: "",
    uniqueCode: "",
    subject: "",
    section: ""
  });
  const [subjects, setSubjects] = useState<{subject: string, code: string}[]>([]);
  const [sections, setSection] = useState<{id: string, name: string}[]>([
    { id: "A", name: "Section A" },
    { id: "B", name: "Section B" },
    { id: "C", name: "Section C" },
    { id: "D", name: "Section D" },
    { id: "E", name: "Section E" },
  ]);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Ensure tables and data exist
        await uploadAllData();
        
        // If teacher role, fetch subjects
        if (role === "Teacher") {
          await fetchSubjects();
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeData();
  }, [role]);

  const fetchSubjects = async () => {
    try {
      // Fetch subjects from the database
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('subject', { ascending: true });
      
      if (error) {
        console.error("Error fetching subjects:", error);
        return;
      }
      
      if (data && data.length > 0) {
        const formattedSubjects = data.map(subj => ({
          subject: subj.subject,
          code: subj.code
        }));
        setSubjects(formattedSubjects);
      } else {
        // If no data, set default subjects
        setSubjects([
          { subject: "DMS", code: "8253A-67K" },
          { subject: "TOC", code: "3135B-23X" },
          { subject: "DCCN", code: "9402C-11M" },
          { subject: "DBMS", code: "2856D-96T" },
          { subject: "JAVA", code: "7361E-39J" },
          { subject: "MPI", code: "5247F-72L" }
        ]);
      }
    } catch (error) {
      console.error("Error in fetchSubjects:", error);
    }
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const verifyTeacherCode = async (subject: string, code: string, section: string) => {
    try {
      // First, check if the tables exist
      const { count, error: countError } = await supabase
        .from('subjects')
        .select('*', { count: 'exact', head: true });
      
      if (countError || count === 0) {
        // Tables might not exist, create them
        await uploadAllData();
      }
      
      // Check if the subject and code match from the subjects table
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('subject', subject)
        .eq('code', code)
        .eq('section', section || 'A');
      
      if (error) {
        console.error("Error verifying teacher code:", error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (error) {
      console.error("Error in teacher code verification:", error);
      return false;
    }
  };

  const verifyStudentCode = async (studentCode: string) => {
    try {
      // First, check if the tables exist
      const { count, error: countError } = await supabase
        .from('students_section_a')
        .select('*', { count: 'exact', head: true });
      
      if (countError || count === 0) {
        // Tables might not exist, create them
        await uploadAllData();
      }
      
      // Check if the student code exists in the students_section_a table
      const { data, error } = await supabase
        .from('students_section_a')
        .select('*')
        .eq('student_code', studentCode);
      
      if (error) {
        console.error("Error verifying student code:", error);
        return { verified: false, studentData: null };
      }
      
      return { verified: data && data.length > 0, studentData: data && data.length > 0 ? data[0] : null };
    } catch (error) {
      console.error("Error in student code verification:", error);
      return { verified: false, studentData: null };
    }
  };

  const verifyParentCode = async (parentCode: string) => {
    try {
      // First, check if the tables exist
      const { count, error: countError } = await supabase
        .from('students_section_a')
        .select('*', { count: 'exact', head: true });
      
      if (countError || count === 0) {
        // Tables might not exist, create them
        await uploadAllData();
      }
      
      // Check if the parent code exists in the students_section_a table
      const { data, error } = await supabase
        .from('students_section_a')
        .select('*')
        .eq('parent_code', parentCode);
      
      if (error) {
        console.error("Error verifying parent code:", error);
        return { verified: false, parentData: null };
      }
      
      return { verified: data && data.length > 0, parentData: data && data.length > 0 ? data[0] : null };
    } catch (error) {
      console.error("Error in parent code verification:", error);
      return { verified: false, parentData: null };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.uniqueCode) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (role === "Teacher") {
        if (!formData.subject || !formData.section) {
          toast.error("Please select both subject and section");
          return;
        }

        // For the special demo teacher
        if (formData.uniqueCode === "aayush123") {
          await signIn(
            formData.email, 
            formData.uniqueCode, 
            role,
            formData.subject,
            formData.section
          );
          return;
        }

        // For other teachers, verify the code against the subject
        const isVerified = await verifyTeacherCode(formData.subject, formData.uniqueCode, formData.section);
        if (!isVerified) {
          toast.error("Invalid teacher code for the selected subject and section");
          return;
        }
      } else if (role === "Student") {
        // Verify student code
        const { verified, studentData } = await verifyStudentCode(formData.uniqueCode);
        if (!verified) {
          toast.error("Invalid student code");
          return;
        }
        
        // Set the student's section
        if (studentData) {
          formData.section = studentData.section || "A";
          formData.name = studentData.name || "";
        }
      } else if (role === "Parent/Mentor") {
        // Verify parent/mentor code
        const { verified, parentData } = await verifyParentCode(formData.uniqueCode);
        if (!verified) {
          toast.error("Invalid mentor code");
          return;
        }
        
        // Set the section associated with the parent/mentor's child
        if (parentData) {
          formData.section = parentData.section || "A";
          formData.studentName = parentData.name || "";
        }
      }

      // If we've reached here, all verifications passed
      await signIn(
        formData.email, 
        formData.uniqueCode, 
        role,
        role === "Teacher" ? formData.subject : undefined,
        formData.section
      );
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred during login");
    }
  };

  if (isInitializing) {
    return (
      <Card className="animate-fade-up shadow-lg border-t-4" style={{ borderTopColor: color.replace("bg-", "") }}>
        <CardHeader className={`${color} rounded-t-lg text-white`}>
          <CardTitle className="text-center text-2xl font-bold">Loading...</CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-up shadow-lg border-t-4" style={{ borderTopColor: color.replace("bg-", "") }}>
      <CardHeader className={`${color} rounded-t-lg text-white`}>
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="text-white hover:bg-white/20"
            disabled={isLoading}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-center text-2xl font-bold">Login as {role}</CardTitle>
          <div className="w-9"></div> {/* Spacer for alignment */}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input 
              id="email" 
              type="email"
              placeholder="Enter your email" 
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full"
              disabled={isLoading}
              required
            />
          </div>

          {role === "Teacher" && (
            <>
              <div className="space-y-2">
                <label htmlFor="uniqueCode" className="text-sm font-medium">Teacher Code</label>
                <Input 
                  id="uniqueCode" 
                  placeholder="Enter your teacher code" 
                  onChange={(e) => handleChange("uniqueCode", e.target.value)} 
                  className="w-full"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="section" className="text-sm font-medium">Section</label>
                <Select onValueChange={(value) => handleChange("section", value)} disabled={isLoading}>
                  <SelectTrigger id="section" className="w-full">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Select onValueChange={(value) => handleChange("subject", value)} disabled={isLoading}>
                  <SelectTrigger id="subject" className="w-full">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.subject} value={subject.subject}>
                        {subject.subject} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {role === "Student" && (
            <>
              <div className="space-y-2">
                <label htmlFor="uniqueCode" className="text-sm font-medium">Student Code</label>
                <Input 
                  id="uniqueCode" 
                  placeholder="Enter your student code" 
                  onChange={(e) => handleChange("uniqueCode", e.target.value)} 
                  className="w-full"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input 
                  id="name" 
                  placeholder="Enter your name" 
                  onChange={(e) => handleChange("name", e.target.value)} 
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="rollNumber" className="text-sm font-medium">Roll Number</label>
                <Input 
                  id="rollNumber" 
                  placeholder="Enter your roll number" 
                  onChange={(e) => handleChange("rollNumber", e.target.value)} 
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          {role === "Admin" && (
            <div className="space-y-2">
              <label htmlFor="uniqueCode" className="text-sm font-medium">Admin Code</label>
              <Input 
                id="uniqueCode" 
                type="password" 
                placeholder="Enter admin code" 
                onChange={(e) => handleChange("uniqueCode", e.target.value)} 
                className="w-full"
                disabled={isLoading}
                required
              />
            </div>
          )}

          {role === "Parent/Mentor" && (
            <div className="space-y-2">
              <label htmlFor="uniqueCode" className="text-sm font-medium">Mentor Code</label>
              <Input 
                id="uniqueCode" 
                placeholder="Enter mentor code" 
                onChange={(e) => handleChange("uniqueCode", e.target.value)} 
                className="w-full"
                disabled={isLoading}
                required
              />
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between p-6 pt-0">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="w-full max-w-[200px] flex items-center gap-2" 
          style={{ backgroundColor: color.replace("bg-", "") }}
          disabled={isLoading}
        >
          <LogIn className="h-4 w-4" />
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
