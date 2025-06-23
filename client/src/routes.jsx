import { Suspense, Fragment, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/index.jsx";
import LoadingScreen from "./components/LoadingScreen/index.jsx";
import LayoutSelector from "./layouts/LayoutSelector";
// import LoginPage from "./views/LoginPage/LoginPage.jsx";

const checkAuthorization = (requiredRoles = [], userRole) => {
  return requiredRoles.length === 0 || requiredRoles.includes(userRole);
};

export const renderRoutes = (routes = [], { userRole, isAuthenticated }) => {
  console.log(`USERROLE : `, userRole);
  console.log(`AUTHENTICATION : `, isAuthenticated);
  return ( 
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {routes.map((route, i) => {
          const Component = route.component;
          const isProtected = route.protected || false;
          const requiredRoles = route.roles || [];

          const Layout =
            route.layout === "roleBased"
              ? ({ children }) => (
                  <LayoutSelector role={userRole}>{children}</LayoutSelector>
                )
              : route.layout || Fragment;

          return (
            <Route
              key={i}
              path={route.path}
              element={
                <Layout>
                  {isProtected && !isAuthenticated ? (
                    <Navigate to="/login" />
                  ) : !checkAuthorization(requiredRoles, userRole) ? (
                    <Navigate to="/unauthorized" />
                  ) : (
                    <Component />
                  )}
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};

const RedirectToExternalWebsite = () => {
  window.location.href = "https://www.polytecsousse.tn/";
  return null;
};

const routes = [
  {
    path: "/",
    // component: RedirectToExternalWebsite,
    component: lazy(() => import("./views/LoginPage/LoginPage.jsx")),
  },
  {
    path: "/login",
    component: lazy(() => import("./views/LoginPage/LoginPage.jsx")),
  },

  {
    path: "*",
    component: lazy(() => import("./views/NotFound/NotFound.jsx")),
  },
  {
    path: "/loader",
    component: lazy(() => import("./components/LoadingScreen/index.jsx")),
  },

  {
    path: "/admin/dashboard",
    component: lazy(() => import("./views/Admin/AdminDashboard.jsx")),
    layout: "roleBased",
    roles: ["admin"],
    protected: true,
  },
  {
    path: "/admin/students",
    component: lazy(() => import("./views/Admin/Students.jsx")),
    layout: "roleBased",
    roles: ["admin"],
    protected: true,
  },
  {
    path: "/admin/tutors",
    component: lazy(() => import("./views/Admin/Tutors.jsx")),
    layout: "roleBased",
    roles: ["admin"],
    protected: true,
  },
  {
    path: "/admin/teams",
    component: lazy(() => import("./views/Admin/Teams.jsx")),
    layout: "roleBased",
    roles: ["admin"],
    protected: true,
  },

  {
    path: "/admin/events",
    component: lazy(() => import("./views/Admin/Events.jsx")),
    layout: "roleBased",
    roles: ["admin"],
    protected: true,
  },
  {
    path: "/admin/reservations",
    component: lazy(() => import("./views/Admin/News.jsx")),
    layout: "roleBased",
    roles: ["admin" , "student" , "tutor"],
    protected:false,
  },
  {
    path: "/admin/reclamations",
    component: lazy(() => import("./views/Admin/News.jsx")),
    layout: "roleBased",
    roles: ["admin" , "student" , "tutor"],
    protected:false,
  },
  {
    path: "/admin/news",
    component: lazy(() => import("./views/Admin/News.jsx")),
    layout: "roleBased",
    roles: ["admin" , "student" , "tutor"],
    protected:false,
  },

  {
    path: "/admin/reports",
    component: lazy(() => import("./views/Admin/Reports.jsx")),
    layout: "roleBased",
    roles: ["admin"],
    protected: true,
  },
  {
    path: "/admin/settings",
    component: lazy(() => import("./views/Admin/SettingsAdmin.jsx")),
    layout: "roleBased",
    roles: ["admin"],
    protected: true,
  },

  {
    path: "/tutor/dashboard",
    component: lazy(() => import("./views/Tutor/TutorDashboard.jsx")),
    layout: "roleBased",
    roles: ["tutor"],
    protected: true,
  },
  {
    path: "/tutor/reports",
    component: lazy(() => import("./views/Tutor/Reports.jsx")),
    layout: "roleBased",
    roles: ["tutor"],
    protected: true,
  },
  {
    path: "/tutor/teams",
    component: lazy(() => import("./views/Tutor/Teams.jsx")),
    layout: "roleBased",
    roles: ["tutor"],
    protected: true,
  },
  {
    path: "/psc/events",
    component: lazy(() => import("./views/Tutor/Events.jsx")),
    layout: "roleBased",
    roles: ["tutor" , "student"],
    protected: true,
  },

  {
    path: "/student/dashboard",
    component: lazy(() => import("./views/Student/StudentDashboard.jsx")),
    layout: "roleBased",
    roles: ["student"],
    protected: true,
  },
];

export default routes;
