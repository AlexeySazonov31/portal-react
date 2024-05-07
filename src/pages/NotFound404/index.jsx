import React from "react";
import { Link } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export const NotFound404 = () => {
  return (
    <div style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        minHeight: "60vh",
        justifyContent: 'center'
    }}>
        <Typography variant="h2" sx={{
            mb: 5,
        }}>404: Page Not Found</Typography>
        <Link to="/"><Button size="large" variant="contained" sx={{
            px: "40px",
        }}>Home Page</Button></Link>
    </div>
  );
};
