import type { RouteObject } from "react-router-dom";
import { AppLayout } from "@/components/layouts/AppLayout";
import { ChatPage } from "@/pages/chat/ChatPage";
import { AuthGuard } from "@/routes/guards/AuthGuard";

export const appRoutes: RouteObject[] = [
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/chat", element: <ChatPage /> },
        ],
      },
    ],
  },
];
