import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { type AwarenessUser } from '../types/code/awareness';

export interface AwarenessState {
  clientId: number;
  awareness: AwarenessUser;
}

export const counterSlice = createSlice({
  name: 'awareness',
  initialState: [] as AwarenessState[],
  reducers: {
    setAwareness: (_state, action: PayloadAction<AwarenessState[]>) => {
      return action.payload;
    },
  },
});

export const { setAwareness } = counterSlice.actions;

export const selectAwareness = (state: RootState): AwarenessState[] | undefined => state.awareness;

export default counterSlice.reducer;
