import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPage_Monochrome";
import { StudentDashboard } from "./pages/StudentDashboard";
import { ExamInterface } from "./pages/ExamInterface_Monochrome";
import { AdminDashboard } from "./pages/AdminDashboard_Monochrome";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage_Monochrome";
import { ResetPasswordPage } from "./pages/ResetPasswordPage_Monochrome";
import { TeacherProfilePage } from "./pages/TeacherProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/forgot-password",
    Component: ForgotPasswordPage,
  },
  {
    path: "/reset-password",
    Component: ResetPasswordPage,
  },
  {
    path: "/student",
    Component: StudentDashboard,
  },
  {
    path: "/exam/:examId",
    Component: ExamInterface,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/admin/profile",
    Component: TeacherProfilePage,
  },
]);
