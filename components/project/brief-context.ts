'use client';

import { createContext } from 'react';

// Keep context identity independent of Fast Refresh updates to the dialog,
// its logo, and its triggers. Retained layouts must share it with fresh pages.
export const BriefContext = createContext<((opener: HTMLElement) => void) | null>(null);

export const BriefMountContext = createContext<((element: HTMLDivElement | null) => void) | null>(null);
