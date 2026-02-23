import { createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '.';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

export const fetchMe = createAsyncThunk<User, void, { rejectValue: string }>(
    'auth/fetchMe',
    async (_, { rejectWithValue }) => {
        const res = await fetch(`${API_BASE}/api/v1/auth/me`, { credentials: 'include' });
        if (res.status === 401) throw new Error('unauthorized');
        if (!res.ok) return rejectWithValue('Failed to fetch session');
        return res.json();
    }
);

export const signIn = createAsyncThunk<
    User,
    { identifier: string; password: string; rememberMe?: boolean },
    { rejectValue: string }
>('auth/signIn', async (payload, { rejectWithValue }) => {
    const res = await fetch(`${API_BASE}/api/v1/auth/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        let msg = 'Invalid email/username or password.';
        try {
            const data = await res.json();
            if (res.status !== 401) msg = data?.error || `Sign in failed (${res.status})`;
        } catch {
            /* noop */
        }
        return rejectWithValue(msg);
    }

    const user = await res.json();

    // Signal other tabs to refresh auth state
    try {
        localStorage.setItem('auth_signin', Date.now().toString());
        localStorage.removeItem('auth_signin');
    } catch {
        // Ignore if localStorage is unavailable
    }

    return user;
});

export const signUp = createAsyncThunk<
    User,
    { firstName: string; lastName: string; username: string; email: string; password: string },
    { rejectValue: string }
>('auth/signUp', async (payload, { rejectWithValue }) => {
    const res = await fetch(`${API_BASE}/api/v1/auth/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        let msg = data?.error || `Sign up failed (${res.status})`;
        if (data?.issues) msg = 'Please check your inputs.';
        if (data?.error === 'EMAIL_TAKEN') msg = 'This email is already in use.';
        if (data?.error === 'USERNAME_TAKEN') msg = 'This username is already taken.';
        return rejectWithValue(msg);
    }
    return res.json();
});


export const signOut = createAsyncThunk<void, void, { rejectValue: string }>(
    'auth/signOut',
    async (_, { rejectWithValue }) => {
        const res = await fetch(`${API_BASE}/api/v1/auth/signout`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!res.ok) return rejectWithValue('Failed to sign out');

        // Signal other tabs to refresh auth state
        try {
            localStorage.setItem('auth_signout', Date.now().toString());
            localStorage.removeItem('auth_signout');
        } catch {
            // Ignore if localStorage is unavailable
        }
    }
);