
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Bell, BookOpen, Calendar, ClipboardList, Home, Users, UserCheck, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    // Get user data from session storage
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header with navigation buttons */}
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleHome}>
              <Home className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold hidden md:block">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="sticky top-6">
              <CardHeader className="bg-indigo-600 text-white rounded-t-lg">
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription className="text-indigo-100">
                  Welcome, Admin
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <Button variant="ghost" className="justify-start p-4 border-b">
                    <Users className="mr-2 h-5 w-5" />
                    Manage Users
                  </Button>
                  <Button variant="ghost" className="justify-start p-4 border-b">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Manage Courses
                  </Button>
                  <Button variant="ghost" className="justify-start p-4 border-b">
                    <UserCheck className="mr-2 h-5 w-5" />
                    Manage Teachers
                  </Button>
                  <Button variant="ghost" className="justify-start p-4 border-b">
                    <ClipboardList className="mr-2 h-5 w-5" />
                    Reports
                  </Button>
                  <Button variant="ghost" className="justify-start p-4 border-b">
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="md:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="classes">Classes</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-blue-500 text-white rounded-t-lg">
                      <CardTitle className="flex items-center">
                        <Users className="mr-2 h-6 w-6" />
                        Total Students
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-4xl font-bold">548</p>
                      <p className="text-sm text-gray-500 mt-2">+12 this month</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-green-500 text-white rounded-t-lg">
                      <CardTitle className="flex items-center">
                        <UserCheck className="mr-2 h-6 w-6" />
                        Total Teachers
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-4xl font-bold">48</p>
                      <p className="text-sm text-gray-500 mt-2">+3 this month</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-purple-500 text-white rounded-t-lg">
                      <CardTitle className="flex items-center">
                        <Calendar className="mr-2 h-6 w-6" />
                        Active Courses
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-4xl font-bold">24</p>
                      <p className="text-sm text-gray-500 mt-2">+2 this month</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <div className={`p-2 rounded-full ${
                              i % 3 === 0 ? 'bg-blue-100 text-blue-600' : 
                              i % 3 === 1 ? 'bg-green-100 text-green-600' : 
                              'bg-yellow-100 text-yellow-600'
                            }`}>
                              {i % 3 === 0 ? <UserCheck className="h-5 w-5" /> : 
                               i % 3 === 1 ? <Bell className="h-5 w-5" /> : 
                               <BookOpen className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="font-medium">
                                {i % 3 === 0 ? 'New teacher registered' : 
                                 i % 3 === 1 ? 'System notification sent' : 
                                 'New course added'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {`${Math.floor(i * 2)} ${i === 1 ? 'hour' : 'hours'} ago`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="users" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage all users from one place</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">Content for user management will be shown here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="classes" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Class Management</CardTitle>
                    <CardDescription>Manage all classes and courses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">Content for class management will be shown here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reports" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Reports & Analytics</CardTitle>
                    <CardDescription>View detailed reports and analytics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500">Content for reports and analytics will be shown here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
