import React from "react";
import { useParams, Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Post } from "../../components/Post";
import { CommentsBlock } from "../../components/CommentsBlock";

import { clearPosts, fetchPostsByTag } from "../../redux/slices/posts";

export const PostsByTag = () => {
  const dispatch = useDispatch();

  const { data: userData } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.posts);

  const { tag } = useParams();

  const isLoading = posts.status === "loading";

  React.useEffect(() => {
    dispatch(clearPosts());
    dispatch(fetchPostsByTag(tag));
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <>
      {!isLoading && posts.items.length === 0 ? (
        <div style={{
          textAlign: "center",
          marginTop: "100px"
        }}>
          <Typography variant="h1" sx={{
            fontSize: "35px",
            fontWeight: "bold",
            mb: 4,
          }}>No posts for <span style={{ fontStyle: "italic" }}># {tag}</span></Typography>
          <Link to="/">
            <Button variant="contained">Home Page</Button>
          </Link>
        </div>
      ) : (
        <Grid container spacing={4}>
          <Grid xs={8} item>
            <Typography variant="h1" sx={{
              fontSize: "35px",
              fontWeight: "bold",
              mb: 4,
            }}># {tag}</Typography>
            {(isLoading ? [...Array(3)] : posts.items).map((obj, item) =>
              isLoading ? (
                <Post key={item} isLoading={isLoading} />
              ) : (
                <Post
                  id={obj._id}
                  key={obj._id}
                  title={obj.title}
                  imageUrl={obj.imageUrl ? `${process.env.REACT_APP_API_URI}${obj.imageUrl}` : ""}
                  user={obj.user}
                  updatedAt={obj.updatedAt}
                  viewsCount={obj.viewsCount}
                  commentsCount={3}
                  tags={obj.tags}
                  isEditable={userData?._id === obj.user._id}
                />
              )
            )}
          </Grid>
          <Grid xs={4} item>
            <CommentsBlock
              items={[
                {
                  user: {
                    fullName: "Вася Пупкин",
                    avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                  },
                  text: "Это тестовый комментарий",
                },
                {
                  user: {
                    fullName: "Иван Иванов",
                    avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                  },
                  text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
                },
              ]}
              isLoading={false}
            />
          </Grid>
        </Grid>
      )}

    </>
  );
};
