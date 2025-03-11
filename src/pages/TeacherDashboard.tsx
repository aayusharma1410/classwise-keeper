import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Download, 
  Bell, 
  Search,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Home,
  Upload
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
import { supabase } from "@/lib/supabase";
import { uploadSampleClassCodes } from "@/lib/upload-class-codes";

interface TeacherData {
  name: string;
  email: string;
  role: string;
  subject?: string;
  class?: string;
  uniqueCode?: string;
  id?: string;
}

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("daily");
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Retrieve teacher data from session storage
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const parsedData = JSON.parse(userData);
      setTeacherData(parsedData);
      
      // Pre-select the class and subject if available
      if (parsedData.class) {
        setSelectedClass(parsedData.class);
      }
      
      if (parsedData.subject) {
        setSelectedSubject(parsedData.subject);
      }
    }
  }, []);

  // Mock data for Class 12 E students
  const class12EStudents = [
    { id: 1, name: "Rahul Sharma", roll: "12E001", avatar: "RS" },
    { id: 2, name: "Priya Patel", roll: "12E002", avatar: "PP" },
    { id: 3, name: "Aditya Singh", roll: "12E003", avatar: "AS" },
    { id: 4, name: "Neha Gupta", roll: "12E004", avatar: "NG" },
    { id: 5, name: "Sanjay Verma", roll: "12E005", avatar: "SV" },
    { id: 6, name: "Ananya Mishra", roll: "12E006", avatar: "AM" },
    { id: 7, name: "Vikram Reddy", roll: "12E007", avatar: "VR" },
    { id: 8, name: "Meera Khanna", roll: "12E008", avatar: "MK" },
  ];

  const subjects = [
    { id: "1", name: "Introduction to Python", code: "CS101" },
    { id: "2", name: "Data Structures", code: "CS202" },
    { id: "3", name: "Web Development", code: "CS303" },
    { id: "4", name: "History", code: "HS101" },
    { id: "5", name: "Database Management", code: "CS505" },
    { id: "6", name: "Software Engineering", code: "CS606" },
  ];

  const classes = [
    { id: "1", name: "Computer Science - Year 1" },
    { id: "2", name: "Computer Science - Year 2" },
    { id: "3", name: "Computer Science - Year 3" },
    { id: "4", name: "12 E" },
  ];

  const handleDownloadReport = () => {
    toast({
      title: "Report Downloaded",
      description: "Attendance report has been downloaded successfully",
    });
  };

  const handleAttendanceSaved = () => {
    setRefreshKey(prev => prev + 1);
    
    toast({
      title: "Attendance Saved",
      description: "Student attendance has been saved to the database successfully",
    });
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const getSubjectId = () => {
    const subject = subjects.find(s => s.name === selectedSubject);
    return subject?.id || "HS101";
  };

  const getClassId = () => {
    const classItem = classes.find(c => c.name === selectedClass);
    return classItem?.id || "4";
  };

  const handleUploadClassCodes = async () => {
    setIsUploading(true);
    
    try {
      const result = await uploadSampleClassCodes();
      
      if (result.success) {
        toast({
          title: "Upload Successful",
          description: "Class codes have been uploaded to the database",
        });
      } else {
        toast({
          title: "Upload Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading class codes:", error);
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred while uploading class codes",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleGoBack} 
              className="rounded-full bg-white shadow-sm hover:bg-blue-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                Teacher Dashboard
              </h1>
              <p className="text-gray-600">Welcome, {teacherData?.name || "Professor"}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex items-center space-x-2 border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              onClick={handleGoBack}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 border-blue-200 hover:bg-blue-50 hover:text-blue-600">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </Button>
            <Button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700" onClick={handleDownloadReport}>
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </Button>
          </div>
        </div>

        <Card className="mb-6 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Admin Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleUploadClassCodes} 
                disabled={isUploading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Upload className="mr-2 h-4 w-4" />
                <span>{isUploading ? "Uploading..." : "Upload Class Codes"}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Class Information</CardTitle>
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
                      <SelectItem key={subject.id} value={subject.name}>
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
                      <SelectItem key={classItem.id} value={classItem.name}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {teacherData?.uniqueCode === "aayush123" ? 
                    "Class 12 E - History Students" : 
                    "Student Attendance"}
                </CardTitle>
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
                {teacherData?.uniqueCode === "aayush123" ? (
                  <AttendanceTable 
                    key={refreshKey}
                    specialStudents={class12EStudents} 
                    classId={getClassId()}
                    subjectId={getSubjectId()}
                    teacherId={teacherData.id || "aayush"}
                    onSaveSuccess={handleAttendanceSaved}
                  />
                ) : (
                  <AttendanceTable 
                    key={refreshKey}
                    classId={getClassId()}
                    subjectId={getSubjectId()}
                    teacherId={teacherData?.id || "default"}
                    onSaveSuccess={handleAttendanceSaved}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
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
                        <p className="font-medium text-amber-800">Rahul Sharma</p>
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
                        <p className="font-medium text-red-800">Ananya Mishra</p>
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
                        <p className="font-medium text-amber-800">Vikram Reddy</p>
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
