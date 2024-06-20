import { errorNotification } from './notification';

export async function objectUrlToBlob(objectUrl: string) {
  try {
    const response = await fetch(objectUrl);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    if (error instanceof Error) {
      errorNotification(error.message);
    }
  }
}
