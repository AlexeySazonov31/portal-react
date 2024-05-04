import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { nanoid } from "nanoid";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { useForm } from "react-hook-form";

import styles from "./Login.module.scss";

import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";
import axios from "../../axios";

export const Registration = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: "Ben Noward",
      email: "testtt@test.com",
      password: "1234567",
    },
  });

  const [image, setImage] = React.useState({
    file: null,
    imageUrlObj: null,
    imageUrl: "",
  });

  const inputFileRef = React.useRef(null);

  const handleChangeFile = (event) => {
    try {
      if ("files" in event.target && event.target.files.length > 0) {
        const file = event.target.files[0];
        const newNameFile = file.name.replace(
          /.+(\.[a-z]+)$/,
          "avatar-image-" + nanoid(8) + "$1"
        );
        const newFile = new File([file], newNameFile, {
          type: file.type,
          lastModified: file.lastModified,
        });
        setImage({
          imageUrl: "/uploads/avatars/" + newFile.name,
          imageUrlObj: URL.createObjectURL(newFile),
          file: newFile,
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
    setImage({
      file: null,
      imageUrlObj: null,
      imageUrl: "",
    });
  };

  const onSubmit = async (values) => {
    try {
      // upload image
      if (image.file) {
        const formData = new FormData();
        const file = image.file;
        formData.append("image", file);
        await axios.post("/upload/avatar", formData);
      }
      values = { ...values, avatarUrl: image.imageUrl ? image.imageUrl : "" };
      const data = await dispatch(fetchRegister(values));

      if (!data.payload) {
        throw new Error(
          `Failed to register new Account. ${data.error.message ?? ""}`
        );
      }
      if (Object.hasOwn(data.payload.data, "token")) {
        window.localStorage.setItem("token", data.payload.data.token);
      }
    } catch (error) {
      console.warn(error);
      alert("Error registration, try again!");
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Create account
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.avatar}>
          <Avatar
            onClick={() => inputFileRef.current.click()}
            sx={{ width: 100, height: 100 }}
            src={image.imageUrlObj || ""}
            className={styles.avatar.avatarBackground}
          />
          {image.imageUrlObj && (
            <IconButton
              sx={{
                position: "absolute",
                ml: "160px",
              }}
              aria-label="delete"
              onClick={onClickRemoveImage}
            >
              <DeleteIcon />
            </IconButton>
          )}
          <input
            ref={inputFileRef}
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={handleChangeFile}
            hidden
          />
        </div>
        <TextField
          className={styles.field}
          label="Full Name"
          fullWidth
          type="text"
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register("fullName", { required: "Input your full name" })}
        />
        <TextField
          className={styles.field}
          label="E-Mail"
          fullWidth
          type="email"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", { required: "Input email" })}
        />
        <TextField
          className={styles.field}
          label="Password"
          fullWidth
          type="password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", { required: "Input password" })}
        />
        <Button
          disabled={!isValid}
          size="large"
          variant="contained"
          type="submit"
          fullWidth
        >
          Register
        </Button>
      </form>
    </Paper>
  );
};
