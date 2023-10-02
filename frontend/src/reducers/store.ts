import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import awarenessReducer from './awarenessSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    awareness: awarenessReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
