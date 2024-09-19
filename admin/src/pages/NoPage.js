import React from "react";
import { Box, Stack } from "@mui/material";
import { ReactComponent as MyIcon } from "../assets/404.svg";

const NoPage = () => {
  return (
    <Stack
      sx={{
        height: "80vh", // Ensures full viewport height
        width: "100%", // Ensures full width
        justifyContent: "center", // Centers content vertically
        alignItems: "center", // Centers content horizontally
      }}
    >
      <MyIcon width={340} height={340} />
    </Stack>
  );
};

export default NoPage;
