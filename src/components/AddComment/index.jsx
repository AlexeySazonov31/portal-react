import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

export const AddComment = () => {

  const [comment, setComment] = React.useState("");

  console.log(comment);

  return (
    <>
      <div className={styles.root}>
        <Avatar
          classes={{ root: styles.avatar }}
          src="https://mui.com/static/images/avatar/5.jpg"
        />
        <div className={styles.form}>
          <TextField
            label="Write a comment"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button variant="contained">Send</Button>
        </div>
      </div>
    </>
  );
};