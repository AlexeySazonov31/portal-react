import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { fetchPosts, fetchTags, fetchPopularPosts } from "../redux/slices/posts.js";
import { fetchAuthMe } from "../redux/slices/auth.js";

export const Home = () => {
  const dispatch = useDispatch();

  const {data: userData} = useSelector((state) => state.auth);

  const { posts, tags } = useSelector((state) => state.posts);

  const [tabValue, setTabValue] = React.useState(0);

  const handleChangeTab = (e, newValue) => {
    setTabValue(newValue);
  };


  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  React.useEffect(() => {
    if( tabValue === 0 ){ // normal
      dispatch(fetchPosts());
      dispatch(fetchTags());
    } else if (tabValue === 1){ // popular
      dispatch(fetchPopularPosts());
      dispatch(fetchTags());
    }
  }, [tabValue]);

  // to add an editing feature
  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        aria-label="tabs for sorting posts"
        value={tabValue} onChange={handleChangeTab}
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
                imageUrl={ obj.imageUrl ? `${process.env.REACT_APP_API_URI}${obj.imageUrl}` : ""}
                user={obj.user}
                updatedAt={obj.updatedAt}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={userData?.userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock
            items={tags.items}
            isLoading={isTagsLoading}
          />
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
    </>
  );
};
