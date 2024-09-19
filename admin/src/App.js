// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Snackbar, Alert } from "@mui/material";
import News from "./pages/News/News";
import NoPage from "./pages/NoPage";
import Auth from "./pages/Auth";
import AuthSuccess from "./components/AuthSuccess";
import Layout from "./pages/Layout";
import PrivateRoute from "./components/PrivateRoute";
import { clearMessage } from "../src/features/messageSlice";

const App = () => {
  const dispatch = useDispatch();
  const { message, severity } = useSelector((state) => state.message);

  const handleSnackbarClose = () => {
    dispatch(clearMessage()); // Clear the message after the Snackbar closes
  };

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

      {/* Global Snackbar for Messages */}
      <Snackbar
        open={!!message} // Open Snackbar if there's a message
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        {message && (
          <Alert severity={severity} onClose={handleSnackbarClose}>
            {message}
          </Alert>
        )}
      </Snackbar>
    </BrowserRouter>
  );
};

export default App;
