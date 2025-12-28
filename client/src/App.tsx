import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./utils/ProtectedRoute";

const App: React.FC = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard onLogout={logout} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
