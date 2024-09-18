import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import News from "./pages/News/News";
import NoPage from "./pages/NoPage";
import Auth from "./pages/Auth";
import AuthSuccess from "./components/AuthSuccess";
import Layout from "./pages/Layout";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone Auth Route */}
        <Route path="/" element={<Auth />} />
        <Route path="/auth/success" element={<AuthSuccess />} />

        {/* Routes that use Layout */}
        <Route element={<Layout />}>
          <Route
            path="/news"
            element={
              <PrivateRoute>
                <News />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
