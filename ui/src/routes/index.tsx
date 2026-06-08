import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layouts/AppLayout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ChatPage } from "@/pages/chat/ChatPage";
import { ErrorPage } from "@/pages/ErrorPage";
import { PlanPage } from "@/pages/program/PlanPage";
import { WorkoutPage } from "@/pages/program/WorkoutPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage />, errorElement: <ErrorPage /> },
  { path: "/register", element: <RegisterPage />, errorElement: <ErrorPage /> },
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/plan" replace /> },
      { path: "/plan", element: <PlanPage /> },
      { path: "/plan/:dayId", element: <WorkoutPage /> },
      { path: "/chat", element: <ChatPage /> },
    ],
  },
]);
