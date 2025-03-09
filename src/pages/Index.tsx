
import { GraduationCap, Users, ShieldCheck, UserCog } from "lucide-react";
import LoginCard from "@/components/LoginCard";

const Index = () => {
  const userRoles = [
    {
      title: "Teacher",
      description: "Manage attendance and student marks",
      icon: GraduationCap,
      route: "/teacher-dashboard",
      color: "bg-blue-600"
    },
    {
      title: "Student",
      description: "View your attendance and marks",
      icon: Users,
      route: "/student-dashboard",
      color: "bg-green-600"
    },
    {
      title: "Admin",
      description: "System control and management",
      icon: UserCog,
      route: "/admin-dashboard",
      color: "bg-purple-600"
    },
    {
      title: "Parent/Mentor",
      description: "Track student progress",
      icon: ShieldCheck,
      route: "/mentor-dashboard",
      color: "bg-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            ClassKeeper Chronicle
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Comprehensive attendance and marks management system
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {userRoles.map((role, index) => (
            <LoginCard key={index} {...role} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
