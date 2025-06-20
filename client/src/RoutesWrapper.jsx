// // import { useAuthContext } from "./hooks/useAuthContext";
// import { renderRoutes as renderRoutesFn } from "./routes";


// const RoutesWrapper = ({ routes }) => {
//   // Get user data from localStorage
//   const userData = localStorage.getItem("userData");

//   let userRole = null;
//   let isAuthenticated = false;

//   // Parse user data if it exists
//   if (userData) {
//     try {
//       const user = JSON.parse(userData);
//       userRole = user.role; // Assuming role is stored in the user object
//       isAuthenticated = true;
//     } catch (error) {
//       console.error("Error parsing user data:", error);
//       // Clear invalid user data
//       localStorage.removeItem("userData");
//     }
//   }

//   return renderRoutesFn(routes, { userRole, isAuthenticated });
// };

// export default RoutesWrapper;


import { useAuthSync } from './hooks/useAuthSync';
import { renderRoutes as renderRoutesFn } from "./routes";

const RoutesWrapper = ({ routes }) => {
  const { userRole, isAuthenticated } = useAuthSync();
  return renderRoutesFn(routes, { userRole, isAuthenticated });
};

export default RoutesWrapper;