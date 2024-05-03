import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import Stack from "@mui/material/Stack";
import Item from "@mui/material/Stack";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";

import { selectIsAuth } from "../../redux/slices/auth";
import axios from "../../axios";

// without post text (the main text of the article), because SimpleMDE uses Callback
const initialPostInfo = {
  title: "",
  imageUrl: "",
  tags: "",
};

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const isEditing = Boolean(id);

  const [isLoading, setIsLoading] = React.useState(false);
  // the main text of the article is separate, since we use SimpleMDE with useCallback
  const [postInfo, setPostInfo] = React.useState(initialPostInfo);
  const [textPost, setTextPost] = React.useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostInfo({
      ...postInfo,
      [name]: value,
    });
  };

  const inputFileRef = React.useRef(null);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setPostInfo({ ...postInfo, imageUrl: data.url });
    } catch (error) {
      console.warn(error);
      alert("Error uploading the file!");
    }
  };

  const onClickRemoveImage = () => {
    setPostInfo({ ...postInfo, imageUrl: "" });
  };

  const onChangeText = React.useCallback((value) => {
    setTextPost(value);
  }, []);

  React.useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setPostInfo({
            title: data.title,
            tags: data.tags.length > 0 ? data.tags.join(", ") : "",
            imageUrl: data.imageUrl ? data.imageUrl : "",
          });
          setTextPost(data.text);
        })
        .catch((err) => {
          console.warn(err);
          alert("Error receiving the article");
        });
    }
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "350px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  const onSubmit = async () => {
    try {
      setIsLoading(true);

      const fields = {
        title: postInfo.title,
        text: textPost,
        imageUrl: postInfo.imageUrl,
        tags: postInfo.tags.length > 0 ? postInfo.tags
        .replace(/(,\s)|\s|,/g, "<%>")
        .split("<%>") : [],
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields) // edit exist post
        : await axios.post("/posts", fields); // publish new post

      const idForRedirect = isEditing ? id : data._id;

      navigate(`/posts/${idForRedirect}`);
    } catch (error) {
      console.warn(error);
      alert("Error uploading the file!");
    }
  };

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Stack
        spacing={{ xs: 1, sm: 2 }}
        sx={{
          mb: 2,
        }}
        justifyContent="space-between"
        direction="row"
        useFlexGap
        flexWrap="wrap"
      >
        <Item>
          <Button
            onClick={() => inputFileRef.current.click()}
            variant="outlined"
          >
            Download the preview
          </Button>
        </Item>
        <input
          ref={inputFileRef}
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={handleChangeFile}
          hidden
        />
        {postInfo.imageUrl && (
          <>
            <Item>
              <Button
                variant="contained"
                color="error"
                onClick={onClickRemoveImage}
              >
                Delete image
              </Button>
            </Item>
          </>
        )}
      </Stack>
      {postInfo.imageUrl && (
        <img
          className={styles.image}
          src={`${process.env.REACT_APP_API_URI}${postInfo.imageUrl}`}
          alt="Uploaded"
        />
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        value={postInfo.title}
        name="title"
        onChange={handleInputChange}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        fullWidth
        name="tags"
        value={postInfo.tags}
        onChange={handleInputChange}
      />
      <SimpleMDE
        className={styles.editor}
        value={textPost}
        onChange={onChangeText}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Save" : "Publish"}
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};
