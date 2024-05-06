import axios from "../../axios.js";
import { createAppSlice } from "../createAppSlice.js";

const initialState = {
    posts: {
        items: [],
        status: "loading",
    },
    tags: {
        items: [],
        status: "loading",
    },
};

const postsSlice = createAppSlice({
    name: "posts",
    initialState,
    reducers: (create) => ({
        fetchPosts: create.asyncThunk(async () => {
            const res = await axios.get("/posts");
            return res;
        },
            {
                pending: (state) => {
                    state.posts.items = [];
                    state.posts.status = "loading";
                },
                fulfilled: (state, action) => {
                    state.posts.items = action.payload.data;
                    state.posts.status = "loaded";
                },
                rejected: (state) => {
                    state.posts.items = [];
                    state.posts.status = "error";
                },
            }
        ),
        fetchPostsByTag: create.asyncThunk(async (tag) => {
            const res = await axios.get(`/posts-by-tag/${tag}`);
            return res;
        },
            {
                pending: (state) => {
                    state.posts.items = [];
                    state.posts.status = "loading";
                },
                fulfilled: (state, action) => {
                    state.posts.items = action.payload.data;
                    state.posts.status = "loaded";
                },
                rejected: (state) => {
                    state.posts.items = [];
                    state.posts.status = "error";
                },
            }
        ),
        fetchPopularPosts: create.asyncThunk(async () => {
            const res = await axios.get("/posts/popular");
            return res;
        },
            {
                pending: (state) => {
                    state.posts.items = [];
                    state.posts.status = "loading";
                },
                fulfilled: (state, action) => {
                    state.posts.items = action.payload.data;
                    state.posts.status = "loaded";
                },
                rejected: (state) => {
                    state.posts.items = [];
                    state.posts.status = "error";
                },
            }
        ),
        fetchTags: create.asyncThunk(async () => {
            const res = await axios.get("/tags");
            return res;
        },
            {
                pending: (state) => {
                    state.tags.items = [];
                    state.tags.status = "loading";
                },
                fulfilled: (state, action) => {
                    state.tags.items = action.payload.data;
                    state.tags.status = "loaded";
                },
                rejected: (state) => {
                    state.tags.items = [];
                    state.tags.status = "error";
                },
            }
        ),
        fetchRemovePost: create.asyncThunk(async (id) => {
            await axios.delete(`/posts/${id}`);
        },
            {
                pending: (state, action) => {
                    state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg);
                },
            },
        ),
        clearPosts: (state) => {
            state.posts = {
                items: [],
                status: "loading",
            };
        }
    }),
})

export const postsReducer = postsSlice.reducer;
export const { fetchPosts, fetchPopularPosts, fetchPostsByTag, fetchTags, fetchRemovePost, clearPosts } = postsSlice.actions;