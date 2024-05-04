import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./slices/posts";
import { authReducer } from "./slices/auth";

const reducer = combineReducers({
  posts: postsReducer,
  auth: authReducer
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
          "posts/fetchPopularPosts/fulfilled"
        ],
      },
    }),

});