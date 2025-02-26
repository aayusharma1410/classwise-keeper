
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Clock, Users, BookOpen } from "lucide-react";

interface ClassCardProps {
  title: string;
  time: string;
  students: number;
  subject: string;
}

const ClassCard = ({ title, time, students, subject }: ClassCardProps) => {
  return (
    <Card className="overflow-hidden bg-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-up">
      <CardHeader className="space-y-1 bg-gradient-to-r from-blue-50 to-blue-100 p-6">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            Active
          </span>
        </div>
        <CardTitle className="text-xl font-bold text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>{time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span>{students} students</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span>{subject}</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50 hover:text-blue-600">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassCard;
