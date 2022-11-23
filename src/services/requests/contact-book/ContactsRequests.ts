import api from '@/services/api';
import {
  IContactPayload, IGetContactsOptions, IGetContactsPaginateResponse,
  IGetContactsResponse,
} from '@/services/requests/contact-book/Contacts.types';

export const ContactsRequests = {
  getRecords(options: IGetContactsOptions): Promise<IGetContactsPaginateResponse> {
    return api.post('/contact-book/contact/view', options);
  },

  getALLRecords(): Promise<IGetContactsResponse> {
    return api.get('/contact-book/contact');
  },

  createRecord(options: IContactPayload): Promise<IGetContactsResponse> {
    return api.post('/contact-book/contact', options);
  },

  updateRecord(id: string, options: IContactPayload): Promise<IGetContactsResponse> {
    return api.patch(`/contact-book/contact/${id}`, options);
  },

  deleteRecord(id: string): Promise<IGetContactsResponse> {
    return api.delete(`/contact-book/contact/${id}`);
  },

  getUnregisteredRecords(): Promise<IGetContactsResponse> {
    return api.get('/contact-book/contact/unregistered');
  },
};
