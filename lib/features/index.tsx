import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import rootReducer from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDM) =>
    getDM({
      serializableCheck: {
        // ignore the non-serializable File objects in thunk args
        ignoredActionPaths: ['meta.arg.files'],
        ignoredActions: [
          'productContent/create/pending',
          'productContent/create/fulfilled',
          'productContent/create/rejected'
        ],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export type RootState = ReturnType<typeof store.getState>;
export default store;