import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "@/pages/ErrorPage";
import { appRoutes } from "@/routes/app-routes";
import { authRoutes } from "@/routes/auth-routes";
import { publicRoutes } from "@/routes/public-routes";

export const router = createBrowserRouter([
  ...publicRoutes,
  ...authRoutes,
  ...appRoutes,
  { path: "*", element: <ErrorPage /> },
]);
