import React from "react";
import Container from "@mui/material/Container";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Footer, Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login, NotFound404 } from "./pages";
import { fetchAuthMe } from "./redux/slices/auth";

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function App() {
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up('md'));

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch])

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{
        minHeight: isMobile ? "50vh" : "82vh",       
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/posts/create" element={<AddPost />} />
          <Route path="/tag/:tag" element={<Home postsByTag={true} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </Container>
      <Footer />
    </>
  );
}

export default App;