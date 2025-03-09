
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface LoginFormProps {
  role: "Teacher" | "Student" | "Admin" | "Parent/Mentor";
  onBack: () => void;
  color: string;
}

const LoginForm = ({ role, onBack, color }: LoginFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate based on role
    let isValid = false;
    let routePath = "";

    switch (role) {
      case "Teacher":
        isValid = !!formData.subject && !!formData.code;
        routePath = "/teacher-dashboard";
        break;
      case "Student":
        isValid = !!formData.name && !!formData.rollNumber && !!formData.studentCode;
        routePath = "/student-dashboard";
        break;
      case "Admin":
        isValid = formData.adminCode === "aayush123";
        routePath = "/admin-dashboard";
        break;
      case "Parent/Mentor":
        isValid = !!formData.mentorCode;
        routePath = "/mentor-dashboard";
        break;
    }

    if (isValid) {
      // Store user data in sessionStorage for persistence
      sessionStorage.setItem("user", JSON.stringify({ role, ...formData }));
      navigate(routePath);
    } else {
      toast.error("Invalid login credentials. Please try again.");
    }
  };

  return (
    <Card className="animate-fade-up">
      <CardHeader className={`${color} rounded-t-lg text-white`}>
        <CardTitle className="text-center text-2xl">Login as {role}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {role === "Teacher" && (
            <>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Select onValueChange={(value) => handleChange("subject", value)}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="geography">Geography</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">Class Code</label>
                <Input 
                  id="code" 
                  placeholder="Enter class code" 
                  onChange={(e) => handleChange("code", e.target.value)} 
                />
              </div>
            </>
          )}

          {role === "Student" && (
            <>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input 
                  id="name" 
                  placeholder="Enter your name" 
                  onChange={(e) => handleChange("name", e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="rollNumber" className="text-sm font-medium">Roll Number</label>
                <Input 
                  id="rollNumber" 
                  placeholder="Enter your roll number" 
                  onChange={(e) => handleChange("rollNumber", e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="studentCode" className="text-sm font-medium">Student Code</label>
                <Input 
                  id="studentCode" 
                  placeholder="Enter your student code" 
                  onChange={(e) => handleChange("studentCode", e.target.value)} 
                />
              </div>
            </>
          )}

          {role === "Admin" && (
            <div className="space-y-2">
              <label htmlFor="adminCode" className="text-sm font-medium">Admin Code</label>
              <Input 
                id="adminCode" 
                type="password" 
                placeholder="Enter admin code" 
                onChange={(e) => handleChange("adminCode", e.target.value)} 
              />
            </div>
          )}

          {role === "Parent/Mentor" && (
            <div className="space-y-2">
              <label htmlFor="mentorCode" className="text-sm font-medium">Mentor Code</label>
              <Input 
                id="mentorCode" 
                placeholder="Enter mentor code" 
                onChange={(e) => handleChange("mentorCode", e.target.value)} 
              />
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between p-6 pt-0">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit} className="w-full" style={{ backgroundColor: color.replace("bg-", "") }}>
          Login
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
