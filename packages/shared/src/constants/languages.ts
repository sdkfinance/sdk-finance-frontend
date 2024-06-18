import type { IOption } from '../types';

export const LANGUAGE_CODES = {
  en: 'en',
} as const;

export type TLanguageCode = (typeof LANGUAGE_CODES)[keyof typeof LANGUAGE_CODES];

export const LANGUAGES: Record<TLanguageCode, IOption & { fullLabel: string }> = {
  [LANGUAGE_CODES.en]: {
    value: LANGUAGE_CODES.en,
    label: 'ENG',
    fullLabel: 'English',
  },
};
