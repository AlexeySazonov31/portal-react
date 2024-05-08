import React from "react";
import { Link } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import styles from "./NotFound404.module.scss";

export const NotFound404 = () => {
  return (
    <div className={styles.root}>
        <Typography variant="h1" sx={{
            mb: 5,
        }} className={styles.title}>404: Page Not Found</Typography>
        <Link to="/"><Button size="large" variant="contained" sx={{
            px: "40px",
        }}>Home Page</Button></Link>
    </div>
  );
};
