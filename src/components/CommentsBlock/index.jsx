import React from "react";
import { useParams } from "react-router-dom";

import { SideBlock } from "../SideBlock";
import { UserInfo } from "../UserInfo";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import styles from "./CommentsBlock.module.scss";

import { selectIsAuth } from "../../redux/slices/auth";

import { useDispatch, useSelector } from "react-redux";
import { fetchCommentsByPost, fetchCreateCommentForPost, fetchRemoveComment } from "../../redux/slices/comments";

export const CommentsBlock = ({ items, isLoading = true, add }) => {
  const dispatch = useDispatch();

  const { data: userData } = useSelector((state) => state.auth);

  const { id } = useParams();

  const isAuth = useSelector(selectIsAuth);

  const [comment, setComment] = React.useState("");

  const onSubmit = async () => {
    try {
      if (isAuth && comment.length > 0) {
        const fields = {
          text: comment,
        };
        dispatch(fetchCreateCommentForPost({ id, fields }));
        setComment("");
      } else {
        alert("To leave a comment, you need to log in!");
      }
    } catch (error) {
      console.warn(error);
      alert("Error post comment, please try again!");
    }
  };

  const onClickRemove = async (tagId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
        try {
            dispatch(fetchRemoveComment(tagId));
        } catch (error) {
            console.warn(error);
            dispatch(fetchCommentsByPost(id));
            alert("Couldn't delete this comment, please try again!");
        }
      }
  };

  return (
    <SideBlock title="Comments">
      <List>
        {(isLoading ? [...Array(5)] : items).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start" className={styles.listItem}>
              {(!isLoading && userData._id === obj.user._id) && (
                <div className={styles.editButtons}>
                  <IconButton onClick={() => onClickRemove(obj._id)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </div>
              )}
              {isLoading ? (
                <>
                  <ListItemAvatar>
                    <Skeleton variant="circular" width={40} height={40} />
                  </ListItemAvatar>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Skeleton variant="text" height={25} width={120} />
                    <Skeleton variant="text" height={18} width={230} />
                  </div>
                </>
              ) : (
                <>
                  <UserInfo
                    {...obj.user}
                    time={obj.updatedAt}
                    comment={obj.text}
                  />
                </>
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
            src={
              userData?.avatarUrl
                ? process.env.REACT_APP_API_URI + userData.avatarUrl
                : ""
            }
          />
          <div className={styles.form}>
            <TextField
              label="Write a comment"
              variant="outlined"
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={!isAuth}
            />
            <Button variant="contained" disabled={!isAuth} onClick={onSubmit}>
              Send
            </Button>
          </div>
        </div>
      )}
    </SideBlock>
  );
};
