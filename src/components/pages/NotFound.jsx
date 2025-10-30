import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <ApperIcon name="AlertCircle" size={80} className="mx-auto text-error" />
        </div>
        <h1 className="text-6xl font-display font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-display font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ApperIcon name="ArrowLeft" size={20} />
            Go Back
          </Button>
          <Button onClick={() => navigate("/")}>
            <ApperIcon name="Home" size={20} />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}