/* eslint-disable react/prop-types */
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth)
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />
  }

  // Redirect to home/dashboard if user doesn't have required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />
  }
  
  return children
}

export default ProtectedRoute
