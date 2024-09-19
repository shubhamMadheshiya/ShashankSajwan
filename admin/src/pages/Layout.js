import React from "react";
import Header from "../components/Header";
import { Outlet, Link } from "react-router-dom";
import { Container } from "@mui/material";

const Layout = () => {
  return (
    <>
      <Header />
      <Container maxWidth="lg"  sx={{py:4}}>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
