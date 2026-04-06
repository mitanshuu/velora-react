import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import Category from "../Pages/Category";
import Product from "../Pages/Product";
import Report from "../Pages/Report";
import Login from "../Pages/Login";
import NotFound from "../Pages/NotFound";
import Layout from "../Layouts/Layout";
import { ROUTE_PATH } from "./routes";

const isAuthenticated = () => {
  return !!sessionStorage.getItem("token");
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to={ROUTE_PATH.LOGIN} />;
};

const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to={ROUTE_PATH.DASHBOARD} /> : children;
};

const RoutesConfig = () => {
  return (
    <Routes>
      <Route
        path={ROUTE_PATH.LOGIN}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to={ROUTE_PATH.DASHBOARD} />} />
        <Route path={ROUTE_PATH.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTE_PATH.CATEGORY} element={<Category />} />
        <Route path={ROUTE_PATH.PRODUCTS} element={<Product />} />
        <Route path={ROUTE_PATH.REPORT} element={<Report />} />
      </Route>

      <Route
        path="*"
        element={
          <ProtectedRoute>
            <NotFound />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default RoutesConfig;
