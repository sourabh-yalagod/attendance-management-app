// components/ProtectedRoute.tsx
import { useAuth, useUser } from "@clerk/react";
import { Outlet, Navigate } from "react-router-dom";

type Role =
  | "STUDENT"
  | "TRAINER"
  | "INSTITUTION"
  | "PROGRAMME_MANAGER"
  | "MONITORING_OFFICER";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const auth = useAuth() as any;
  const { user } = useUser() as any;

  const isSignedIn = auth?.isSignedIn ?? !!auth?.userId;
  // Still loading
  if (auth === undefined || (isSignedIn && !user)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in
  // if (!isSignedIn) {
  //   return <Navigate to="/login" replace />;
  // }

  // Logged in but no role set yet → send to onboarding
  const role = user?.unsafeMetadata?.role as Role | undefined;
  console.log({user:user?.unsafeMetadata});
  
  if (!role) {
    return <Navigate to="/onboarding" />;
  }

  // Role not allowed for this route
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}