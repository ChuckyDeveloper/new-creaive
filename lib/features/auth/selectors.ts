import { RootState } from "../rootReducer";

// selectors
export const selectAuth = (s: RootState) => s.auth;
export const selectUser = (s: RootState) => s.auth.user;
export const selectIsAuthed = (s: RootState) => s.auth.status === 'authenticated';
