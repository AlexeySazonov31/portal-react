import { buildCreateSlice, asyncThunkCreator } from '@reduxjs/toolkit'

export const createPostsSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
})