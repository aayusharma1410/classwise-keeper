
import { useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { saveAttendance } from "@/lib/attendance-service";

// Default student data
const defaultStudents = [
  { id: 1, name: "John Doe", roll: "CS2021001", avatar: "JD" },
  { id: 2, name: "Jane Smith", roll: "CS2021002", avatar: "JS" },
  { id: 3, name: "Michael Johnson", roll: "CS2021003", avatar: "MJ" },
  { id: 4, name: "Emily Brown", roll: "CS2021004", avatar: "EB" },
  { id: 5, name: "David Wilson", roll: "CS2021005", avatar: "DW" },
  { id: 6, name: "Sarah Lee", roll: "CS2021006", avatar: "SL" },
  { id: 7, name: "Robert Taylor", roll: "CS2021007", avatar: "RT" },
  { id: 8, name: "Jennifer Martinez", roll: "CS2021008", avatar: "JM" },
];

interface Student {
  id: number;
  name: string;
  roll: string;
  avatar: string;
}

interface AttendanceStatus {
  [key: number]: "present" | "absent" | "late" | null;
}

interface AttendanceTableProps {
  specialStudents?: Student[];
  classId?: string;
  subjectId?: string;
  teacherId?: string;
  onSaveSuccess?: () => void;
}

const AttendanceTable = ({ 
  specialStudents, 
  classId = "default-class", 
  subjectId = "default-subject", 
  teacherId = "default-teacher",
  onSaveSuccess 
}: AttendanceTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [attendance, setAttendance] = useState<AttendanceStatus>({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  // Use special students if provided, otherwise use default
  const students = specialStudents || defaultStudents;

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.roll.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAttendanceChange = (studentId: number, status: "present" | "absent" | "late") => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const getStatusColor = (status: "present" | "absent" | "late" | null) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-200";
      case "absent":
        return "bg-red-100 text-red-800 border-red-200";
      case "late":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleSaveAttendance = async () => {
    try {
      setIsSaving(true);
      const today = new Date().toISOString().split('T')[0];
      
      // Prepare attendance records for saving
      const attendanceRecords = Object.entries(attendance).map(([studentId, status]) => ({
        student_id: studentId,
        class_id: classId,
        subject_id: subjectId,
        date: today,
        status: status || 'absent', // Default to absent if not set
        teacher_id: teacherId
      }));
      
      if (attendanceRecords.length === 0) {
        toast({
          title: "No attendance records",
          description: "Please mark attendance for at least one student",
          variant: "destructive"
        });
        setIsSaving(false);
        return;
      }
      
      const result = await saveAttendance(attendanceRecords);
      
      if (result.success) {
        toast({
          title: "Attendance Saved",
          description: "Student attendance has been saved successfully"
        });
        
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      } else {
        toast({
          title: "Error Saving Attendance",
          description: "There was a problem saving the attendance records",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast({
        title: "Error Saving Attendance",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetAttendance = () => {
    setAttendance({});
  };

  return (
    <div>
      <div className="mb-4">
        <Input
          placeholder="Search by name or roll number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Roll No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Student
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Present
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Absent
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Late
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {student.roll}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                        {student.avatar}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleAttendanceChange(student.id, "present")}
                      className={`inline-flex items-center justify-center rounded-full p-2 ${
                        attendance[student.id] === "present" ? "bg-green-100 text-green-600" : "text-gray-400 hover:bg-green-50 hover:text-green-600"
                      }`}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleAttendanceChange(student.id, "absent")}
                      className={`inline-flex items-center justify-center rounded-full p-2 ${
                        attendance[student.id] === "absent" ? "bg-red-100 text-red-600" : "text-gray-400 hover:bg-red-50 hover:text-red-600"
                      }`}
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleAttendanceChange(student.id, "late")}
                      className={`inline-flex items-center justify-center rounded-full p-2 ${
                        attendance[student.id] === "late" ? "bg-amber-100 text-amber-600" : "text-gray-400 hover:bg-amber-50 hover:text-amber-600"
                      }`}
                    >
                      <Clock className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        getStatusColor(attendance[student.id])
                      }`}
                    >
                      {attendance[student.id] ? attendance[student.id].charAt(0).toUpperCase() + attendance[student.id].slice(1) : "Not Set"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-3">
        <Button 
          variant="outline" 
          className="border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          onClick={resetAttendance}
        >
          Reset
        </Button>
        <Button 
          onClick={handleSaveAttendance} 
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? "Saving..." : "Save Attendance"}
        </Button>
      </div>
    </div>
  );
};

export default AttendanceTable;
