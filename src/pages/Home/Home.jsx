import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Post } from "../../components/Post";
import { TagsBlock } from "../../components/TagsBlock.jsx";
import { CommentsBlock } from "../../components/CommentsBlock";

import {
  fetchPosts,
  fetchTags,
  fetchPopularPosts,
} from "../../redux/slices/posts.js";
import { fetchLastComments } from "../../redux/slices/comments.js";
import { fetchPostsByTag } from "../../redux/slices/posts";

export const Home = ({ postsByTag = false }) => {
  const { tag } = useParams();

  const dispatch = useDispatch();

  const { data: userData } = useSelector((state) => state.auth);

  const { posts, tags } = useSelector((state) => state.posts);
  const comments = useSelector((state) => state.comments);

  const [tabValue, setTabValue] = React.useState(0);

  const handleChangeTab = (e, newValue) => {
    setTabValue(newValue);
  };

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";
  const isCommentsLoading = comments.status === "loading";

  React.useEffect(() => {
    // for posts by tag, else tags for typical posts
    if (tag && postsByTag) {
      // dispatch(clearPosts());
      dispatch(fetchPostsByTag(tag));
    } else {
      dispatch(fetchTags());
    }

    // typical posts: normal / popular
    if (tabValue === 0 && !tag) {
      dispatch(fetchPosts());
    } else if (tabValue === 1 && !tag) {
      dispatch(fetchPopularPosts());
    }

    dispatch(fetchLastComments());
  }, [dispatch, tabValue, tag]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {postsByTag && tag && !isPostsLoading && posts.items.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "100px",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: "35px",
              fontWeight: "bold",
              mb: 4,
            }}
          >
            No posts for <span style={{ fontStyle: "italic" }}># {tag}</span>
          </Typography>
          <Link to="/">
            <Button variant="contained">Home Page</Button>
          </Link>
        </div>
      ) : (
        <></>
      )}
      {!tag && !postsByTag && (
        <Tabs
          style={{ marginBottom: 15 }}
          aria-label="tabs for sorting posts"
          value={tabValue}
          onChange={handleChangeTab}
        >
          <Tab label="New" />
          <Tab label="Popular" />
        </Tabs>
      )}
      {tag && postsByTag && posts.items.length !== 0 && (
        <Typography
          variant="h1"
          sx={{
            fontSize: "35px",
            fontWeight: "bold",
            mb: 4,
          }}
        >
          # {tag}
        </Typography>
      )}
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, item) =>
            isPostsLoading ? (
              <Post key={item} isLoading={isPostsLoading} />
            ) : (
              <Post
                id={obj._id}
                key={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl
                    ? `${process.env.REACT_APP_API_URI}${obj.imageUrl}`
                    : ""
                }
                user={obj.user}
                time={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={obj.countComments}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          {!tag && !postsByTag && (
            <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          )}
          {posts.items.length !== 0 && (
            <CommentsBlock
              add={false}
              items={comments.items}
              isLoading={isCommentsLoading}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};
