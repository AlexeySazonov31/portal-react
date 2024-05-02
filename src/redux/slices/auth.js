import axios from "../../axios.js";
import { createAppSlice } from "../createAppSlice.js";

const initialState = {
    data: null,
    status: "loading",
};

const authSlice = createAppSlice({
    name: "auth",
    initialState,
    reducers: (create) => ({
        fetchUserData: create.asyncThunk(async (params) => {
            const res = await axios.post("/auth/login", params);
            return res;
        },
            {
                pending: (state) => {
                    state.data = {};
                    state.status = "loading";
                },
                fulfilled: (state, action) => {
                    state.data = action.payload.data;
                    state.status = "loaded";
                },
                rejected: (state) => {
                    state.data = {};
                    state.status = "error";
                },
            }
        ),
    }),
});

export const authReducer = authSlice.reducer;
export const { fetchUserData } = authSlice.actions;