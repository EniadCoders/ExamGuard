import { createBrowserRouter } from "react-router";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { SignUpPage } from "@/features/auth/pages/SignUpPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";
import { StudentDashboard } from "@/features/student/pages/StudentDashboardPage";
import { ExamInterface } from "@/features/exam/pages/ExamInterfacePage";
import { AdminDashboard } from "@/features/admin/pages/AdminDashboardPage";
import { TeacherProfilePage } from "@/features/teacher/pages/TeacherProfilePage";

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
    path: "/sign-up",
    Component: SignUpPage,
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
