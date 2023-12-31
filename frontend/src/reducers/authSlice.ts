import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { type User } from '../types/users/users';

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

export const counterSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logOut: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logOut } = counterSlice.actions;

export const selectUser = (state: RootState): User | null => state.auth.user;
export const selectIsLoggedIn = (state: RootState): boolean => state.auth.user !== null;
export const selectIsAdmin = (state: RootState): boolean =>
  state.auth.user !== null && state.auth.user.role === 'ADMIN';

export default counterSlice.reducer;
