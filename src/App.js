import React from "react";
import Container from "@mui/material/Container";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login, PostsByTag } from "./pages";
import { fetchAuthMe } from "./redux/slices/auth";



function App() {

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch])

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/posts/create" element={<AddPost />} />
          <Route path="/tag/:tag" element={<PostsByTag />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;