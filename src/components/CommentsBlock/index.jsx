import React from "react";
import { useParams } from "react-router-dom";

import { SideBlock } from "../SideBlock";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import styles from "./CommentsBlock.module.scss";

import { selectIsAuth } from "../../redux/slices/auth";

import axios from "../../axios";
import { useSelector } from "react-redux";

// [
//     {
//       user: {
//         fullName: "Вася Пупкин",
//         avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
//       },
//       text: "Это тестовый комментарий 555555",
//       createdAt: "2024-05-06T08:35:54.317+00:00",
//     },
// ]

export const CommentsBlock = ({ items, isLoading = true, add }) => {

  const { data: userData } = useSelector((state) => state.auth);

  const { id } = useParams();


  const isAuth = useSelector(selectIsAuth);

  const [comment, setComment] = React.useState("");

  const onSubmit = async () => {
    try {
    //   const { data } = await axios.patch(`/posts/${id}`, fields);

    } catch (error) {
      console.warn(error);
      alert("Error uploading the file!");
    }
  };

  return (
    <SideBlock title="Comments">
      <List>
        {(isLoading ? [...Array(5)] : items).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar alt={obj.user.fullName} src={obj.user.avatarUrl ? process.env.REACT_APP_API_URI + obj.user.avatarUrl : ""} />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <ListItemText
                  primary={obj.user.fullName}
                  secondary={obj.text}
                />
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>

      {add && (
        <div className={styles.root}>
          <Avatar
            classes={{ root: styles.avatar }}
            src={userData.avatarUrl ? process.env.REACT_APP_API_URI + userData.avatarUrl : ""}
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
      )}
    </SideBlock>
  );
};
