import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./slices/posts";
import { authReducer } from "./slices/auth";
import { commentsReducer } from "./slices/comments";

const reducer = combineReducers({
  posts: postsReducer,
  auth: authReducer,
  comments: commentsReducer,
});

export const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "auth/fetchAuthMe/fulfilled", 
          "posts/fetchPosts/fulfilled", 
          "posts/fetchTags/fulfilled",
          "posts/fetchPopularPosts/fulfilled",
          "comments/fetchCommentsByPost/fulfilled",
          "comments/fetchCreateCommentForPost/fulfilled",
        ],
      },
    }),

});