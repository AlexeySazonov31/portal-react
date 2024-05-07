import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import {
  fetchPosts,
  fetchTags,
  fetchPopularPosts,
} from "../redux/slices/posts.js";
import { fetchLastComments } from "../redux/slices/comments.js";

export const Home = () => {
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
    if (tabValue === 0) {
      // normal
      dispatch(fetchPosts());
      dispatch(fetchTags());
    } else if (tabValue === 1) {
      // popular
      dispatch(fetchPopularPosts());
      dispatch(fetchTags()); // ??? maybe only popular tags
    }
    dispatch(fetchLastComments());
  }, [tabValue, dispatch]);

  // to add an editing feature

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        aria-label="tabs for sorting posts"
        value={tabValue}
        onChange={handleChangeTab}
      >
        <Tab label="New" />
        <Tab label="Popular" />
      </Tabs>
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
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            add={false}
            items={comments.items}
            isLoading={isCommentsLoading}
          />
        </Grid>
      </Grid>
    </>
  );
};
