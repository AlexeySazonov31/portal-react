import React from "react";
import { useParams } from "react-router-dom";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { Post } from "../../components/Post";
import axios from "../../axios";

export const PostsByTag = () => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const { id } = useParams();

//   React.useEffect(() => {
//     axios
//       .get(`/posts/${id}`)
//       .then((res) => {
//         setData(res.data);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         console.warn(err);
//         alert("Error in receiving the article");
//       });
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
    {/* <Tabs
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
              isEditable={userData?._id === obj.user._id}
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
    </Grid> */}
  </>
  );
};
