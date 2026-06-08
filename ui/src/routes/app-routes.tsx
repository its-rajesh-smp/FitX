import type { RouteObject } from "react-router-dom";
import { AppLayout } from "@/components/layouts/AppLayout";
import { ChatPage } from "@/pages/chat/ChatPage";
import { PlanPage } from "@/pages/program/PlanPage";
import { WorkoutPage } from "@/pages/program/WorkoutPage";
import { AuthGuard } from "@/routes/guards/AuthGuard";

export const appRoutes: RouteObject[] = [
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/plan", element: <PlanPage /> },
          { path: "/plan/:dayId", element: <WorkoutPage /> },
          { path: "/chat", element: <ChatPage /> },
        ],
      },
    ],
  },
];
