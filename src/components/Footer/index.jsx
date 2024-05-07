import React from "react";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";
import { Button, Typography } from "@mui/material";

import styles from "./Footer.module.scss";

export const Footer = () => {
  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <div>
            <Link to="/" style={{
                textDecoration: "none",
            }}>
              <div className={styles.logo}>SAS BLOG</div>
            </Link>
            <Link to="/posts/create">
              <Button variant="outlined" sx={{
                width: "100%",
                mt: 1,
              }}>Write post</Button>
            </Link>
          </div>

          <Typography className={styles.text} variant="p">
            Explore my Portal React App! <br />
            Harnessing the power of React, Redux, and Material-UI, backend by
            Express and MongoDB, with JWT authentication and Multer for
            file management.
          </Typography>
        </div>
      </Container>
    </div>
  );
};
