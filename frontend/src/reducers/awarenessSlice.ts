import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { type AwarenessUser } from '../types/code/awareness';
export interface AwarenessState {
  awareness: AwarenessUser | null;
}

const initialState: AwarenessState = {
  awareness: null,
};

export const counterSlice = createSlice({
  name: 'awareness',
  initialState,
  reducers: {
    setAwareness: (state, action: PayloadAction<AwarenessUser>) => {
      state.awareness = action.payload;
    },
  },
});

export const { setAwareness } = counterSlice.actions;

export const selectAwareness = (state: RootState): AwarenessUser | null => state.awareness.awareness;

export default counterSlice.reducer;
