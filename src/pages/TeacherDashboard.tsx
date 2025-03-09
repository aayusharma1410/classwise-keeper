
import { useState } from "react";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Download, 
  Bell, 
  Search,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import AttendanceTable from "@/components/AttendanceTable";
import AttendanceChart from "@/components/AttendanceChart";

const TeacherDashboard = () => {
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("daily");

  const subjects = [
    { id: "1", name: "Introduction to Python", code: "CS101" },
    { id: "2", name: "Data Structures", code: "CS202" },
    { id: "3", name: "Web Development", code: "CS303" },
    { id: "4", name: "Machine Learning", code: "CS404" },
    { id: "5", name: "Database Management", code: "CS505" },
    { id: "6", name: "Software Engineering", code: "CS606" },
  ];

  const classes = [
    { id: "1", name: "Computer Science - Year 1" },
    { id: "2", name: "Computer Science - Year 2" },
    { id: "3", name: "Computer Science - Year 3" },
    { id: "4", name: "Computer Science - Year 4" },
  ];

  const handleDownloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: "Attendance report has been downloaded successfully",
    });
  };

  const handleSaveAttendance = () => {
    toast({
      title: "Attendance Saved",
      description: "Student attendance has been saved successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Teacher Dashboard
            </h1>
            <p className="text-gray-600">Welcome, Professor Anderson</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center space-x-2 border-blue-200 hover:bg-blue-50 hover:text-blue-600">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </Button>
            <Button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </Button>
          </div>
        </div>

        {/* Subject and Class Selection */}
        <Card className="mb-6 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Select Subject & Class</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Two Columns on Desktop */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Attendance Table - Takes up 2/3 of the space */}
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800">Student Attendance</CardTitle>
                <div className="flex items-center space-x-2">
                  <Select value={attendanceFilter} onValueChange={setAttendanceFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="semester">Semester</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="ml-2 border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Date</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <AttendanceTable />
                <div className="mt-4 flex justify-end space-x-3">
                  <Button variant="outline" className="border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                    Reset
                  </Button>
                  <Button onClick={handleSaveAttendance} className="bg-blue-600 hover:bg-blue-700">
                    Save Attendance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Takes up 1/3 of the space */}
          <div className="space-y-6">
            {/* Attendance Statistics */}
            <Card className="bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800">Attendance Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <AttendanceChart />
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-green-50 p-4 text-center">
                    <p className="text-sm font-medium text-green-700">Present</p>
                    <p className="text-2xl font-bold text-green-800">85%</p>
                  </div>
                  <div className="rounded-lg bg-red-50 p-4 text-center">
                    <p className="text-sm font-medium text-red-700">Absent</p>
                    <p className="text-2xl font-bold text-red-800">15%</p>
                  </div>
                </div>
                <Button 
                  onClick={handleDownloadReport} 
                  variant="outline" 
                  className="mt-4 w-full border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <Download className="mr-2 h-4 w-4" />
                  <span>Download Report</span>
                </Button>
              </CardContent>
            </Card>

            {/* Low Attendance Alerts */}
            <Card className="bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800">Low Attendance Alerts</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-amber-50 p-3">
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-amber-500" />
                      <div>
                        <p className="font-medium text-amber-800">John Doe</p>
                        <p className="text-xs text-amber-700">Attendance: 65%</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 hover:bg-amber-100 hover:text-amber-700">
                      Notify
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium text-red-800">Jane Smith</p>
                        <p className="text-xs text-red-700">Attendance: 48%</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 hover:bg-red-100 hover:text-red-700">
                      Notify
                    </Button>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-amber-50 p-3">
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-amber-500" />
                      <div>
                        <p className="font-medium text-amber-800">Alex Johnson</p>
                        <p className="text-xs text-amber-700">Attendance: 72%</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 hover:bg-amber-100 hover:text-amber-700">
                      Notify
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
