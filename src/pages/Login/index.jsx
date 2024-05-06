import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import { useForm } from "react-hook-form";

import styles from "./Login.module.scss";
import { fetchLogin, selectIsAuth } from "../../redux/slices/auth";

export const Login = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "testt@test.com",
      password: "123456",
    },
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchLogin(values));

    if (!data.payload) {
      console.log(data.error);
      return alert(
        `Failed to login, try again. ${data.error.message ?? ""}`
      );
    }

    if (Object.hasOwn(data.payload.data, "token")) {
      window.localStorage.setItem("token", data.payload.data.token);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  } 

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Log in to your account
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          type="email"
          fullWidth
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register("email", { required: "Input email" })}
        />
        <TextField
          className={styles.field}
          label="password"
          error={Boolean(errors.password?.message)}
          fullWidth
          type="password"
          helperText={errors.password?.message}
          {...register("password", { required: "Input password" })}
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Login
        </Button>
      </form>
    </Paper>
  );
};
