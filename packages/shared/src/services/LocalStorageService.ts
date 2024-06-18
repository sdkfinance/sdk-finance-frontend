import config from '../config';

const AUTH_RELATED_LOCAL_STORAGE_KEYS = ['role', 'token', 'tokenExpiration'] as const;

export class LocalStorageService {
  public static get<T = any>(key: string): T | null {
    const data: string | null = window.localStorage.getItem(`${config.StorageNamespace}${key}`);

    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  public static set(key: string, value: any): void {
    const objValue = JSON.stringify(value);

    window.localStorage.setItem(`${config.StorageNamespace}${key}`, objValue);
  }

  public static remove(key: string): void {
    window.localStorage.removeItem(`${config.StorageNamespace}${key}`);
  }

  public static removeAuthRelatedFields(): void {
    AUTH_RELATED_LOCAL_STORAGE_KEYS.forEach((key) => {
      window.localStorage.removeItem(`${config.StorageNamespace}${key}`);
    });
  }

  public static removeAll(): void {
    const storage = window.localStorage || {};
    Object.keys(storage).forEach((key: string): void => {
      if (key.startsWith(config.StorageNamespace)) {
        window.localStorage.removeItem(key);
      }
    });
  }
}
