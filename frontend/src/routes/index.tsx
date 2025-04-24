import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  authenticationRoutePaths,
  protectedRoutePaths,
  publicRoutePaths,
} from "./common/routes";
import AppLayout from "@/layout/app-layout";
import BaseLayout from "@/layout/base-layout";
import AuthRoute from "./authRoute";
import ProtectedRoute from "./protectedRoute";
import UserEventsPage from "@/pages/external_page/user-events";
import UserSingleEventPage from "@/pages/external_page/user-single-event";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<AuthRoute />}>
          <Route element={<BaseLayout />}>
            {authenticationRoutePaths.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {protectedRoutePaths.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Route>

        {/* Public External Pages (Dynamic Routes) */}
        <Route path="/" element={<BaseLayout />}>
          <Route path=":username" element={<UserEventsPage />} />
          <Route path=":username/:slug" element={<UserSingleEventPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<>404 Not Found</>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
