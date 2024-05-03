import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

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

export const AddPost = () => {
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);

  const [isLoading, setIsLoading] = React.useState(false);
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState([]);
  const [imageUrl, setImageUrl] = React.useState("");
  const inputFileRef = React.useRef(null);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (error) {
      console.warn(error);
      alert("Error uploading the file!");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
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
        title,
        text,
      };
      if(imageUrl){
        fields["imageUrl"] = imageUrl;
      }
      if(tags.length > 0){
        fields["tags"] = tags.replace(/(,\s)|\s|,/g,"<%>").split("<%>");
      }

      const { data } = await axios.post("/posts", fields);
      const id = data._id;

      navigate(`/posts/${id}`);
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
        {imageUrl && (
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
            <Item>
              <img
                className={styles.image}
                src={`http://localhost:4444${imageUrl}`}
                alt="Uploaded"
              />
            </Item>
          </>
        )}
      </Stack>

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        fullWidth
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          Publish
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};
