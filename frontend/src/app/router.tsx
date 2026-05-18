import { createBrowserRouter } from "react-router";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { SignUpPage } from "@/features/auth/pages/SignUpPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { StudentDashboard } from "@/features/student/pages/StudentDashboardPage";
import { ExamInterface } from "@/features/exam/pages/ExamInterfacePage";
import { TeacherDashboard } from "@/features/teacher/pages/TeacherDashboardPage";
import { TeacherProfilePage } from "@/features/teacher/pages/TeacherProfilePage";
import { SuperAdminPage } from "@/features/superadmin/pages/SuperAdminPage";

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
    element: (
      <ProtectedRoute role="student">
        <StudentDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/exam/:examId",
    element: (
      <ProtectedRoute>
        <ExamInterface />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher",
    element: (
      <ProtectedRoute role="teacher">
        <TeacherDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/profile",
    element: (
      <ProtectedRoute role="teacher">
        <TeacherProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/superadmin",
    element: (
      <ProtectedRoute role="superadmin">
        <SuperAdminPage />
      </ProtectedRoute>
    ),
  },
]);
