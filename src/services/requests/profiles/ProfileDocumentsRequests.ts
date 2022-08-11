import api, { apiConfig } from '@/services/api';
import { IApiResponse, IPlainObject } from '@/types/interfaces';
import { IProfileDocumentsResponse } from '@/services/requests/profiles/ProfileDocuments.types';

export const ProfileDocumentsRequests = {

  getProfileDocuments(): Promise<IApiResponse<IProfileDocumentsResponse>> {
    return api.get('/profile-documents');
  },

  getSingleProfileDocumentUrl(fileId: string, token: string): string {
    return `${window.location.origin}${apiConfig.baseURL}/media-files/${fileId}/${token}`;
  },

  linkPhotoToProfileDocuments(fileId: string, type: string): Promise<IApiResponse<IProfileDocumentsResponse>> {
    return api.post('/profile-documents', { fileId, type });
  },

  // Update profile with a plain text instead of file (for tax_id)
  updateProfileTaxIdWithNumber(documentIdentifier: string): Promise<IApiResponse<any>> {
    return api.post('/profile-documents/identifier', { documentIdentifier, type: 'tax_id' });
  },

  viewAllUploadedProfileDocuments(payload: IPlainObject): Promise<IApiResponse<any>> {
    return api.post('/profile-documents/view', payload);
  },

  approveDocument(documentId: string): Promise<IApiResponse<any>> {
    return api.post(`/profile-documents/${documentId}/approve`);
  },

  declineDocument(documentId: string): Promise<IApiResponse<any>> {
    return api.post(`/profile-documents/${documentId}/decline`);
  },

  // Can't delete file, because we already using it in the system
  // deleteProfileDocument(fileId: string): Promise<IApiResponse<void>> {
  //   return api.delete(`/media-files/${fileId}`);
  // },

};
