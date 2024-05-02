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
        fetchLogin: create.asyncThunk(async (params) => {
            const res = await axios.post("/auth/login", params);
            return res;
        },
            {
                pending: (state) => {
                    state.data = null;
                    state.status = "loading";
                },
                fulfilled: (state, action) => {
                    state.data = action.payload.data;
                    state.status = "loaded";
                },
                rejected: (state) => {
                    state.data = null;
                    state.status = "error";
                },
            }
        ),
        fetchAuthMe: create.asyncThunk(async () => {
            const res = await axios.get("/auth/me");
            return res;
        },
            {
                pending: (state) => {
                    state.data = null;
                    state.status = "loading";
                },
                fulfilled: (state, action) => {
                    state.data = action.payload.data;
                    state.status = "loaded";
                },
                rejected: (state) => {
                    state.data = null;
                    state.status = "error";
                },
            }
        ),
        logout: (state) => {
            state.data = null;
        }
    }),
});

export const selectIsAuth = (state) => Boolean(state.auth.data);
export const authReducer = authSlice.reducer;
export const { fetchLogin, fetchAuthMe, logout } = authSlice.actions;
