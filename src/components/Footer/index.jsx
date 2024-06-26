import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import { Button, Typography } from "@mui/material";

import styles from "./Footer.module.scss";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";

export const Footer = () => {
  const isAuth = useSelector(selectIsAuth);
  const navigate = useNavigate();

  const handleWritePost = () => {
    console.log(isAuth);
    if( isAuth ){
      navigate("/posts/create");
    } else {
      alert("To write a post, you need to be logged in!");
    }
  }
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
              <Button variant="outlined" sx={{
                width: "100%",
                mt: 1,
              }} onClick={handleWritePost}>Write post</Button>
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
