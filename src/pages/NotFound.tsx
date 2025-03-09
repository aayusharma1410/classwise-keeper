
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleGoBack}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={handleGoHome}
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
