// app/(app)/dashboard/AuthHydrator.tsx
'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hydrateFromServer, User } from '@/lib/features/auth';
import type { AppDispatch } from '@/lib/features';

export default function AuthHydrator({ user }: { user: User }) {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => { dispatch(hydrateFromServer(user)); }, [dispatch, user]);
    return null;
}
