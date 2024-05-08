import React from "react";
import { useParams } from "react-router-dom";

import { Post } from "../../components/Post";
import { CommentsBlock } from "../../components/CommentsBlock";
import axios from "../../axios";
import { useDispatch, useSelector } from "react-redux";

import ReactMarkdown from "react-markdown";
import { fetchCommentsByPost } from "../../redux/slices/comments";

export const FullPost = () => {
  const dispatch = useDispatch();

  const { items: comments, status: isCommentsLoading } = useSelector(state => state.comments);
  const { data: userData } = useSelector((state) => state.auth);

  const [data, setData] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { id } = useParams();

  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("Error in receiving the article");
      });
      dispatch(fetchCommentsByPost(id));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={
          data.imageUrl
            ? `${process.env.REACT_APP_API_URI}${data.imageUrl}`
            : ""
        }
        user={data.user}
        time={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={comments.length}
        tags={data.tags}
        isFullPost
        isEditable={userData?._id === data.user._id}
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        add={true}
        items={comments}
        isLoading={isCommentsLoading === "loading"}
      />
    </>
  );
};
