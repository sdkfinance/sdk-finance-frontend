import apiInstance from '../../api';
import type { IApiResponse } from '../../types';
import type {
  IChangeUserDocumentStatusRequestPayload,
  ILinkProfileDocumentResponse,
  IProfileDocumentsResponse,
  IUpdateProfileIdentifierPayload,
  TUpdateProfileIdentifierApiResponse,
  TViewDocumentTypeApiResponse,
  TViewUploadedProfileDocumentsRequestPayload,
  TViewUploadedProfileDocumentsResponse,
} from './ProfileDocuments.types';

const { api, apiConfig } = apiInstance;
export const ProfileDocumentsRequests = {
  getProfileDocuments(): Promise<IApiResponse<IProfileDocumentsResponse>> {
    return api.get('/profile-documents');
  },

  getSingleProfileDocumentUrl(fileId: string): string {
    return `${window.location.origin}${apiConfig.baseURL}/media-files/${fileId}`;
  },

  linkPhotoToProfileDocuments(fileId: string, type: string): Promise<IApiResponse<ILinkProfileDocumentResponse>> {
    return api.post('/profile-documents', { fileId, type });
  },

  updateProfileIdentifier(payload: IUpdateProfileIdentifierPayload): Promise<TUpdateProfileIdentifierApiResponse> {
    const { identifier, type = 'tax_id' } = payload;
    return api.post('/profile-documents/identifier', { documentIdentifier: identifier, type });
  },

  viewAllUploadedProfileDocuments(payload: TViewUploadedProfileDocumentsRequestPayload): Promise<TViewUploadedProfileDocumentsResponse> {
    return api.post('/profile-documents/view', payload);
  },

  approveDocument(documentId: string): Promise<IApiResponse<any>> {
    return api.post(`/profile-documents/${documentId}/approve`);
  },

  declineDocument(documentId: string): Promise<IApiResponse<any>> {
    return api.post(`/profile-documents/${documentId}/decline`);
  },

  changeUserDocumentStatus(userId: string, documentId: string, payload: IChangeUserDocumentStatusRequestPayload): Promise<IApiResponse<unknown>> {
    return api.patch(`/profile-documents/${documentId}/users/${userId}`, payload);
  },

  changeDocumentStatusBusinessUser(documentId: string, payload: IChangeUserDocumentStatusRequestPayload): Promise<IApiResponse<unknown>> {
    return api.patch(`/profile-documents/${documentId}`, payload);
  },

  verifyUserDocumentViaProvider(userId: string, documentId: string, providerKey: string): Promise<IApiResponse<unknown>> {
    return api.post(`/profile-documents/${documentId}/users/${userId}/verify?providerKey=${providerKey}`);
  },

  viewDocumentTypes(): Promise<TViewDocumentTypeApiResponse> {
    return api.post('/profile-documents/view-document-types');
  },

  // Can't delete file, because we already using it in the system
  // deleteProfileDocument(fileId: string): Promise<IApiResponse<void>> {
  //   return api.delete(`/media-files/${fileId}`);
  // },
};
