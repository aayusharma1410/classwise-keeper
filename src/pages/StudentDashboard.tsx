
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, BookOpen, GraduationCap, Calendar, List, FileText, Bell, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface StudentData {
  name: string;
  rollNumber: string;
  studentCode: string;
  role: string;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  
  useEffect(() => {
    // Get user data from session storage
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      toast.error("You need to login first");
      navigate("/");
      return;
    }

    try {
      const parsedData = JSON.parse(userData);
      if (parsedData.role !== "Student") {
        toast.error("Unauthorized access");
        navigate("/");
        return;
      }
      
      setStudentData(parsedData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      toast.error("Something went wrong");
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (!studentData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            <h1 className="text-xl font-bold">Student Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm md:text-base">Welcome, {studentData.name}</span>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-blue-700"
                onClick={() => navigate("/")}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6">
        {/* Student Profile Card */}
        <Card className="mb-6 border-blue-100 shadow-md">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              Student Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-500">Name</span>
                <span className="font-medium text-blue-800">{studentData.name}</span>
              </div>
              <div className="flex flex-col p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-500">Roll Number</span>
                <span className="font-medium text-blue-800">{studentData.rollNumber}</span>
              </div>
              <div className="flex flex-col p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-500">Student Code</span>
                <span className="font-medium text-blue-800">{studentData.studentCode}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Alert Card - Show only if below 75% */}
        <AttendanceAlarmCard />

        {/* Tabs Content */}
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsListWrapper>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden md:inline">Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="marks" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span className="hidden md:inline">Marks</span>
            </TabsTrigger>
            <TabsTrigger value="syllabus" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">Syllabus</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Reports</span>
            </TabsTrigger>
          </TabsListWrapper>

          <TabsContent value="attendance" className="space-y-4">
            <AttendanceTable />
          </TabsContent>
          
          <TabsContent value="marks" className="space-y-4">
            <MarksTable />
          </TabsContent>
          
          <TabsContent value="syllabus" className="space-y-4">
            <SyllabusContent />
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <ReportsContent />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// New Attendance Alarm Card Component
const AttendanceAlarmCard = () => {
  // For demo purposes, hardcoding the attendance percentage to trigger the alarm
  const attendancePercentage = 73;
  const isAttendanceLow = attendancePercentage < 75;

  if (!isAttendanceLow) return null;

  return (
    <Card className="mb-6 border-red-200 bg-red-50 shadow-md animate-pulse">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-red-100 p-2 rounded-full">
            <Bell className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Attendance Alert
            </h3>
            <p className="text-red-600 mt-1">
              Your current attendance is {attendancePercentage}%, which is below the required 75%. 
              Please improve your attendance to avoid academic penalties.
            </p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                View Details
              </Button>
              <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                Contact Teacher
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper Components
const TabsListWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="border rounded-lg p-1 bg-white shadow-sm">
    <TabsList className="grid grid-cols-4">{children}</TabsList>
  </div>
);

const AttendanceTable = () => (
  <Card className="border-blue-100 shadow-sm">
    <CardHeader className="bg-blue-50 border-b border-blue-100">
      <CardTitle className="text-lg text-blue-700">Attendance Record</CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3 text-left">Month</th>
              <th className="p-3 text-center">Present</th>
              <th className="p-3 text-center">Absent</th>
              <th className="p-3 text-center">Late</th>
              <th className="p-3 text-center">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {[
              { month: "January", present: 20, absent: 2, late: 1, percentage: "87%" },
              { month: "February", present: 18, absent: 0, late: 2, percentage: "90%" },
              { month: "March", present: 22, absent: 1, late: 0, percentage: "96%" },
              { month: "April", present: 16, absent: 5, late: 3, percentage: "73%" },
            ].map((item, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{item.month}</td>
                <td className="p-3 text-center text-green-600">{item.present}</td>
                <td className="p-3 text-center text-red-600">{item.absent}</td>
                <td className="p-3 text-center text-amber-600">{item.late}</td>
                <td className="p-3 text-center">
                  <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                    parseFloat(item.percentage) < 75 
                      ? "bg-red-100 text-red-700" 
                      : "bg-green-100 text-green-700"
                  }`}>
                    {item.percentage}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 p-4 border border-blue-100 rounded-lg bg-blue-50">
        <h4 className="text-blue-800 font-medium mb-2">Attendance Requirements</h4>
        <p className="text-blue-700 text-sm">
          <span className="font-bold">75% attendance is mandatory</span> to be eligible for final examinations. 
          Students falling below this threshold may face academic penalties.
        </p>
      </div>
    </CardContent>
  </Card>
);

const MarksTable = () => (
  <Card className="border-blue-100 shadow-sm">
    <CardHeader className="bg-blue-50 border-b border-blue-100">
      <CardTitle className="text-lg text-blue-700">Academic Performance</CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3 text-left">Subject</th>
              <th className="p-3 text-center">Mid Term</th>
              <th className="p-3 text-center">Final Exam</th>
              <th className="p-3 text-center">Assignment</th>
              <th className="p-3 text-center">Grade</th>
            </tr>
          </thead>
          <tbody>
            {[
              { subject: "Mathematics", midTerm: 85, finalExam: 92, assignment: 88, grade: "A" },
              { subject: "Science", midTerm: 78, finalExam: 85, assignment: 90, grade: "B+" },
              { subject: "English", midTerm: 92, finalExam: 88, assignment: 95, grade: "A" },
              { subject: "History", midTerm: 76, finalExam: 82, assignment: 80, grade: "B" },
              { subject: "Geography", midTerm: 88, finalExam: 84, assignment: 86, grade: "B+" },
            ].map((item, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{item.subject}</td>
                <td className="p-3 text-center">{item.midTerm}</td>
                <td className="p-3 text-center">{item.finalExam}</td>
                <td className="p-3 text-center">{item.assignment}</td>
                <td className="p-3 text-center">
                  <span className={`inline-flex justify-center min-w-[2rem] font-bold rounded-full px-2 py-1 text-xs
                    ${item.grade.startsWith('A') ? 'bg-green-100 text-green-800' : 
                      item.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' : 
                      item.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`
                  }>
                    {item.grade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

const SyllabusContent = () => (
  <Card className="border-blue-100 shadow-sm">
    <CardHeader className="bg-blue-50 border-b border-blue-100">
      <CardTitle className="text-lg text-blue-700">Course Syllabus</CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      <div className="space-y-6">
        {[
          {
            subject: "Mathematics",
            units: [
              "Algebra: Equations and Inequalities",
              "Geometry: Triangles and Circles",
              "Calculus: Limits and Derivatives"
            ]
          },
          {
            subject: "Science",
            units: [
              "Physics: Motion and Forces",
              "Chemistry: Elements and Compounds",
              "Biology: Cells and Organisms"
            ]
          },
          {
            subject: "English",
            units: [
              "Literature: Classic Novels",
              "Grammar: Parts of Speech",
              "Writing: Essays and Reports"
            ]
          }
        ].map((item, i) => (
          <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
            <h3 className="text-md font-semibold mb-2 text-blue-700">{item.subject}</h3>
            <ul className="list-disc list-inside space-y-1">
              {item.units.map((unit, j) => (
                <li key={j} className="text-gray-700">{unit}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ReportsContent = () => (
  <Card className="border-blue-100 shadow-sm">
    <CardHeader className="bg-blue-50 border-b border-blue-100">
      <CardTitle className="text-lg text-blue-700">Academic Reports</CardTitle>
    </CardHeader>
    <CardContent className="p-6">
      <div className="space-y-4">
        {[
          { title: "First Term Progress Report", date: "April 15, 2023", status: "Available" },
          { title: "Mid-Year Assessment", date: "August 30, 2023", status: "Available" },
          { title: "Final Year Report", date: "December 20, 2023", status: "Pending" }
        ].map((item, i) => (
          <div key={i} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-gray-500">Date: {item.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${item.status === "Available" ? "text-green-600" : "text-amber-600"}`}>
                {item.status}
              </span>
              {item.status === "Available" && (
                <Button variant="outline" size="sm" className="text-xs">
                  Download
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default StudentDashboard;
