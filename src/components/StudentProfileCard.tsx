
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, Upload, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface StudentData {
  name: string;
  rollNumber: string;
  studentCode: string;
  section: string;
  id?: string;
  photoUrl?: string;
}

const StudentProfileCard = ({ studentData }: { studentData: StudentData }) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (studentData?.id) {
      fetchStudentPhoto();
    }
  }, [studentData]);

  const fetchStudentPhoto = async () => {
    try {
      const { data, error } = await supabase
        .from('students_section_a')
        .select('photo_url')
        .eq('id', studentData.id)
        .single();
      
      if (error) throw error;
      if (data && data.photo_url) {
        setPhotoUrl(data.photo_url);
      }
    } catch (error) {
      console.error('Error fetching student photo:', error);
    }
  };

  const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        toast.error('Please select an image to upload.');
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${studentData.studentCode}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `student-photos/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('student-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('student-photos')
        .getPublicUrl(filePath);

      if (!publicUrlData.publicUrl) throw new Error('Could not get public URL');
      
      // Update student record with photo URL
      const { error: updateError } = await supabase
        .from('students_section_a')
        .update({ photo_url: publicUrlData.publicUrl })
        .eq('id', studentData.id);

      if (updateError) throw updateError;

      setPhotoUrl(publicUrlData.publicUrl);
      toast.success('Profile photo updated successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="mb-6 border-blue-100 shadow-md">
      <CardHeader className="bg-blue-50 border-b border-blue-100">
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          Student Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-24 w-24 border-2 border-blue-100">
              <AvatarImage src={photoUrl || ''} />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                <User />
              </AvatarFallback>
            </Avatar>
            
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs flex items-center gap-1"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 
                  <>
                    <Upload className="h-3 w-3" />
                    Upload Photo
                  </>
                }
              </Button>
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                accept="image/*"
                onChange={uploadPhoto}
                disabled={uploading}
              />
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="flex flex-col p-3 bg-blue-50 rounded-lg md:col-span-2">
              <span className="text-sm text-gray-500">Section</span>
              <span className="font-medium text-blue-800">Section {studentData.section}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentProfileCard;
