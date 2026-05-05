import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role }: { role?: string }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user?.role) return <Navigate to="/register" />;

  if (role && user.role !== role) return <Navigate to="/" />;

  return <Outlet />;
};

export default ProtectedRoute;