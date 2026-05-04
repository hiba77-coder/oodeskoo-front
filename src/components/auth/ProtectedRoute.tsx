import { useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import type { Role, Staff } from "../../types/auth";

type ProtectedRouteProps = {
  allowedRoles?: Role[];
  children?: React.ReactNode;
};

const getStaffRole = (staff: Staff | null): Role | null => {
  if (!staff) {
    return null;
  }

  return (staff.role ?? staff.Role ?? null) as Role | null;
};

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated, isInitializing, staff } = useAuth();
  const location = useLocation();

  const hasRoleAccess = useMemo(() => {
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    const role = getStaffRole(staff);
    return role ? allowedRoles.includes(role) : false;
  }, [allowedRoles, staff]);

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRoleAccess) {
    return <Navigate to="/" replace />;
  }

  return children ?? <Outlet />;
}
