
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

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
    subject: ""
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.uniqueCode) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await signIn(
        formData.email, 
        formData.uniqueCode, 
        role,
        role === "Teacher" ? formData.subject : undefined
      );
    } catch (error) {
      console.error("Login error:", error);
    }
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
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <Select onValueChange={(value) => handleChange("subject", value)} disabled={isLoading}>
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
