export const availableApiVersions = ['v1'] as const;
export const defaultApiVersion = (import.meta.env.VUE_APP_API_VERSION ?? availableApiVersions[0]) as ApiVersion;

export type ApiVersion = (typeof availableApiVersions)[number];
