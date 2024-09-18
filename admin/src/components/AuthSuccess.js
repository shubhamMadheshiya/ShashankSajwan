import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken } from "../features/auth/authSlice";

const AuthSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      // Store token in Redux store
      dispatch(setToken(token));
      // Redirect to the news page or any other protected route
      navigate("/news");
    } else {
      // Handle error or redirect to login if no token is found
      navigate("/");
    }
  }, [dispatch, navigate]);

  return <div>Logging you in...</div>;
};

export default AuthSuccess;
