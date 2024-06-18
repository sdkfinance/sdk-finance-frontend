/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VUE_APP_DEMO_MODE: string;
  readonly VUE_APP_CREATE_ISSUER_NOT_ALLOWED: boolean;
  readonly VUE_APP_CREATE_CURRENCY_NOT_ALLOWED: string;
  readonly VUE_APP_GOOGLE_MAP_API_KEY: string;
  readonly VUE_APP_API_VERSION: string;
  readonly BACKEND_HOST: string;
  readonly LEGACY_BUILD: string;
  readonly VUE_APP_FRONT_OFFICE_ROUTES: string | undefined;
  readonly VUE_APP_BACK_OFFICE_ROUTES: string | undefined;
  readonly VUE_APP_PHONE_VALIDATION_PATTERN: string;
  readonly VUE_APP_CUSTOM_SERIAL_VALIDATION_PATTERN: string;
  readonly VUE_APP_CUSTOM_SERIAL_VALIDATION_ENABLED: string;
  readonly VUE_APP_INIT_GOOGLE_TAG: string | undefined;
  readonly VUE_APP_GOOGLE_TAG_ID: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'vue' {
  // Vue >= 2.7
  // declare module '@vue/runtime-dom' {  // Vue <= 2.6.14
  export interface GlobalComponents {
    RouterLink: (typeof import('vue-router'))['RouterLink'];
    RouterView: (typeof import('vue-router'))['RouterView'];
  }
}

export {};
