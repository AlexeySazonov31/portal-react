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
        // fetchPosts: create.asyncThunk( "posts/fetchPosts", async () => {
        fetchPosts: create.asyncThunk( async () => {
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
        fetchTags: create.asyncThunk( async () => {
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
    )
    }),
})

export const postsReducer = postsSlice.reducer;
export const { fetchPosts, fetchTags } = postsSlice.actions;