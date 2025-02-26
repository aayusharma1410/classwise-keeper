
import { Button } from "@/components/ui/button";
import ClassCard from "@/components/ClassCard";
import { PlusCircle } from "lucide-react";

const Index = () => {
  const classes = [
    {
      title: "Introduction to Python",
      time: "9:00 AM - 10:30 AM",
      students: 30,
      subject: "Computer Science",
      attendance: 92,
      averageMarks: 85,
    },
    {
      title: "Data Structures",
      time: "11:00 AM - 12:30 PM",
      students: 25,
      subject: "Computer Science",
      attendance: 88,
      averageMarks: 78,
    },
    {
      title: "Web Development",
      time: "2:00 PM - 3:30 PM",
      students: 35,
      subject: "Computer Science",
      attendance: 95,
      averageMarks: 82,
    },
    {
      title: "Machine Learning",
      time: "4:00 PM - 5:30 PM",
      students: 20,
      subject: "Computer Science",
      attendance: 90,
      averageMarks: 88,
    },
    {
      title: "Database Management",
      time: "6:00 PM - 7:30 PM",
      students: 28,
      subject: "Computer Science",
      attendance: 86,
      averageMarks: 75,
    },
    {
      title: "Software Engineering",
      time: "8:00 PM - 9:30 PM",
      students: 32,
      subject: "Computer Science",
      attendance: 91,
      averageMarks: 84,
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              ClassKeeper Chronicle
            </h1>
            <p className="text-gray-600">Track attendance and manage marks efficiently</p>
          </div>
          <Button className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
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
