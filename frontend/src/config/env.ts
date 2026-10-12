/*
Application environment config.
Can be overridden via .env variables.
Also added fallbacks incase of no envs
*/

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') ||
  'http://localhost:8000';

export const DEBOUNCE_MS: number =
  Number(import.meta.env.VITE_DEBOUNCE_MS) || 600;
