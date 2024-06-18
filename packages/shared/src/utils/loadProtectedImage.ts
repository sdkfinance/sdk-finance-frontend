import apiConfig from '../api';

export const loadProtectedImage = async (imageUrl: string) => {
  const result = await apiConfig.api.get(imageUrl, { baseURL: '', responseType: 'blob' });

  if (result.error) {
    return '';
  }

  const blobData = result.data as Blob;
  return URL.createObjectURL(blobData);
};
