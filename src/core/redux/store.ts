import {configureStore} from '@reduxjs/toolkit';
import walletSlice from '@easyether/core/redux/wallet/wallet.slice';

export const store = configureStore({
  reducer: {
    wallet: walletSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
