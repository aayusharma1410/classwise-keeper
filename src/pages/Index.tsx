
import { Button } from "@/components/ui/button";
import ClassCard from "@/components/ClassCard";
import { PlusCircle } from "lucide-react";

const Index = () => {
  const classes = [
    {
      title: "Mathematics 101",
      time: "9:00 AM - 10:30 AM",
      students: 25,
      subject: "Mathematics",
    },
    {
      title: "Physics Advanced",
      time: "11:00 AM - 12:30 PM",
      students: 20,
      subject: "Physics",
    },
    {
      title: "Computer Science Basics",
      time: "2:00 PM - 3:30 PM",
      students: 30,
      subject: "Computer Science",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Your Classes
            </h1>
            <p className="text-gray-500">Manage and monitor your classes efficiently</p>
          </div>
          <Button className="inline-flex items-center space-x-2">
            <PlusCircle className="h-4 w-4" />
            <span>Add New Class</span>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((classItem, index) => (
            <ClassCard key={index} {...classItem} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
