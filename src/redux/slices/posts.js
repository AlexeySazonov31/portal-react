import axios from "../../axios.js";
import { createPostsSlice } from "./createPostsSlice.js";

// export const fetchPosts = 

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

const postsSlice = createPostsSlice({
    name: "posts",
    initialState,
    reducers: (create) => ({
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
        )
    }),

    //  create.: {
    //     [fetchPosts.pending]: (state) => {
    //         state.posts.items = [];
    //         state.posts.status = "loading";
    //     },
    //     [fetchPosts.fulfilled]: (state, action) => {
    //         state.posts.items = action.payload;
    //         state.posts.status = "loaded";
    //     },
    //     [fetchPosts.rejected]: (state) => {
    //         state.posts.items = [];
    //         state.posts.status = "error";
    //     },
    // },
})

export const postsReducer = postsSlice.reducer;
export const { fetchPosts } = postsSlice.actions;