import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface ConnectingAstrologer {
  id: string;
  name: string;
}

interface ChatUIState {
  connectingAstrologer: ConnectingAstrologer | null; 
}

const initialState: ChatUIState = {
  connectingAstrologer: null
};

export const chatSlice = createSlice({
  name: 'chatUI',
  initialState,
  reducers: {
    setConnectingAstrologer: (
      state,
      action: PayloadAction<ConnectingAstrologer>
    ) => {
      state.connectingAstrologer = action.payload;
    },
    clearConnectingAstrologer: (state) => {
      state.connectingAstrologer = null;
    },
  },
});

export const { setConnectingAstrologer, clearConnectingAstrologer } = chatSlice.actions;

export const selectConnectingAstrologer = (state: RootState) =>
  state.chatUI.connectingAstrologer;

export default chatSlice.reducer;
