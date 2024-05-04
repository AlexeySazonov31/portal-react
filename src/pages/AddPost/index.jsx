import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams, Link } from "react-router-dom";
import { nanoid } from "nanoid";

import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Item from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";

import { selectIsAuth } from "../../redux/slices/auth";
import axios from "../../axios";

// without post text (the main text of the article), because SimpleMDE uses Callback
const initialPostInfo = {
  title: "",
  tags: "",
  image: {
    file: null,
    imageUrlObj: null,
    imageUrl: "",
  },
};

export const AddPost = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);

  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);

  const [isLoading, setIsLoading] = React.useState(false); // for edit exist post

  // the main text of the article is separate, since we use SimpleMDE with useCallback
  const [postInfo, setPostInfo] = React.useState(initialPostInfo);
  const [textPost, setTextPost] = React.useState("");

  // for updating exist post
  React.useEffect(() => {
    if (id) {
      setIsLoading(true);
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setPostInfo({
            title: data.title,
            tags: data.tags.length > 0 ? data.tags.join(", ") : "",
            image: {
              ...postInfo.image,
              imageUrl: data.imageUrl ? data.imageUrl : "",
            },
          });
          setTextPost(data.text);
          setIsLoading(false);
        })
        .catch((err) => {
          console.warn(err);
          setIsLoading(false);
          alert("Error receiving the article");
        });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostInfo({
      ...postInfo,
      [name]: value,
    });
  };

  const handleChangeFile = (event) => {
    try {
      if ("files" in event.target && event.target.files.length > 0) {
        const file = event.target.files[0];
        const newNameFile = file.name.replace(
          /.+(\.[a-z]+)$/,
          "post-image-" + nanoid(8) + "$1"
        );
        const newFile = new File([file], newNameFile, {
          type: file.type,
          lastModified: file.lastModified,
        });
        setPostInfo({
          ...postInfo,
          image: {
            imageUrl: "/uploads/posts/" + newFile.name,
            imageUrlObj: URL.createObjectURL(newFile),
            file: newFile,
          },
        });
      } else {
        throw new Error("Couldn't upload this file, please try again");
      }
    } catch (error) {
      console.warn(error);
      alert("Error uploading the file, please try again!");
    }
  };

  const onClickRemoveImage = () => {
    setPostInfo({
      ...postInfo,
      image: {
        file: null,
        imageUrlObj: null,
        imageUrl: "",
      },
    });
  };

  // change for input main post text
  const onChangeText = React.useCallback((value) => {
    setTextPost(value);
  }, []);

  // publish Post
  const onSubmit = async () => {
    try {
      // upload image
      if (postInfo.image.file) {
        const formData = new FormData();
        const file = postInfo.image.file;
        formData.append("image", file);
        await axios.post("/upload/post", formData);
      }
      const fields = {
        title: postInfo.title,
        text: textPost,
        imageUrl: postInfo.image.imageUrl,
        tags:
          postInfo.tags.length > 0
            ? postInfo.tags.replace(/(,\s)|\s|,/g, "<%>").split("<%>")
            : [],
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


  // options for SimpleMDE - input main post text
  const delay = 1000;
  const autosavedValue = localStorage.getItem(`smde_demo`) || "Initial value";
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      uniqueId: "textPostForEasyMDE",
      maxHeight: "350px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        uniqueId: "demo",
        delay,
      },
    }),
    [delay]
  );

  const inputFileRef = React.useRef(null);

  // redirect for an unauthorized user
  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {isEditing && isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", height: "70vh", alignItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
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
            {postInfo.image.imageUrlObj || postInfo.image.imageUrl ? (
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
            ) : (
              <></>
            )}
          </Stack>
          {postInfo.image.imageUrlObj || postInfo.image.imageUrl ? (
            <img
              className={styles.image}
              src={
                postInfo.image.imageUrlObj ||
                process.env.REACT_APP_API_URI + postInfo.image.imageUrl
              }
              alt="preview for post"
            />
          ) : (
            <></>
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
            <Link to="/">
              <Button size="large">Cancel</Button>
            </Link>
          </div>
        </Paper>
      )}
    </>
  );
};
