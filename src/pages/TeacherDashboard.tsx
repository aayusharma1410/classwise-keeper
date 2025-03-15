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
  Upload,
  Database
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
import { uploadClassCodes, uploadUserClassCodes, uploadAllData } from "@/lib/upload-class-codes";
import { ensureClassCodesTableExists } from "@/lib/class-code-service";

interface TeacherData {
  name: string;
  email?: string;
  role: string;
  subject?: string;
  class?: string;
  uniqueCode?: string;
  id?: string;
  section?: string;
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
  const [isCreatingTable, setIsCreatingTable] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const parsedData = JSON.parse(userData);
      setTeacherData(parsedData);
      
      if (parsedData.class) {
        setSelectedClass(parsedData.class);
      } else if (parsedData.section) {
        setSelectedClass(`12 ${parsedData.section}`);
      }
      
      if (parsedData.subject) {
        setSelectedSubject(parsedData.subject);
      }
    } else {
      // If no user data, redirect to login
      navigate('/');
    }
    
    // Fetch subjects
    fetchSubjects();
  }, [navigate]);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      if (data) {
        setSubjects(data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

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

  const sections = [
    { value: "A", label: "Section A" },
    { value: "B", label: "Section B" },
    { value: "C", label: "Section C" },
    { value: "D", label: "Section D" },
    { value: "E", label: "Section E" },
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
    const classItem = sections.find(c => c.value === selectedClass);
    return classItem?.value || "4";
  };

  const handleUploadAllSubjectCodes = async () => {
    setIsUploading(true);
    
    try {
      // Create or replace all subject codes for all sections
      const subjectsData = [
        // Section A
        { id: 1, subject_name: 'DMS', code: '8253A-67K', section: 'A' },
        { id: 2, subject_name: 'TOC', code: '3135B-23X', section: 'A' },
        { id: 3, subject_name: 'DCCN', code: '9402C-11M', section: 'A' },
        { id: 4, subject_name: 'DBMS', code: '2856D-96T', section: 'A' },
        { id: 5, subject_name: 'JAVA', code: '7361E-39J', section: 'A' },
        { id: 6, subject_name: 'MPI', code: '5247F-72L', section: 'A' },
        
        // Section B
        { id: 7, subject_name: 'DMS', code: '6138A-59N', section: 'B' },
        { id: 8, subject_name: 'TOC', code: '8472B-64Y', section: 'B' },
        { id: 9, subject_name: 'DCCN', code: '4593C-32H', section: 'B' },
        { id: 10, subject_name: 'DBMS', code: '1678D-90V', section: 'B' },
        { id: 11, subject_name: 'JAVA', code: '3814E-21U', section: 'B' },
        { id: 12, subject_name: 'MPI', code: '9925F-47P', section: 'B' },
        
        // Section C
        { id: 13, subject_name: 'DMS', code: '4762A-88D', section: 'C' },
        { id: 14, subject_name: 'TOC', code: '2507B-53O', section: 'C' },
        { id: 15, subject_name: 'DCCN', code: '8134C-76Z', section: 'C' },
        { id: 16, subject_name: 'DBMS', code: '6259D-42B', section: 'C' },
        { id: 17, subject_name: 'JAVA', code: '7983E-19E', section: 'C' },
        { id: 18, subject_name: 'MPI', code: '1546F-81C', section: 'C' },
        
        // Section D
        { id: 19, subject_name: 'DMS', code: '3682A-33M', section: 'D' },
        { id: 20, subject_name: 'TOC', code: '7425B-25N', section: 'D' },
        { id: 21, subject_name: 'DCCN', code: '9023C-50Y', section: 'D' },
        { id: 22, subject_name: 'DBMS', code: '4361D-71W', section: 'D' },
        { id: 23, subject_name: 'JAVA', code: '2584E-97H', section: 'D' },
        { id: 24, subject_name: 'MPI', code: '6709F-66X', section: 'D' },
        
        // Section E
        { id: 25, subject_name: 'DMS', code: '5273A-17J', section: 'E' },
        { id: 26, subject_name: 'TOC', code: '3852B-60R', section: 'E' },
        { id: 27, subject_name: 'DCCN', code: '1496C-55Q', section: 'E' },
        { id: 28, subject_name: 'DBMS', code: '2187D-80S', section: 'E' },
        { id: 29, subject_name: 'JAVA', code: '6349E-14T', section: 'E' },
        { id: 30, subject_name: 'MPI', code: '7751F-48L', section: 'E' },
      ];

      const { error: subjectsError } = await supabase
        .from('subjects')
        .upsert(subjectsData, { onConflict: 'id' });

      if (subjectsError) {
        console.error('Error uploading subject codes:', subjectsError);
        toast({
          title: "Upload Failed",
          description: `Error uploading subject codes: ${subjectsError.message}`,
          variant: "destructive",
        });
      } else {
        // Refresh the subjects list
        await fetchSubjects();
        
        toast({
          title: "Upload Successful",
          description: "All subject codes have been uploaded to the database",
        });
      }
    } catch (error) {
      console.error("Error uploading subject codes:", error);
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred while uploading subject codes",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClassCodes = async () => {
    setIsUploading(true);
    
    try {
      const result = await uploadClassCodes();
      
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

  const handleCreateTableAndUploadCodes = async () => {
    setIsCreatingTable(true);
    
    try {
      const tableCheck = await ensureClassCodesTableExists();
      
      const result = await uploadUserClassCodes(true);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Class codes table is ready and data has been uploaded",
        });
      } else {
        toast({
          title: "Operation Failed",
          description: result.message || "Failed to upload class codes",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating table and uploading codes:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreatingTable(false);
    }
  };

  const handleUploadAllData = async () => {
    setIsUploading(true);
    
    try {
      const result = await uploadAllData();
      
      if (result.classCodesSuccess && result.sectionASuccess) {
        toast({
          title: "Upload Successful",
          description: "All data has been uploaded to the database",
        });
      } else {
        toast({
          title: "Upload Partially Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading data:", error);
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred while uploading data",
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
              {teacherData?.section && teacherData?.subject && (
                <p className="text-sm text-blue-600">
                  Section {teacherData.section} - {teacherData.subject}
                </p>
              )}
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
              
              <Button 
                onClick={handleCreateTableAndUploadCodes} 
                disabled={isCreatingTable}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Database className="mr-2 h-4 w-4" />
                <span>
                  {isCreatingTable ? "Processing..." : "Create Table & Upload Class Codes"}
                </span>
              </Button>

              <Button 
                onClick={handleUploadAllData} 
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Database className="mr-2 h-4 w-4" />
                <span>{isUploading ? "Uploading..." : "Upload All Data"}</span>
              </Button>
              
              <Button 
                onClick={handleUploadAllSubjectCodes} 
                disabled={isUploading}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Upload className="mr-2 h-4 w-4" />
                <span>{isUploading ? "Uploading..." : "Upload All Subject Codes"}</span>
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
                    {subjects
                      .filter(subject => !teacherData?.section || subject.section === teacherData?.section)
                      .map((subject) => (
                        <SelectItem key={subject.id} value={subject.subject_name}>
                          {subject.subject_name} ({subject.code})
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
                    {sections.map((section) => (
                      <SelectItem key={section.value} value={`12 ${section.value}`}>
                        Class 12 {section.value}
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
