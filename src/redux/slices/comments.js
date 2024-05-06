import axios from "../../axios.js";
import { createAppSlice } from "../createAppSlice.js";

const initialState = {
    items: [],
    status: "loading",
};

const commentsSlice = createAppSlice({
    name: "comments",
    initialState,
    reducers: (create) => ({
        fetchCommentsByPost: create.asyncThunk(async (id) => {
            const res = await axios.get(`/comments/${id}`);
            return res;
        },
            {
                pending: (state) => {
                    state.items = [];
                    state.status = "loading";
                },
                fulfilled: (state, action) => {
                    state.items = action.payload.data;
                    state.status = "loaded";
                },
                rejected: (state) => {
                    state.items = [];
                    state.status = "error";
                },
            }
        ),
        fetchCreateCommentForPost: create.asyncThunk(async ({ id, fields }) => {
            const res = await axios.post(`/comments/${id}`, fields);
            return res;
        },
            {
                pending: (state) => {
                    state.items = [];
                    state.status = "loading";
                },
                fulfilled: (state, action) => {
                    state.items = action.payload.data;
                    state.status = "loaded";
                },
                rejected: (state) => {
                    state.items = [];
                    state.status = "error";
                },
            }
        ),
        fetchRemoveComment: create.asyncThunk(async (tagId) => {
            const res = await axios.delete(`/comments/${tagId}`);
            return res;
        },
            {
                pending: (state) => {
                    state.items = [];
                    state.status = "loading";
                },
                fulfilled: (state, action) => {
                    state.items = action.payload.data;
                    state.status = "loaded";
                },
                rejected: (state) => {
                    state.items = [];
                    state.status = "error";
                },
            }
        ),
    }),
})

export const commentsReducer = commentsSlice.reducer;
export const { fetchCommentsByPost, fetchCreateCommentForPost, fetchRemoveComment } = commentsSlice.actions;