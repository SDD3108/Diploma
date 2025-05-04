"use client";

import { useEffect } from 'react';
import useAuthStore from '@/src/store/AuthStore/authStore';

export default function HydrationWrapper({ children }) {
  useEffect(() => {
    useAuthStore.getState().hydrate();
  }, []);

  return children;
}