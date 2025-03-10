
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Home, LogIn } from "lucide-react";

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

    // Accept all credentials with minimal validation
    let routePath = "";

    switch (role) {
      case "Teacher":
        routePath = "/teacher-dashboard";
        break;
      case "Student":
        routePath = "/student-dashboard";
        break;
      case "Admin":
        routePath = "/admin-dashboard";
        break;
      case "Parent/Mentor":
        routePath = "/mentor-dashboard";
        break;
    }

    // Store user data in sessionStorage for persistence
    sessionStorage.setItem("user", JSON.stringify({ role, ...formData }));
    navigate(routePath);
    toast.success(`Logged in successfully as ${role}`);
  };

  return (
    <Card className="animate-fade-up shadow-lg border-t-4" style={{ borderTopColor: color.replace("bg-", "") }}>
      <CardHeader className={`${color} rounded-t-lg text-white`}>
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-center text-2xl font-bold">Login as {role}</CardTitle>
          <div className="w-9"></div> {/* Spacer for alignment */}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {role === "Teacher" && (
            <>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Select onValueChange={(value) => handleChange("subject", value)}>
                  <SelectTrigger id="subject" className="w-full">
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
                  className="w-full"
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
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="rollNumber" className="text-sm font-medium">Roll Number</label>
                <Input 
                  id="rollNumber" 
                  placeholder="Enter your roll number" 
                  onChange={(e) => handleChange("rollNumber", e.target.value)} 
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="studentCode" className="text-sm font-medium">Student Code</label>
                <Input 
                  id="studentCode" 
                  placeholder="Enter your student code" 
                  onChange={(e) => handleChange("studentCode", e.target.value)} 
                  className="w-full"
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
                className="w-full"
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
                className="w-full"
              />
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between p-6 pt-0">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="w-full max-w-[200px] flex items-center gap-2" 
          style={{ backgroundColor: color.replace("bg-", "") }}
        >
          <LogIn className="h-4 w-4" />
          Login
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
