
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import LoginForm from "./LoginForm";

interface LoginCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
  color: string;
}

const LoginCard = ({ title, description, icon: Icon, route, color }: LoginCardProps) => {
  const [showForm, setShowForm] = useState(false);
  
  const handleShowForm = () => {
    setShowForm(true);
  };
  
  const handleBack = () => {
    setShowForm(false);
  };

  if (showForm) {
    return (
      <LoginForm 
        role={title as "Teacher" | "Student" | "Admin" | "Parent/Mentor"} 
        onClose={handleBack} 
        color={color} 
      />
    );
  }

  return (
    <Card className="flex flex-col justify-between transition-all duration-300 hover:shadow-lg animate-fade-up">
      <CardHeader className={`${color} rounded-t-lg text-white`}>
        <div className="flex items-center justify-center py-4">
          <Icon size={48} className="mb-2" />
        </div>
        <CardTitle className="text-center text-2xl">{title}</CardTitle>
        <CardDescription className="text-center text-gray-100">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <p className="text-gray-600">
          Access the {title.toLowerCase()} dashboard to manage attendance, marks, and view reports.
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button 
          onClick={handleShowForm} 
          className="w-full" 
          style={{ backgroundColor: color.replace("bg-", "") }}
        >
          Login as {title}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
