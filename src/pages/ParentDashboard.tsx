
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, User, GraduationCap, Calendar, List, FileText, MessageCircle, Bell } from "lucide-react";
import { toast } from "sonner";
import { getMentorStudentsAttendance, groupAttendanceByMonth } from "@/lib/attendance-service";

interface MentorData {
  mentorCode: string;
  role: string;
  id?: string;
}

interface StudentRecord {
  id: number;
  name: string;
  rollNumber: string;
  attendance: { present: number; absent: number; late: number; percentage: string };
  grades: { subject: string; grade: string; marks: number; outOf: number }[];
}

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [mentorData, setMentorData] = useState<MentorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Sample student data that a parent/mentor would see
  const [studentRecords, setStudentRecords] = useState<StudentRecord[]>([
    {
      id: 1,
      name: "John Doe",
      rollNumber: "CS2021001",
      attendance: { present: 62, absent: 3, late: 5, percentage: "89%" },
      grades: [
        { subject: "Mathematics", grade: "A", marks: 89, outOf: 100 },
        { subject: "Science", grade: "B+", marks: 78, outOf: 100 },
        { subject: "English", grade: "A", marks: 92, outOf: 100 },
        { subject: "History", grade: "B", marks: 76, outOf: 100 },
      ]
    },
    {
      id: 2,
      name: "Jane Smith",
      rollNumber: "CS2021002",
      attendance: { present: 58, absent: 8, late: 4, percentage: "83%" },
      grades: [
        { subject: "Mathematics", grade: "B+", marks: 85, outOf: 100 },
        { subject: "Science", grade: "A-", marks: 88, outOf: 100 },
        { subject: "English", grade: "B", marks: 80, outOf: 100 },
        { subject: "History", grade: "B+", marks: 84, outOf: 100 },
      ]
    }
  ]);
  
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
      if (parsedData.role !== "Parent/Mentor") {
        toast.error("Unauthorized access");
        navigate("/");
        return;
      }
      
      setMentorData(parsedData);
      
      // Fetch attendance data for students associated with this mentor
      fetchStudentAttendance(parsedData.id || parsedData.mentorCode);
    } catch (error) {
      console.error("Error parsing user data:", error);
      toast.error("Something went wrong");
      navigate("/");
    }
  }, [navigate]);

  const fetchStudentAttendance = async (mentorId: string) => {
    try {
      setIsLoading(true);
      const result = await getMentorStudentsAttendance(mentorId);
      
      if (result.success && result.data && result.data.length > 0) {
        // Process attendance data into student records
        // For demo, we're updating the sample data with real attendance data
        const studentsMap = new Map();
        
        // Group attendance by student
        result.data.forEach(record => {
          if (!studentsMap.has(record.student_id)) {
            studentsMap.set(record.student_id, {
              present: 0,
              absent: 0,
              late: 0,
              total: 0
            });
          }
          
          const stats = studentsMap.get(record.student_id);
          stats[record.status]++;
          stats.total++;
        });
        
        // Update student records with real attendance data
        const updatedRecords = studentRecords.map(student => {
          const stats = studentsMap.get(student.id.toString());
          
          if (stats) {
            const percentage = Math.round((stats.present / stats.total) * 100);
            return {
              ...student,
              attendance: {
                present: stats.present,
                absent: stats.absent,
                late: stats.late,
                percentage: `${percentage}%`
              }
            };
          }
          
          return student;
        });
        
        setStudentRecords(updatedRecords);
      }
    } catch (error) {
      console.error("Error fetching student attendance:", error);
      toast.error("Failed to load attendance data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (!mentorData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-purple-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <User className="h-6 w-6" />
            <h1 className="text-xl font-bold">Parent/Mentor Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm md:text-base">Mentor Code: {mentorData.mentorCode}</span>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-purple-700"
                onClick={() => navigate("/")}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white text-purple-600 hover:bg-purple-50"
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
        <Card className="mb-6">
          <CardHeader className="bg-purple-50">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-purple-600" />
              Parent/Mentor Portal
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 mb-4">
              Welcome to the parent/mentor portal. Here you can view your student's performance and attendance.
            </p>
          </CardContent>
        </Card>

        {/* Student Records */}
        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            <Card className="p-6">
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-500">Loading student data...</p>
              </div>
            </Card>
          ) : (
            studentRecords.map((student) => (
              <Card key={student.id} className="overflow-hidden border border-gray-200">
                <CardHeader className="bg-purple-50 p-6">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-purple-600" />
                      {student.name}
                    </CardTitle>
                    <span className="text-sm text-gray-500">Roll: {student.rollNumber}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs defaultValue="attendance" className="w-full">
                    <div className="border-b">
                      <TabsList className="w-full justify-start rounded-none px-6 bg-transparent">
                        <TabsTrigger value="attendance" className="rounded data-[state=active]:bg-purple-50">
                          <Calendar className="h-4 w-4 mr-2" />
                          Attendance
                        </TabsTrigger>
                        <TabsTrigger value="grades" className="rounded data-[state=active]:bg-purple-50">
                          <List className="h-4 w-4 mr-2" />
                          Grades
                        </TabsTrigger>
                        <TabsTrigger value="reports" className="rounded data-[state=active]:bg-purple-50">
                          <FileText className="h-4 w-4 mr-2" />
                          Reports
                        </TabsTrigger>
                        <TabsTrigger value="communicate" className="rounded data-[state=active]:bg-purple-50">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Communicate
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="attendance" className="p-6">
                      <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-4">
                        <div className="bg-white p-4 rounded-lg border shadow-sm flex-1">
                          <h3 className="text-lg font-medium mb-2">Attendance Summary</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="border rounded-md p-3 bg-green-50">
                              <p className="text-xs text-gray-500">Present</p>
                              <p className="text-2xl font-bold text-green-600">{student.attendance.present}</p>
                            </div>
                            <div className="border rounded-md p-3 bg-red-50">
                              <p className="text-xs text-gray-500">Absent</p>
                              <p className="text-2xl font-bold text-red-600">{student.attendance.absent}</p>
                            </div>
                            <div className="border rounded-md p-3 bg-amber-50">
                              <p className="text-xs text-gray-500">Late</p>
                              <p className="text-2xl font-bold text-amber-600">{student.attendance.late}</p>
                            </div>
                            <div className="border rounded-md p-3 bg-blue-50 relative">
                              <p className="text-xs text-gray-500">Percentage</p>
                              <p className="text-2xl font-bold text-blue-600">{student.attendance.percentage}</p>
                              {parseFloat(student.attendance.percentage) < 75 && (
                                <div className="absolute -top-1 -right-1">
                                  <Bell className="h-5 w-5 text-red-500 animate-pulse" />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {parseFloat(student.attendance.percentage) < 75 && (
                            <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 flex items-start gap-2">
                              <Bell className="h-5 w-5 mt-0.5" />
                              <div>
                                <p className="font-medium">Attendance Alert</p>
                                <p className="text-sm">Attendance is below 75% which is the minimum requirement.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="grades" className="p-6">
                      <div className="bg-white rounded-lg">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="text-left p-3 border-b">Subject</th>
                              <th className="text-center p-3 border-b">Marks</th>
                              <th className="text-center p-3 border-b">Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {student.grades.map((grade, index) => (
                              <tr key={index} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{grade.subject}</td>
                                <td className="p-3 text-center">{grade.marks}/{grade.outOf}</td>
                                <td className="p-3 text-center">
                                  <span className={`inline-flex justify-center min-w-[2rem] font-bold rounded-full px-2 py-1 text-xs
                                    ${grade.grade.startsWith('A') ? 'bg-green-100 text-green-800' : 
                                      grade.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' : 
                                      grade.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' : 
                                      'bg-red-100 text-red-800'}`
                                  }>
                                    {grade.grade}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>

                    <TabsContent value="reports" className="p-6">
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
                    </TabsContent>

                    <TabsContent value="communicate" className="p-6">
                      <div className="space-y-4">
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h3 className="text-lg font-medium mb-2">Contact Teachers</h3>
                          <p className="text-gray-600 mb-4">You can send messages to your ward's teachers or schedule a parent-teacher meeting.</p>
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" className="bg-white">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Send Message
                            </Button>
                            <Button variant="outline" className="bg-white">
                              <Calendar className="h-4 w-4 mr-2" />
                              Schedule Meeting
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
