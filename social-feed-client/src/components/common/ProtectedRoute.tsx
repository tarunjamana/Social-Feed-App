import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

import type { ProtectedRouteProps } from "../../types/auth";

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
