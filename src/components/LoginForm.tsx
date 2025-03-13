
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface FormData {
  email: string;
  uniqueCode: string;
  role: string;
  section?: string;
  subject?: string;
}

interface LoginFormProps {
  role: string;
  onClose: () => void;
}

const sections = [
  { value: "A", label: "Section A" },
  { value: "B", label: "Section B" },
  { value: "C", label: "Section C" },
  { value: "D", label: "Section D" },
  { value: "E", label: "Section E" },
];

const LoginForm = ({ role, onClose }: LoginFormProps) => {
  const { signIn, isLoading } = useAuth();
  const [subjects, setSubjects] = useState<{id: number, subject_name: string, code: string, section: string}[]>([]);
  const [selectedSection, setSelectedSection] = useState("A");
  const [filteredSubjects, setFilteredSubjects] = useState<{id: number, subject_name: string, code: string, section: string}[]>([]);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    // Set role when component mounts
    setValue("role", role);
    
    // Fetch subjects from database
    const fetchSubjects = async () => {
      try {
        const { data, error } = await supabase
          .from('subjects')
          .select('*');
        
        if (error) throw error;
        if (data) {
          setSubjects(data);
          const filtered = data.filter(subject => subject.section === selectedSection);
          setFilteredSubjects(filtered);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };
    
    fetchSubjects();
  }, [role, setValue]);

  useEffect(() => {
    // Filter subjects when section changes
    const filtered = subjects.filter(subject => subject.section === selectedSection);
    setFilteredSubjects(filtered);
  }, [selectedSection, subjects]);

  const onSubmit = async (data: FormData) => {
    if (!data.email || !data.uniqueCode) {
      toast.error("Email and unique code are required");
      return;
    }

    if (role === "Teacher" && !data.section) {
      toast.error("Please select a section");
      return;
    }

    try {
      await signIn(data.email, data.uniqueCode, role, data.section, data.subject);
      onClose();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case "Teacher":
        return "Teacher";
      case "Student":
        return "Student";
      case "Admin":
        return "Admin";
      case "Parent/Mentor":
        return "Parent/Mentor";
      default:
        return "User";
    }
  };

  const getCodePlaceholder = () => {
    switch (role) {
      case "Teacher":
        return "Enter subject code (e.g., 8253A-67K)";
      case "Student":
        return "Enter student code (e.g., X7A2P9Q5L8)";
      case "Admin":
        return "Enter admin code";
      case "Parent/Mentor":
        return "Enter parent code (e.g., PA9X5L7T3M1)";
      default:
        return "Enter unique code";
    }
  };

  const handleSectionChange = (value: string) => {
    setSelectedSection(value);
    setValue("section", value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>{getRoleLabel()} Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the {role.toLowerCase()} dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: true })}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-xs text-red-500">Email is required</p>
              )}
            </div>

            {role === "Teacher" && (
              <div className="space-y-2">
                <label htmlFor="section" className="text-sm font-medium">
                  Section
                </label>
                <Select 
                  defaultValue={selectedSection} 
                  onValueChange={handleSectionChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.value} value={section.value}>
                        {section.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="uniqueCode" className="text-sm font-medium">
                Unique Code
              </label>
              <Input
                id="uniqueCode"
                type="text"
                placeholder={getCodePlaceholder()}
                {...register("uniqueCode", { required: true })}
                className={errors.uniqueCode ? "border-red-500" : ""}
              />
              {errors.uniqueCode && (
                <p className="text-xs text-red-500">Unique code is required</p>
              )}
            </div>

            {role === "Teacher" && filteredSubjects.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <h3 className="text-sm font-medium mb-2">Available Subject Codes for {selectedSection === "E" ? "All Sections" : `Section ${selectedSection}`}:</h3>
                <div className="grid grid-cols-1 gap-2">
                  {filteredSubjects.map((subject) => (
                    <div key={subject.id} className="text-xs">
                      <span className="font-medium">{subject.subject_name}:</span>{" "}
                      <code className="bg-blue-100 px-1 py-0.5 rounded">{subject.code}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
