import AdminLayout from "./AdminLayout";
import TutorLayout from "./TutorLayout";
import StudentLayout from "./StudentLayout";

const LayoutSelector = ({ role, children }) => {
  switch (role) {
    case "admin":
      return <AdminLayout>{children}</AdminLayout>;
    case "tutor":
      return <TutorLayout>{children}</TutorLayout>;
    case "student":
      return <StudentLayout>{children}</StudentLayout>;
    default:
      return <>{children}</>; // fallback
  }
};

export default LayoutSelector;
