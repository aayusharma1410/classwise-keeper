
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
    <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-up">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
            Active
          </span>
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>{time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{students} students</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>{subject}</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassCard;
